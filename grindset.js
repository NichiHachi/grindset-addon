const currentUrl = window.location.href;


checkNSFW(currentUrl).then(result => {
    if(result){
        console.log("So you choose death.");
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
    const nsfwWordsBigNoNo = ['xxx','porn'];
    const nsfwWords = ['hentai'];
    nsfwWords.push(...nsfwWordsBigNoNo);

    if(nsfwWords.some(word => URL.toLowerCase().includes(word))){
        console.log("The URL is a bit sussy !")
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
    return sum > 10;
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
        try {
            const response = await fetch(URL, { method: 'GET', mode: 'cors' });
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const elements = doc.querySelectorAll('*');
            elements.forEach(element => {
                nsfwWords.forEach(word => {
                    if (element.textContent.toLowerCase().includes(word)) {
                        if (!correspondence[word]) {
                            correspondence[word] = 1;
                        } else {
                            correspondence[word] += 1;
                        }
                    }
                });
            });

            for (const word in correspondence) {
                if (correspondence.hasOwnProperty(word)) {
                    console.log(`'${word}': fetched ${correspondence[word]} times`);
                }
            }
        } catch (error) {
            console.error('Error when loading the page :', error);
        }
    } else {
        console.log('This is a Google search page !');
    }

    return correspondence;
}