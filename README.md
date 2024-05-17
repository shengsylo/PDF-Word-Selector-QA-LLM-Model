# PDF Word Selector QA LLM Model
 This extension is used to extract text from PDF and answer questions based on the text
<h1>My PDF Word Selector QA Extension</h1> 
<p>A powerful browser extension that enables you to extract text from PDFs and ask insightful questions, getting concise and relevant answers from the document's content.</p>

<h2>Key Features</h2>
<ul>
  <li>PDF & Text Support</li>
  <li>Intuitive Question Answering</li>
  <li>User-Friendly Interface</li>
</ul>

<h2>Installation</h2>
<ol>
  <li>Install the extension into Chrome by using Load Unpacked Package</li>
  <li>Run app.py</li>
</ol>
<p> After the Installation you may use the extension ~ </p>

<oi>
  <li>langchain_community > Version: 0.0.18</li>
  <li>InstructorEmbedding > Version: 1.0.1</li>
  <li>langchain > Version: 0.1.2</li>
  <li>torch > Version: 2.2.2</li>
</ol>

<h2>Flow</h2>
<div>
  <p>1. Allow User Input / Upload Document.</p>
  <p>2. Preprocessing document/user input.</p>
  <p>3. Embedding > <b>hkunlp/instructor-large by HongKongUniversity NLP<link rel="stylesheet" href="https://huggingface.co/hkunlp/instructor-large"></b></p>
  <p>4. Vector Store > Facebook AI Similarity Search (Faiss) indexing <b><link rel="stylesheet" href="https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/"></b></p>
  <p>5. Question(query) received from user </p>
  <p>6. LLM retrieve relevant passages > <b>tiiuae/falcon-7b-instruct <link rel="stylesheet" href="https://huggingface.co/tiiuae/falcon-7b-instruct"></b>, the LLM is trained pretrained by dataset <b><link rel="stylesheet" href="https://huggingface.co/datasets/tiiuae/falcon-refinedweb"></b>.</p>
  <p>7. Generate result > RetrievalQA Chain (stuff chain) > <b><link rel="stylesheet" href="https://docs.smith.langchain.com/old/cookbook/hub-examples/retrieval-qa-chain"></b><img src="https://miro.medium.com/v2/resize:fit:1400/0*UmXjah3cpYNFxJYE.png"></p>
</div>
