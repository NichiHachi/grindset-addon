const currentUrl = window.location.href;

const defaultChoices = {
    sensitivity: 25,
    blackListOnly: false,
    blackList: "",
    whiteList: "",
    redirectURL: ""
}

// If the navigator is Chrome, get the data stored in the google local storage and start the extension.
if (!!chrome) {
    chrome.storage.local.get(null, function (dataUserChoices) {
        start(Object.keys(dataUserChoices).length === 0 ? defaultChoices : dataUserChoices);
    });
}
// If the navigator is Firefox, get the data stored in the firefox local storage and start the extension.
else if (!!browser) {
    browser.storage.local.get(null, function (dataUserChoices) {
        start(Object.keys(dataUserChoices).length === 0 ? defaultChoices : dataUserChoices);
    });
}
else {
    console.log("The navigator is not supported");
}

// Get the userDataChoices from the popup
if (!!chrome) {
    chrome.runtime.onMessage.addListener(
        function (request, sendResponse) {
            chrome.storage.local.set(request, function () {
                console.log(request);
            });
            sendResponse({ result: "Data received!" });
        });
}
else if (!!browser) {
    browser.runtime.onMessage.addListener(
        function (request, sendResponse) {
            browser.storage.local.set(request, function () {
                console.log(request);
            });
            sendResponse({ result: "Data received!" });
        });
}
else {
    console.log("The navigator is not supported");
}

/**
 * This function starts the extension.
 * @param {object} dataUserChoices The user choices.
 */
function start(dataUserChoices) {
    checkWebsite(currentUrl, dataUserChoices).then(result => {
        if (result) {
            // More like me when I did the dataUserChoices transfer...
            console.log("So you choose death.");
            // If the user didn't enter an URL to be redirected, we redirect him to a random LeetCode problem.
            if (dataUserChoices.redirectURL === "") {
                parseLeetCode().then(problemSelected => {
                    window.location.href = "https://leetcode.com/problems/" + problemSelected.stat.question__title_slug;
                });
            }
            // Else we redirect him to the URL he entered.
            else {
                // Verify if the URL contains http or https (Otherwise the user can't be redirected).
                if (dataUserChoices.redirectURL.includes("http")) {
                    window.location.href = dataUserChoices.redirectURL;
                }
                else {
                    window.location.href = "http://" + dataUserChoices.redirectURL;
                }
            }
        }
        else {
            console.log("The website is safe :)");
        }
    });
}

/**
* This function checks if the URL is safe to go.
* @param {string} URL The URL to check.
* @param {object} dataUserChoices The user choices.
* @returns {boolean} Return true if the URL or the website countain the blacklisted words.
*/
async function checkWebsite(URL, dataUserChoices) {
    const userBlackList = dataUserChoices.blackList.split(/[ ,\n]+/).filter(Boolean);

    // If the user didn't check the "Blacklist only" checkbox, we add his list to the default blacklisted words
    const blackList = dataUserChoices.blackListOnly ? userBlackList : ['hentai', 'xxx', 'porn', 'sex', 'pussy', 'nude', ...userBlackList];
    const nsfwWordsBigNoNo = dataUserChoices.blackListOnly ? [] : ['adult-oriented', 'age-restricted'];

    return parseAndAnalyze(URL, blackList, nsfwWordsBigNoNo, dataUserChoices);
}

/**
 * This function parses the URL and checks the blacklist words is in it.
 * @param {string} URL - The URL to parse.
 * @param {[string]} blackList - The list of word to check.
 * @param {[string]} nsfwWordsBigNoNo - The list of word to check.
 * @param {object} dataUserChoices - The user choices.
 * @returns {boolean} - Return true if the website countain more then the userChoices blacklist words. (By default it's >= 25)
 */
async function parseAndAnalyze(URL, blackList, nsfwWordsBigNoNo, dataUserChoices) {
    const whiteListedWebsites = ['google.com/', 'leetcode.com/', ...dataUserChoices.whiteList.split(/[ ,\n]+/).filter(Boolean)];

    // If the page is a whitelisted website, we don't need to check it.
    if (!whiteListedWebsites.some(website => URL.toLowerCase().includes(website))) {
        try {
            const response = await fetch(URL, { method: 'GET', mode: 'cors' });
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const textContent = doc.body.innerText.toLowerCase();

            // If the URL contains a blacklisted word, that's a big no no!
            if (blackList.some(word => URL.toLowerCase().includes(word))) {
                console.log("The URL is a bit sussy !");
                return true;
            }

            // If the website contains a certain blacklisted word, that's a big no no!
            if (nsfwWordsBigNoNo.some(word => textContent.includes(word))) {
                return true;
            }

            // Check if the website contains more than the detection sensitivity.
            const countOccurrences = (text, regex) => (text.match(regex) || []).length;
            let wordCount = blackList.reduce((count, word) => count + countOccurrences(textContent, new RegExp(word, 'g')), 0);
            // Function : (x/5)^2+x+1
            if (wordCount >= (dataUserChoices.sensitivity / 5) ** 2 + dataUserChoices.sensitivity + 1) {
                return true;
            }

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
    // If the navigator is Firefox, we don't need to use a proxy.
    if (typeof browser !== "undefined") {
        leetCodeAPI = "https://leetcode.com/api/problems/all/";
    }
    // If the navigator is Chrome, we need to use a proxy.
    else if (typeof chrome !== "undefined") {
        leetCodeAPI = "https://cors-anywhere.herokuapp.com/" + "https://leetcode.com/api/problems/all/";
    }
    try {
        const response = await fetch(leetCodeAPI, { method: 'GET', mode: 'cors' });
        const dataUserChoices = await response.json();

        // Take only the free problems (May change in the future)
        const listProblems = dataUserChoices.stat_status_pairs.filter(item => !item.paid_only);

        // Select and return a random problem
        return listProblems[Math.floor(Math.random() * listProblems.length) + 1];
    }
    catch (error) {
        console.log('Error when loading the page:', error);
    }
}