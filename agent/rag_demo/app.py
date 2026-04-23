import sys
import argparse

# Force UTF-8 encoding for Windows CMD
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from rag_chain import create_rag_chain
from vectorstore import build_vector_store

def main():
    print("\n" + "="*50)
    print("   CHATBOT RAG NỘI BỘ DOANH NGHIỆP - DEMO CLI   ")
    print("="*50)
    
    parser = argparse.ArgumentParser(description="Chạy Chatbot RAG")
    parser.add_argument("--reload", action="store_true", help="Nạp lại các file PDF/TXT mới từ thư mục data/")
    args = parser.parse_args()

    if args.reload:
        print("\n[HỆ THỐNG] Bắt đầu nạp lại Dữ liệu nền...")
        build_vector_store()
    
    print("\n[HỆ THỐNG] Đang nạp Model và Pipeline...")
    chain = create_rag_chain()
    
    if not chain:
        print("[LỖI QUAN TRỌNG] Không thể kết nối Vector DB do thiếu dữ liệu.")
        print("Vui lòng đặt file .pdf hoặc .txt vào thư mục 'data' và chạy câu lệnh: python app.py --reload")
        sys.exit(1)
        
    print("\n[START] Trợ lý ảo đã sẵn sàng!")
    print("Mẹo: Hãy hỏi về nội dung tài liệu. Nếu bạn hỏi chuyện linh tinh, AI sẽ báo lỗi do luật chống Hallucination.")
    print("Phím tắt: Gõ 'exit', 'quit' để thoát.\n")
    
    while True:
        try:
            question = input("\n[NHÂN VIÊN]: ")
            if question.strip().lower() in ['thoát', 'exit', 'quit']:
                print("Tắt hệ thống AI.")
                break
                
            if not question.strip():
                continue
                
            print("\n[AI ĐANG TRUY XUẤT TÀI LIỆU HƯỚNG DẪN...]")
            answer = chain.invoke(question)
            
            print("-"*50)
            print("[AI TRẢ LỜI]:\n")
            print(answer)
            print("-"*50)
            
        except Exception as e:
            print(f"\n[LỖI]: {str(e)}")
            print("Gợi ý: Kiểm tra lại mạng hoặc khóa OPENAI_API_KEY trong file .env")

if __name__ == "__main__":
    main()
