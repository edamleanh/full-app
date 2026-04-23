import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from vectorstore import get_hybrid_retriever

load_dotenv()

def get_llm():
    """ 
    Khởi tạo mô hình Ngôn ngữ tổng hợp (100% OFFLINE). 
    Sử dụng Ollama để chạy mô hình ngôn ngữ cục bộ. Yêu cầu tải sẵn app Ollama.
    Dữ liệu đảm bảo 100% không đi ra khỏi môi trường doanh nghiệp.
    """
    print("[INFO] Đang kết nối với Local LLM (qua Ollama model: llama3)...")
    return ChatOllama(model="llama3", temperature=0.2, top_p=0.9)

def format_docs(docs):
    """ Định dạng các Vector Chunks với nguồn rõ ràng """
    formatted = []
    for doc in docs:
        source = doc.metadata.get("source", "Tài liệu hệ thống")
        formatted.append(f"--- [Trích từ: {os.path.basename(source)}] ---\n{doc.page_content}")
    return "\n\n".join(formatted)

def create_rag_chain():
    """ 
    Khởi tạo quy trình RAG hoàn chỉnh. Trọng tâm: Xây dựng Prompt chặn Hallucination.
    """
    retriever = get_hybrid_retriever()
    if not retriever:
        return None
    
    llm = get_llm()
    
    # CORE VALUE: ANTI-HALLUCINATION PROMPT 
    system_prompt = (
        "Bạn là Thẩm định viên Thông tin Cấp cao của Tập đoàn.\n"
        "Bạn chỉ có MỘT NHIỆM VỤ DUY NHẤT: Trích xuất sự thật từ <Context> bên dưới và dịch sang TIẾNG VIỆT.\n\n"
        "CÁC QUY TẮC CỐT LÕI VÀ KỶ LUẬT (VI PHẠM LÀ BỊ XÓA BỎ):\n"
        "1. KHÔNG SÁNG TÁC (NO HALLUCINATION): Nếu người dùng hỏi về một công ty, tên riêng, hoặc sự kiện mà TÊN ĐÓ KHÔNG HỀ XUẤT HIỆN trong <Context>, bạn BẮT BUỘC phải nói rõ: 'Tôi không tìm thấy thông tin về [Tên đó] trong tài liệu'. Tuyệt đối không được đoán mò hoặc ghép nối chữ.\n"
        "2. PHÂN TÍCH CHỦ NGỮ CẨN THẬN: Đừng nhầm lẫn vai trò! Ví dụ: Nếu tài liệu nói 'Phần mềm này giúp giáo viên chấm điểm', thì ứng viên KHÔNG PHẢI là giáo viên, ứng viên là người lập trình phần mềm. Hãy đọc thật kỹ ứng viên (My position/Role) đã làm gì.\n"
        "3. NGÔN NGỮ ĐẦU RA: BẮT BUỘC 100% TIẾNG VIỆT.\n"
        "4. TỪ CHỐI AN TOÀN: Nếu không có dữ liệu nào khớp với câu hỏi cả, lập tức ngắt quãng và trả lời: 'Xin lỗi, theo các tài liệu nội bộ hiện tại, tôi chưa tìm thấy thông tin này.'\n"
        "5. TRÍCH DẪN: Kết thúc câu trả lời bằng cách liệt kê danh sách nguồn dưới dạng: (Các nguồn: [Trích từ: ...])\n\n"
        "<Context>\n"
        "{context}\n"
        "</Context>\n\n"
        "(Cảnh báo cuối: Chấm điểm dựa trên mức độ TRUNG THỰC tuyệt đối với <Context>. Nếu không thấy tên tổ chức/công ty trong bản gốc, KHÔNG ĐƯỢC BỊA RA. Trả lời bằng tiếng Việt.)"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Câu hỏi của nhân viên: {question}\n(Lệnh ép buộc: Phân tách từng công ty được hỏi. Có thì dịch ra, Không có thì nói thẳng là không có thông tin)")
    ])
    
    # Kết nối Pipeline: Câu hỏi -> Tìm Vector -> Dựng Prompt -> Gọi LLM -> Lấy string
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain

if __name__ == "__main__":
    chain = create_rag_chain()
    if chain:
        print("\n--- Kiểm thử RAG Pipeline ---")
        answer = chain.invoke("Chính sách nghỉ phép kết hôn của công ty là bao nhiêu ngày?")
        print(answer)
