# PDF Word Selector QA LLM Extension

<div align="center">
<img src="https://github.com/shengsylo/PDF-Word-Selector-QA-LLM-Model/blob/master/LLM_Question_Answer/logo.png?raw=true" alt="Extension Screenshot" width="400"/>
</div>

A powerful browser extension that transforms how you interact with PDFs. Extract text effortlessly, ask insightful questions, and receive precise answers directly from the document's content.

## ✨ Key Features

* **PDF & Text Support:**  Seamlessly extract text from both PDFs and plain text documents.
* **Intuitive Question Answering:**  Ask questions in natural language and get accurate, contextually relevant answers.
* **User-Friendly Interface:**  A clean and intuitive design makes interacting with your PDFs a breeze.
* **Advanced AI:** Powered by state-of-the-art Large Language Models (LLMs) for intelligent text processing.

## 🚀 Installation

1. **Download:** Clone this repository or download the extension as a ZIP file.
2. **Chrome Extension:**
   * Open Chrome and navigate to `chrome://extensions`.
   * Enable "Developer mode" in the top right corner.
   * Click "Load unpacked" and select the downloaded extension folder.
3. **Run Server:**
   * Open your terminal and navigate to the extension directory.
   * Run `app.py` to start the server.

## 🛠️ Technical Details

* **Embedding Model:** `hkunlp/instructor-large` by Hong Kong University NLP
* **Vector Store:** Facebook AI Similarity Search (Faiss) indexing
* **LLM:** `tiiuae/falcon-7b-instruct` (pretrained on `tiiuae/falcon-refinedweb` dataset)
* **RetrievalQA Chain:** Utilizes the "stuff chain" approach for efficient question answering.

## 💡 How It Works

1. **Input:** Upload your PDF or paste text directly.
2. **Preprocessing:** The text is cleaned and prepared for analysis.
3. **Embedding:** The text is converted into numerical representations for efficient comparison.
4. **Vector Store:** Embeddings are indexed for quick similarity search.
5. **Question:** Ask your question in plain language.
6. **Retrieval:** Relevant passages are retrieved using the LLM.
7. **Answer Generation:** The LLM generates a concise and accurate answer based on the retrieved passages.

## 🎯 Keywords

PDF, text extraction, question answering, LLM, natural language processing, information retrieval, document analysis, AI-powered extension, browser extension

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
