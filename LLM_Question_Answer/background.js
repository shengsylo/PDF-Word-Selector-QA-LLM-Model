chrome.runtime.onInstalled.addListener(function() {
    // alert('Thanks for installing!');
    
    console.log('Installing');
    chrome.tabs.create({
        // url: 'https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1000&h=563&crop=1&resize=1000%2C563',
        active: true
    });
    return false;
});

