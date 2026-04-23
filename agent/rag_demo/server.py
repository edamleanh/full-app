import os
import sys
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from rag_chain import create_rag_chain
from vectorstore import build_vector_store
import uvicorn

# Ngăn chặn việc chạy trùng port (nếu có)
app = FastAPI(title="RAG Enterprise Chatbot Local UI")

# Lưu giữ quy trình (pipeline) vào bộ nhớ RAM
global_chain = None

class ChatRequest(BaseModel):
    message: str

def init_system():
    global global_chain
    try:
        global_chain = create_rag_chain()
        print("[HỆ THỐNG API] Đã sẵn sàng nạp Model ngôn ngữ.")
    except Exception as e:
        print(f"[HỆ THỐNG API] Có lỗi khi kết nối mô hình cục bộ: {e}")

@app.on_event("startup")
async def startup_event():
    # Khi server bật lên sẽ tự động chạy thử tạo chain
    init_system()

@app.post("/api/chat")
async def chat(request: ChatRequest):
    global global_chain
    if not global_chain:
        init_system()
        if not global_chain:
            raise HTTPException(status_code=500, detail="Máy chủ từ chối: Hãy đẩy tệp dữ liệu vào hệ thống trước tiên!")
            
    async def generate_reply():
        try:
            async for chunk in global_chain.astream(request.message):
                yield chunk
        except Exception as e:
            yield f"\n[RAG Pipeline Lỗi]: {str(e)}"
            
    return StreamingResponse(generate_reply(), media_type="text/plain")

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Tính năng MỚI: cho phép gắp kéo file từ Web thẳng vào ổ cứng thư mục /data
    if not os.path.exists("data"):
        os.makedirs("data")
    target_path = os.path.join("data", file.filename)
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"[FILE_SYSTEM] Đã lưu tệp: {file.filename}")
        # Bắt AI học lại dữ liệu ngay lập tức
        build_vector_store()
        init_system()
        return {"message": f"Nạp tài liệu '{file.filename}' thành công. AI Nội bộ đã đọc xong!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files")
async def get_files():
    if not os.path.exists("data"):
        return {"files": []}
    files = [f for f in os.listdir("data") if f.endswith(('.pdf', '.txt'))]
    return {"files": files}

@app.post("/api/reload_db")
async def reload_db():
    try:
        # Cập nhật bằng tay trên web nếu dùng cách copy thủ công
        build_vector_store()
        init_system()
        return {"message": "Đã phân tích toàn bộ khối dữ liệu mới thành công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount Frontend App giao diện trực quan vào thư mục Root /
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    print("\n" + "="*50)
    print(" 🛡️ KHAI PHÓNG RAG WEB APP | CỔNG 8000 🛡️")
    print(" 🌐 Hãy mở trình duyệt và gõ: http://127.0.0.1:8000")
    print("="*50 + "\n")
    uvicorn.run(app, host="127.0.0.1", port=8000)
