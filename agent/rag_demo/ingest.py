import os
import glob
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

DATA_DIR = "./data"

def load_documents(data_dir=DATA_DIR):
    """
    Quét qua thư mục dữ liệu và nạp nội dung của các file PDF, TXT.
    Thêm metadata gốc (nguồn, trang) để xử lý bảo mật/trích dẫn sau này.
    """
    documents = []
    
    # Load TXT files
    txt_files = glob.glob(os.path.join(data_dir, "*.txt"))
    for file in txt_files:
        loader = TextLoader(file, encoding='utf-8')
        documents.extend(loader.load())

    # Load PDF files
    pdf_files = glob.glob(os.path.join(data_dir, "*.pdf"))
    for file in pdf_files:
        loader = PyPDFLoader(file)
        documents.extend(loader.load())
        
    print(f"Đã nạp {len(documents)} bản ghi (trang/file) tài liệu thô.")
    return documents

def split_documents(documents, chunk_size=1000, chunk_overlap=200):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_documents(documents)

def split_documents_small2big(documents):
    # Lớp Cắt Mẹ: Khối khổng lồ bảo vệ toàn bộ Context (để đưa cho LLM)
    parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300)
    # Lớp Cắt Con: Mẩu vụn siêu nhỏ gắn ID để dễ bắt trúng Vector ngắm bắn
    child_splitter = RecursiveCharacterTextSplitter(chunk_size=250, chunk_overlap=50)
    
    return parent_splitter, child_splitter

if __name__ == "__main__":
    print("--- Testing Ingestion ---")
    docs = load_documents(DATA_DIR)
    if docs:
        chunks = split_documents(docs)
        for i, c in enumerate(chunks[:2]): # In thử 2 chunk đầu tiên
            print(f"\n--- Thử nghiệm Chunk {i} ---")
            print(c.page_content[:200] + "...")
            print("Metadata:", c.metadata)
    else:
        print("Chưa có tài liệu nào trong thư mục data/. Hãy bỏ vài file txt/pdf vào để test.")
