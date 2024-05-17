chrome.runtime.onInstalled.addListener(function() {
  console.log('Installing');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("check tabs: ", tabs)
    const tabId = tabs[0].id;
    console.log("check tabId: ", tabId)
    chrome.tabs.sendMessage(tabId, { action: "getHTML" }, (response) => {
        console.log("HTML content start:", response)
      if (chrome.runtime.lastError) {
        console.error("Failed to get HTML:", chrome.runtime.lastError);
      } else {
        console.log("HTML content:", response);
        // You can now process the received HTML content here
      }
    });
});

  // chrome.tabs.create({
  //     // url: 'https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1000&h=563&crop=1&resize=1000%2C563',
  //     active: true
  // });
  // return false;
});