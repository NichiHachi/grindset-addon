const currentUrl = window.location.href;
var data = {};

if(!!chrome){
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.storage.local.set(request, function () {
            console.log(request);
        });
        sendResponse({ result: "Data recieved!" });
    });
}
else if(!!browser){
    browser.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            browser.storage.local.set(request, function () {
                console.log(request);
            });
            sendResponse({ result: "Data recieved!" });
        });

    }
else{
    console.log("The navigator is not supported");
}

if(!!chrome){
chrome.storage.local.get(null, function (data) {
    start(data);
});
}
else if(!!browser){
    browser.storage.local.get(null, function (data) {
        start(data);
    });
}
else{
    console.log("The navigator is not supported");
}


function start(data){
    checkWebsite(currentUrl,data).then(result => {
        if (result) {
            // More like me when I did the data transfer...
            console.log("So you choose death.");
            if(data.redirectURL===""){
            parseLeetCode().then(problemSelected => {
                window.location.href = "https://leetcode.com/problems/" + problemSelected.stat.question__title_slug;
            });
            }
            else{
                if(data.redirectURL.includes("http")){
                    window.location.href = data.redirectURL;
                }
                else{
                    window.location.href = "http://"+data.redirectURL;
                }
            }
        }
        else {
            console.log("The website is safe :)");
        }
    });
}

/**
* This function checks if the URL is a nsfw website.
* @param {string} URL - The URL to check.
* @returns {boolean} - Return true if it has a lot of nsfw words or a big no no word.
*/
async function checkWebsite(URL,data) {
    var nsfwWordsBigNoNo = [];
    var blackListWords = [];
    const dataBlackList = data.blackList.split(/[ ,\n]+/).filter(Boolean);
    if(data.blackListOnly!==true){
        nsfwWordsBigNoNo = ['adult-oriented', 'age-restricted'];
        blackListWords = ['hentai', 'xxx', 'porn', 'sex', 'pussy', 'nude'];
        blackListWords.push(...dataBlackList);
    }
    else{
        blackListWords = dataBlackList;
    }

    return parseAndAnalyze(URL, blackListWords,nsfwWordsBigNoNo,data);
}

/**
 * This function parses the URL and checks the nsfw words in it. 
 * @param {string} URL - The URL to parse.
 * @param {[string]} blackListWords - The list of word to check.
 * @returns {object} - Return a hash map of the number of nsfw word.
 */
async function parseAndAnalyze(URL, blackListWords,nsfwWordsBigNoNo,data) {
    const whiteListedWebsites = ['google.com/', 'leetcode.com/'];
    whiteListedWebsites.push(...data.whiteList.split(/[ ,\n]+/).filter(Boolean));
    // If the page contains NSFW words
    if (!whiteListedWebsites.some(website => URL.toLowerCase().includes(website))) {
        try {
            const response = await fetch(URL, { method: 'GET', mode: 'cors' });
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const textContent = doc.body.innerText.toLowerCase();

            if (blackListWords.some(word => URL.toLowerCase().includes(word))) {
                console.log("The URL is a bit sussy !");
                return true;
            }

            if (nsfwWordsBigNoNo.some(word => textContent.includes(word))) {
                return true;
            }

            let wordCount = 0;
            blackListWords.forEach(word => {
                wordCount += (textContent.match(new RegExp(word, 'g')) || []).length;
                // If the word count is greater than the sensitivity, that's a big no no!
                // Function : (x/5)^2+x+1
                if (wordCount >= (data.sensitivity/5)**2+data.sensitivity+1) {
                    return true;
                }
            });

            return false;
        }
        catch (error) {
            console.error('Error when loading the page:', error);
        }
    }
    else {
        console.log('This is a WhiteListed website !');
    }

    return false;
}

/**
 * This function parses the LeetCode API and returns a random problem.
 * @returns {object} - Return a random problem.
 */
async function parseLeetCode() {
    var leetCodeAPI;
    if(typeof browser !== "undefined"){
        leetCodeAPI = "https://leetcode.com/api/problems/all/";
    }
    else if(typeof chrome !== "undefined"){
        leetCodeAPI =  "https://cors-anywhere.herokuapp.com/" + "https://leetcode.com/api/problems/all/";
    }
    try {
        const response = await fetch(leetCodeAPI, { method: 'GET', mode: 'cors' });
        const data = await response.json();

        // Take only the free problems
        const listProblems = data.stat_status_pairs.filter(item => !item.paid_only);

        // Select and return a random problem
        return listProblems[Math.floor(Math.random() * listProblems.length) + 1];
    }
    catch (error) {
        console.log('Error when loading the page:', error);
    }
}