const currentUrl = window.location.href;

checkNSFW(currentUrl).then(result => {
    if(result){
        console.log("So you choose death.");
        parseLeetCode().then(problemSelected => {
            window.location.href = "https://leetcode.com/problems/" + problemSelected.stat.question__title_slug;
        });
    }
    else{
        console.log("The website is safe :)");
    }
});

/**
* This function checks if the URL is a nsfw website.
* @param {string} URL - The URL to check.
* @returns {boolean} - Return true if it has a lot of nsfw words or a big no no word.
*/ 
async function checkNSFW(URL) {
    const nsfwWordsBigNoNo = ['adult-oriented','age-restricted'];
    const nsfwWords = ['hentai','xxx','porn','sex','pussy','nude'];
    nsfwWords.push(...nsfwWordsBigNoNo);

    if(nsfwWords.some(word => URL.toLowerCase().includes(word))){
        console.log("The URL is a bit sussy !");
        return true;
    }
    
    const correspondence = await parseAndAnalyze(URL,nsfwWords);

    let sum = 0;
    for (const word in correspondence){
        if(nsfwWordsBigNoNo.includes(word)){
            return true;
        }
        sum += correspondence[word];
    }

    return sum > 20;
}

/**
 * This function parses the URL and checks the nsfw words in it. 
 * @param {string} URL - The URL to parse.
 * @param {[string]} nsfwWords - The list of word to check.
 * @returns {object} - Return a hash map of the number of nsfw word.
 */
async function parseAndAnalyze(URL, nsfwWords){
    const correspondence = {};

    // If the page contains NSFW words
    if(!URL.includes("google.com/")){
        try{
            const response = await fetch(URL, { method: 'GET', mode: 'cors' });
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const textContent = doc.body.innerText.toLowerCase();

            nsfwWords.forEach(word => {
                const wordCount = (textContent.match(new RegExp(word, 'g')) || []).length;
                if (wordCount > 0) {
                    correspondence[word] = wordCount;
                }
            });

            for (const word in correspondence) {
                if (correspondence.hasOwnProperty(word)) {
                    console.log(`'${word}': fetched ${correspondence[word]} times`);
                }
            }
        } 
        catch (error){
            console.error('Error when loading the page:', error);
        }
    } 
    else{
        console.log('This is a Google search page !');
    }

    return correspondence;
}

/**
 * This function parses the LeetCode API and returns a random problem.
 * @returns {object} - Return a random problem.
 */
async function parseLeetCode() {
    const leetCodeAPI = "https://leetcode.com/api/problems/all/";
    try {
        const response = await fetch(leetCodeAPI, { method: 'GET', mode: 'cors' });
        const data = await response.json();

        // Take only the free problems
        const listProblems = data.stat_status_pairs.filter(item => !item.paid_only);

        // Select and return a random problem
        return listProblems[Math.floor(Math.random() * listProblems.length)+1];
    } 
    catch (error){
        console.log('Error when loading the page:', error);
    }
}
