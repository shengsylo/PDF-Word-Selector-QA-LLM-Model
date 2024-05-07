from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import  HuggingFaceInstructEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFaceHub
import os
from PyPDF2 import PdfReader
from flask import Flask, request, jsonify, session 
import base64
import io

app = Flask(__name__)
if 'SECRET_KEY' not in os.environ:
    app.secret_key = os.urandom(24)
os.environ['SECRET_KEY'] = base64.b64encode(app.secret_key).decode('utf-8')
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "REPLACE WITH YOUR OWN"

@app.route('/load', methods=['GET', 'POST'])

def load():
    if request.method == 'POST':
        pdf_data = request.get_data()  
        decoded_data = base64.b64decode(pdf_data)

        # pdf_reader = PdfReader(io.BytesIO(decoded_data))  
        extracted_text = get_pdf_text([io.BytesIO(decoded_data)]) 
        return jsonify(extracted_text=extracted_text) 
    else:
        return "Error: Only POST supported"

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


@app.route('/load_text', methods=['POST']) 

def load_text():
    if request.method == 'POST':
        text_to_process = request.get_data().decode('utf-8') 
        
        text_chunks = get_text_chunks(text_to_process)
        
        vectorstore = get_vectorstore(text_chunks)
        db = vectorstore.as_retriever(search_kwargs={'k': 3})
        
        retrieval_qa_chain(db,True)
        # print("bot",chain)
        
        session["text_chunks"] = text_chunks  
        session["model_name"] = "hkunlp/instructor-large"  


        return jsonify(rtn="TRUE")
    else:
        return "Error: Only POST supported"

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-large")
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def retrieval_qa_chain(db, return_source_documents):
    model_name = session.get('model_name')
    if model_name:
        embeddings = HuggingFaceInstructEmbeddings(model_name=model_name) 
        llm = HuggingFaceHub(repo_id="tiiuae/falcon-7b-instruct", model_kwargs={"temperature":0.6,"max_length":500, "max_new_tokens":700})
        qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type='stuff', retriever=db, return_source_documents=return_source_documents)
        return qa_chain
    else:
        return None 

@app.route('/query', methods=['POST']) 

def query():
    app.secret_key = os.environ.get('SECRET_KEY') 
    if 'text_chunks' in session:
        text_chunks = session['text_chunks']
        vectorstore = get_vectorstore(text_chunks)
        db = vectorstore.as_retriever(search_kwargs={'k': 3})
        chain = retrieval_qa_chain(db, True) 
        
    if request.method == 'POST':
        question = request.get_data().decode('utf-8') 
        rtn = process_question(question,chain)

        answer = rtn['result']  
        source_documents = [doc.page_content for doc in rtn.get('source_documents', [])]  

        return_data = {'answer': answer, 'source_documents': source_documents}
        return jsonify(rtn=return_data)
    else:
        return "Error: Only POST supported"
    
def process_question(question, chain):
    response = chain(question)
    return response 

if __name__ == '__main__':
    app.run()
