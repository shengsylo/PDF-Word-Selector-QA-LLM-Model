let isSelecting = false;
const pdfUpload =  document.getElementById('pdfUpload') 
const clearButton = document.getElementById('clearButton');
const pastedTextDisplay = document.getElementById('pastedTextDisplay');
const pastedText = document.getElementById('pasteText'); 
const pasteButton = document.getElementById('pasteButton');
const askButton = document.getElementById('askButton');
const question = document.getElementById('question');
const loadButton = document.getElementById('loadButton');
const answer = document.getElementById('answer');
const loadResults = document.getElementById('loadResults');
let pdfData = "";

const btn_layout = document.getElementById('btn-layout');
const pdfUpload_label = document.getElementById('pdfUpload_label');
const pdfClick = document.getElementById('pdf_click');
const articleClick = document.getElementById('article_click');
const iframeContainer = document.getElementById('iframe_container');
const fileContainer = document.getElementById('file_container');
const textContainer = document.getElementById('text_container');
const resultContainer = document.getElementById('result_container');
const iframe = document.getElementById('iframe');
const uploadFile = document.getElementById('upload_file');

const conversationClick = document.getElementById('conversation_click');
const featureClick = document.getElementById('feature_click');
// const conversation = document.getElementById('conversation');
// const feature = document.getElementById('feature');



conversationClick.click();

conversationClick.addEventListener('click', function() {
    conversation.classList.remove("hidden");
    feature.classList.add("hidden");
    conversation.style.display = "block";
    conversation.hidden = false;
    resultContainer.hidden = true;
    feature.style.display = "none";
});

featureClick.addEventListener('click', function() {
    conversation.classList.add("hidden");
    feature.classList.remove("hidden");
    conversation.style.display = "none";
    conversation.hidden = true;
    feature.style.display = "block";
    if(answer.innerHTML == ""){
        resultContainer.hidden = true;
    }else{
        resultContainer.hidden = false;
    }
});

pdfClick.addEventListener('click', function() {
    if(loadButton.textContent != "Loading..."){
        btn_layout.style.left = '0';
        pdfUpload_label.disabled = false;
        pdfUpload_label.hidden = false;
        pastedText.hidden = true;
        textContainer.hidden = true;
        uploadFile.hidden = true;
        iframeContainer.hidden = true;
        fileContainer.hidden = false;
        fileContainer.classList.remove('d-none')
        pdfUpload.value = "";
        loadButton.disabled = true;
        pasteButton.disabled = false;
        pastedText.disabled = false;
        pastedText.value = "";
    }
});

articleClick.addEventListener('click', function() {
    if(loadButton.textContent != "Loading..."){
        btn_layout.style.left = '150px';
        pdfUpload_label.disabled = true;
        pdfUpload_label.hidden = true;
        pastedText.hidden = false;
        textContainer.hidden = false;
        uploadFile.hidden = true;
        iframeContainer.hidden = true;
        fileContainer.hidden = false;
        fileContainer.classList.add('d-none')
        pdfUpload.value = "";
        loadButton.disabled = true;
        pasteButton.disabled = false;
        pastedText.disabled = false;
        pastedText.value = "";
    }
});

loadResults.hidden = true;
answer.hidden = true;
resultContainer.hidden = true;
askButton.disabled = true;
question.disabled = true;
loadButton.disabled = true;
pastedTextDisplay.hidden = true;


pastedText.addEventListener('input', function(){
    pdfUpload.disabled = true;
    pdfUpload.hidden = true;
});

loadButton.addEventListener('click', function() {
    const textToLoad = pastedTextDisplay.textContent;
    processAndSendText(textToLoad);
    
});

clearButton.addEventListener('click', function(){

    pastedTextDisplay.textContent = "";
    loadButton.innerHTML = "Load";
    pastedText.value = "";
    pdfUpload.value = "";
    loadResults.textContent = "";


    askButton.disabled = true;
    pastedText.disabled = true;

    pdfUpload.disabled = false;

    pdfUpload.hidden = false;
    loadResults.hidden = true;
    iframeContainer.hidden = true; 
    fileContainer.hidden = false; 
    fileContainer.classList.remove('d-none')
    pastedTextDisplay.hidden = true;
    pdfClick.click();

    answer.hidden = true;
    resultContainer.hidden = true;
    answer.innerHTML = "";
    question.value = "";
    clearConversation();
});

function clearConversation() {
    while (conversation.firstChild) {
      conversation.removeChild(conversation.firstChild);
    }
  }

pdfUpload.addEventListener('change', function(event) {

    const file = event.target.files[0]; 
    const reader = new FileReader();

    pdfUpload_label.disabled = true;
    pdfUpload_label.hidden = true;
    uploadFile.hidden = false;
    uploadFile.innerHTML = file.name + " -- Uploaded Successfully!";

    reader.onload = function(e) {
        pdfData = e.target.result;  
        iframe.src = pdfData
        pdfData = pdfData.split(',')[1];
        // sendDataToServer(pdfData);
    };
    reader.readAsDataURL(file); 
});

pasteButton.addEventListener('click', function() {
    if(pastedText.value.length > 0){
        pastedTextDisplay.textContent = pastedText.value; 
// meng change false to true
        pastedText.disabled = true;
        pastedTextDisplay.hidden = true;
        // pastedTextDisplay.hidden = false;
    }else if(pdfData.length > 0){
        iframeContainer.hidden = false;
        fileContainer.hidden = true;
        fileContainer.classList.add('d-none')
        loadButton.disabled = true;
        loadButton.textContent = "Loading..."; 
        btn_layout.disabled = true;
        pdfClick.disabled = true;
        articleClick.disabled = true;
        askButton.disabled = true;
        question.disabled = true;
        uploadFile.hidden = true;
        sendDataToServer(pdfData);
    }else{
        alert("Please paste some text first.");
        return 
    }
    loadButton.innerHTML = "Load";
    pasteButton.disabled = true;
    loadButton.disabled = false;
});

askButton.addEventListener('click', function() {
    askButton.disabled = true;
    if (question.value.length > 0) {
        processAndSendQuery(question.value)
    } else {
        alert("Please enter a question.");
    }
    // question.value = "";
    setTimeout(() => {
        askButton.disabled = false;
    }, 1000);
});

let questionList = []
let answerList = []
const conversation = document.getElementById('conversation');
const feature = document.getElementById('feature');

async function processAndSendQuery(question) {
    console.log("check questionL: ", question)
    // questionList.append(question);
    askButton.disabled = true;
    question.disabled = true;
    askButton.textContent = "Asking...";
    let answers = "";
    try {
      let rtn = await sendQuery(question);
      if (rtn) {
        console.log("answer received", rtn);
  
        answers = rtn.rtn.answer;
        console.log("check answers: ", answers)
        // answerList.append(answers);
  
        answer.textContent = answers;
        answer.hidden = false;
        if (conversation.hidden == false){
            resultContainer.hidden = true;
        }else{
            resultContainer.hidden = false;
        }
      } else {
        console.error("Failed to get answer");
        answer.textContent = "Hmm, something went wrong. Try rephrasing your question.";
      }
    } catch (error) {
      console.error("Error processing query:", error);
      answer.textContent = "An unexpected error occurred. Please try again later.";
    } finally {
      askButton.disabled = false;
      question.disabled = false;
      askButton.textContent = "Send";
      createConversation(question, answers); // Pass the question to createConversation
    }
}

function createConversation(question, answers) {
    const parser = new DOMParser();
    let questionHTML = `
        <div class="row g-0 d-flex justify-content-end">
            <div class="col-8">
                <p class="text-end m-0"><strong>You</strong><p>
                <p class="text-end m-0">${question}</p>
            </div>
            <div class="col-1 ps-2">
                <img src="user.png" alt="user" class="border w-100 rounded-circle bg-primary">
            </div>
      </div>
    `;
    const docFragment = parser.parseFromString(questionHTML, "text/html");
    const conversationElement = docFragment.querySelector('.row');
    conversation.appendChild(conversationElement);

    let answerHTML = `
    <div class="row g-0 d-flex justify-content-start">
        <div class="col-1 pe-2">
            <img src="logo.png" alt="bot" class="border w-100 rounded-circle bg-light">
        </div>
        <div class="col-8">
            <p class="text-start m-0"><strong>PDF Master</strong></p>
            <p class="text-start m-0">${answers}</p>
        </div>
    </div>
    `;
    const docFragment_2 = parser.parseFromString(answerHTML, "text/html");
    const conversationElement_2 = docFragment_2.querySelector('.row');

    // Update the processing message after a short delay (simulates processing time)
    conversation.scrollTop = conversation.scrollHeight;
    setTimeout(() => {
        conversation.appendChild(conversationElement_2);
        conversation.scrollTop = conversation.scrollHeight;
    }, 1000); // Adjust delay as needed
}

function sendDataToServer(data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/load", true);  
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log("response", response)
            loadButton.disabled = false;
            loadButton.textContent = "Load";
            askButton.disabled = false; 
            question.disabled = false;
            pastedTextDisplay.textContent = response.extracted_text;  

            // meng change to true
            pastedTextDisplay.hidden = true;
            // pastedTextDisplay.hidden = false;
        } else {
            console.error("Error from server:", xhr.responseText);
        }
        btn_layout.disabled = false;
        pdfClick.disabled = false;
        articleClick.disabled = false;
    };
    xhr.send(JSON.stringify({ data: data }));  
}

async function sendTextToServer(data) { 
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/load_text", true); 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    return new Promise((resolve) => {
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = xhr.responseText; 
                console.log("response", response);
                if (response.rtn !== "false") { 
                    loadResults.innerText = response;
                    loadResults.hidden = false; 
                    resolve(xhr.responseText); 
                } else{
                    console.error("Error retrieving response from server");
                    resolve(xhr.responseText);
                }
            } else {
                console.error("Error from server:", xhr.responseText);
                resolve(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({ text: data })); 
    });
}

function sendQuery(question) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/query", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    return new Promise((resolve) => {
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                console.error("Error from server:", xhr.responseText);
                resolve(xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({ question: question }));
    });
}

async function processAndSendText(textToLoad) {
    if (textToLoad.length > 0) {
        loadButton.disabled = true;
        loadButton.textContent = "Loading...";
        askButton.disabled = true;
        question.disabled = true;
        try {
            rtn = await sendTextToServer(textToLoad);
            console.log("rtn: ", rtn);
            if(rtn) {
                loadButton.textContent = "Text Loaded"
                askButton.disabled = false;
                question.disabled = false;
            }else{
                loadButton.textContent = "Failed to Load Text";
            }
        } catch(error) {
            console.error("Error while sending text:", error);
        }
    } else {
        alert("Please paste some text first.");
    }
}