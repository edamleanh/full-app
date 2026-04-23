import os
import pickle
import shutil
import uuid
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.retrievers import BM25Retriever
from langchain_core.retrievers import BaseRetriever
from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from typing import List
from ingest import load_documents, split_documents_small2big, DATA_DIR

DB_DIR = "./chroma_db"
BM25_FILE = os.path.join(DB_DIR, "bm25_model.pkl")

def get_embedding_model():
    """ Mã hóa Ý TƯỞNG thành Vecto """
    print("[CORE] Đang nạp HuggingFace Embedding Model...")
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def build_vector_store():
    """ 
    Tiến trình Nạp Đạn Xuyên Giáp (Small2Big Modular Ingestion) 
    """
    docs = load_documents(DATA_DIR)
    if not docs:
        print("Không có Document để nạp.")
        return

    # Hệ thống tháo rã liên minh Mẹ-Con
    parent_splitter, child_splitter = split_documents_small2big(docs)
    parent_docs = parent_splitter.split_documents(docs)
    
    docstore = {}
    child_docs_for_chroma = []
    
    print("[Small2Big] Phân tách kiến trúc...")
    for pd in parent_docs:
        pid = str(uuid.uuid4())
        docstore[pid] = pd # Đưa vào kho cha
        
        children = child_splitter.split_documents([pd])
        for cd in children:
            cd.metadata['doc_id'] = pid # Gắn tag GPS chỉ về kho cha
            child_docs_for_chroma.append(cd)

    embeddings = get_embedding_model()
    
    # 1. Quét dọn DB cũ bằng API của Chroma thay vì xóa thư mục cứng (tránh lỗi Windows Permission Error)
    if os.path.exists(DB_DIR):
        print("[SYNC] Xóa dữ liệu Collection cũ...")
        try:
            temp_chroma = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
            temp_chroma.delete_collection()
        except:
            pass

    # 2. Vector DB (Chroma) Lưu các mảnh Nhỏ Li Ti (Child) để Bắn Cực Kỳ Chính Xác
    print("[SYNC] Đang nạp hệ Vector Mẩu Nhỏ...")
    Chroma.from_documents(child_docs_for_chroma, embeddings, persist_directory=DB_DIR)
    
    # 3. Keyword BM25 Lưu cục To Khổng Lồ (Parent)
    print("[SYNC] Đang nạp hệ BM25 Từ Khóa Mẩu Mẹ...")
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
    bm25 = BM25Retriever.from_documents(parent_docs)
    with open(BM25_FILE, "wb") as f:
        pickle.dump(bm25, f)
        
    # 4. Ghi ổ cứng Bệnh Án Ngoại Trú (DocStore)
    with open("docstore.pkl", "wb") as f:
        pickle.dump(docstore, f)
        
    print("[SUCCESS] Đã Khởi tạo Modular Small2Big!")

def get_hybrid_retriever():
    """ 
    Module Máy Cắt Ghép Modular RAG 
    """
    class CustomEnsembleRetriever(BaseRetriever):
        retrievers: list
        weights: list
        docstore: dict
        c: int = 60
        
        def _get_relevant_documents(self, query: str, *, run_manager: CallbackManagerForRetrieverRun) -> List[Document]:
            doc_scores = {}
            doc_map = {}
            
            # Bộ lọc nhiễu Tiếng Việt
            stop_words = {"là", "ai", "gì", "như", "thế", "nào", "tại", "sao", "có", "không", "cho", "?", "một", "những", "các", "và", "của"}
            q_words = [w for w in query.split() if w.lower().strip('?') not in stop_words]
            clean_query = " ".join(q_words) if q_words else query

            for i, (weight, retriever) in enumerate(zip(self.weights, self.retrievers)):
                # Động cơ BM25 (index 0) cực kỳ nhạy cảm -> Dùng clean_query. Chroma (Vector - index 1) dùng query nguyên bản.
                actual_query = clean_query if i == 0 else query 
                raw_docs = retriever.invoke(actual_query)
                
                # CƠ CHẾ SMALL-TO-BIG RETRIEVAL MODULE
                processed_docs = []
                seen = set()
                for d in raw_docs:
                    # Nếu là tài liệu chui từ Vector ra (Chứa Child_id) -> Đảo ngược về Parent Document
                    pid = d.metadata.get('doc_id')
                    if pid and pid in self.docstore:
                        parent_doc = self.docstore[pid]
                        # Chống đúp Parent vì 1 lúc có thể móc ra nhiều Child
                        if parent_doc.page_content not in seen:
                            seen.add(parent_doc.page_content)
                            processed_docs.append(parent_doc)
                    else:
                        if d.page_content not in seen:
                            seen.add(d.page_content)
                            processed_docs.append(d)
                
                for rank, doc in enumerate(processed_docs):
                    if doc.page_content not in doc_scores:
                        doc_scores[doc.page_content] = 0.0
                        doc_map[doc.page_content] = doc
                    
                    # Tính điểm cơ bản RRF
                    base_score = weight * (1.0 / (rank + self.c))
                    
                    # Bệnh 1: N-Gram độ dài >= 2
                    query_tokens = clean_query.lower().split()
                    boost_applied = False
                    for length in range(len(query_tokens), 1, -1):  
                        for start_idx in range(len(query_tokens) - length + 1):
                            phrase = " ".join(query_tokens[start_idx:start_idx + length])
                            if phrase in doc.page_content.lower():
                                base_score += 500.0 * length
                                boost_applied = True
                                break
                        if boost_applied:
                            break
                            
                    # Bệnh 2: Tên Riêng Nhất Chữ (1-Gram Proper Nouns)
                    # Vector Model (MiniLM) và BM25 cực kỳ ngu học khi gặp câu hỏi Tiếng Việt nhưng Document Tiếng Anh
                    # Nên phải lùng bắt chính xác Từ Ngữ được in Hoa (VD: DMOJ, CodeCamp, HR, API)
                    for word in query.split():
                        # Nếu từ đó chà bá chữ IN HOA (DMOJ) hoặc Viết Hoa Chữ Cái Đầu (Lê, Võ)
                        if (word.isupper() and len(word)>1) or word.istitle():
                            # Kiểm tra giới hạn 1 từ này rơi trúng văn bản
                            if word.lower() in doc.page_content.lower():
                                base_score += 200.0 # Thưởng sồi sụt kéo vọt rank
                                
                    doc_scores[doc.page_content] += base_score
                    
            sorted_pairs = sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)
            return [doc_map[content] for content, score in sorted_pairs[:6]]
    embeddings = get_embedding_model()
    if not os.path.exists(DB_DIR):
        print("Warning: Database vector chưa được khởi tạo.")
        return None
    
    # Lấy K=20 để nhặt mẻ lưới rộng trước khi Ensemble chấm điểm lại
    chroma_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    chroma_retriever = chroma_db.as_retriever(search_kwargs={"k": 20})
    
    # 2. Khai báo cái Vợt của BM25
    if not os.path.exists(BM25_FILE):
        print("Warning: Dữ liệu BM25 hỏng, chạy lùi về chế độ Vector rủi ro.")
        return chroma_retriever
        
    with open(BM25_FILE, "rb") as f:
        bm25_retriever = pickle.load(f)
    bm25_retriever.k = 20
    
    # Đọc kho Bệnh Án Ngoại trú (DocStore)
    if not os.path.exists("docstore.pkl"):
        print("Warning: Không tìm thấy docstore.pkl cho Small2Big Retrieval.")
        return None
        
    with open("docstore.pkl", "rb") as f:
        docstore = pickle.load(f)
    
    print("[HYBRID + SMALL2BIG MODULE ON] - Kết hợp 50% BM25 & 50% Vector bằng RRF Parent Document")
    ensemble_retriever = CustomEnsembleRetriever(
        retrievers=[bm25_retriever, chroma_retriever], 
        weights=[0.5, 0.5],
        docstore=docstore
    )
    
    return ensemble_retriever

if __name__ == "__main__":
    build_vector_store()
