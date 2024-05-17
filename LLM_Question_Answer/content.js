console.log("Content script running!")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("check if the listener working or not!",message)
    // sendResponse({message: "from content.js"});
    if (message.action === "getHTML") {
      const htmlContent = document.documentElement.outerHTML;
      sendResponse(htmlContent);
    }
  });
console.log("Content script running!!")

// "host_permissions": ["http://127.0.0.1:5000/*"],
// ,
  
//     "content_scripts": [
//       {
//         "matches": ["<all_urls>"], 
//         "js": ["content.js"],
//         "run_at": "document_start"
//       }
//     ]