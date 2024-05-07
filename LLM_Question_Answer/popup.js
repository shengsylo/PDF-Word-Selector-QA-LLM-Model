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
const loadResults = document.getElementById('loadResults')
let pdfData = "";

loadResults.hidden = true;
answer.hidden = true;
askButton.disabled = true;
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
    loadButton.disabled = true;
    askButton.disabled = true;
    pastedText.disabled = false;
    pastedText.value = "";
    pasteButton.disabled = false;
    pdfUpload.disabled = false;
    pdfUpload.value = "";
    pastedText.hidden = false;
    pdfUpload.hidden = false;
    pastedTextDisplay.hidden = true;
    loadResults.textContent = "";
    loadResults.hidden = true;
});

pdfUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    const reader = new FileReader();
    reader.onload = function(e) {
        pdfData = e.target.result;  
        pdfData = pdfData.split(',')[1];
        // sendDataToServer(pdfData);
    };
    reader.readAsDataURL(file); 
    pastedText.disabled = true; 
    pastedText.hidden = true;
});

pasteButton.addEventListener('click', function() {
    if(pastedText.value.length > 0){
        pastedTextDisplay.textContent = pastedText.value; 
        pastedTextDisplay.hidden = false;
    }else if(pdfData.length > 0){
        loadButton.disabled = true;
        loadButton.textContent = "Loading..."; 
        askButton.disabled = true;
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
    if (question.value.length > 0) {
        processAndSendQuery(question.value)
    } else {
        alert("Please enter a question.");
    }
});

async function processAndSendQuery(question){
    askButton.disabled = true;
    askButton.textContent = "Asking...";
    let rtn = await sendQuery(question)
    if(rtn){
        console.log("answer received", rtn); 

        let answers = rtn.rtn.answer; 
    
        // answers = answers.replace('Use the following pieces of context to answer the question at the end. If you don\'t know the answer, just say that you don\'t know, don\'t try to make up an answer.\n\n', '');
        // const answerTextNode = document.createTextNode(answers);
        // const answerElement = document.createElement('div'); 
        // answerElement.id = 'text'; // Assign the ID
        // answerElement.appendChild(answerTextNode); 
        // answer.appendChild(answerElement); 

        answer.innerHTML = answers;
        answer.hidden = false;
    }else{
        console.log("Failed to get answer");
        answer.append(rtn); 
    }



    
    askButton.disabled = false;
    askButton.textContent = "Ask";
}

function sendDataToServer(data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/load", true);  
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            loadButton.disabled = false;
            loadButton.textContent = "Load";
            askButton.disabled = false; 
            pastedTextDisplay.textContent = response.extracted_text;  
            pastedTextDisplay.hidden = false;
        } else {
            console.error("Error from server:", xhr.responseText);
        }
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
        try {
            rtn = await sendTextToServer(textToLoad);
            console.log("rtn: ", rtn);
            if(rtn) {
                loadButton.textContent = "Text Loaded"
                askButton.disabled = false;
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