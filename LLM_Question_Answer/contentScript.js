// contentScript.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "extractWebText") {
        console.log("Received request to extract text in content script"); // Add this log
        
        // Retrieve the entire text content of the web page
        const webText = document.body.innerText;

        // Send the extracted text to the background script
        chrome.runtime.sendMessage({
            action: "processWebText",
            text: webText,
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to background script:", chrome.runtime.lastError);
            } else {
                console.log("Message sent to background script:", { action: "processWebText", text: webText });
            }
        });
    }
});
