window.onload = function () {
  // Get the elements from the popup.html file.
  const elements = [
    { id: 'sensitivity', event: 'input', action: 'value' },
    { id: 'blackListOnly', event: 'click', action: 'checked' },
    { id: 'blackList', event: 'change', action: 'value' },
    { id: 'whiteList', event: 'change', action: 'value' },
    { id: 'redirectURL', event: 'change', action: 'value' },
  ];

  // Get the values from the local storage. If no value is stored, we use the default value.
  elements.forEach(({ id, event, action }) => {
    const element = document.getElementById(id);
    element[action] = localStorage.getItem(id) || element[action];

    element.addEventListener(event, function () {
      localStorage.setItem(id, this[action]);
      if (element.id === 'sensitivity') {
        sensitivityTextChange(this[action]);
      };
      sendInformation({
        sensitivity: document.getElementById('sensitivity').value,
        blackListOnly: document.getElementById('blackListOnly').checked,
        blackList: document.getElementById('blackList').value,
        whiteList: document.getElementById('whiteList').value,
        redirectURL: document.getElementById('redirectURL').value
      });
    });
  });

  // Print the sensitivity text.
  sensitivityTextChange(document.getElementById('sensitivity').value);

  // Print a random wisdom from the json list. 
  fetch('../../data/wisdoms.json')
    .then(response => response.json())
    .then(data => {
      chadWisdom.innerHTML = data.listOfWisdoms[Math.floor(Math.random() * data.listOfWisdoms.length)];
    });

  // Prevent the user from pressing enter in the URL redirection input (Only one URL can be enter). 
  document.querySelector('.text.oneRow').addEventListener('keydown', (action) => {
    if (action.key === 'Enter') action.preventDefault();
  });
};

/**
 * This function sends the user choices to the grindsent.js script.
 * @param {int} sensitivity
 * @param {boolean} blackListOnly
 * @param {string} blackList
 * @param {string} whiteList
 * @param {string} redirectURL
 */
function sendInformation({ sensitivity, blackListOnly, blackList, whiteList, redirectURL }) {
  const dataStorage = {
    sensitivity,
    blackListOnly,
    blackList,
    whiteList,
    redirectURL,
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, dataStorage, function (response) {
      if (response) {
        console.log(response.result);
      }
      else {
        console.log('No response received from content script!');
      }
    });
  });
};

/**
 * This function changes the text and the color of the Detection sensitivity text.
 * @param {int} value 
 */
function sensitivityTextChange(value) {
  var sensitivityText = document.getElementById("sensitivityText");
  if (value == 1) {
    sensitivityText.innerHTML = "You don't fear anything, do you?";
  }
  else if (value <= 12) {
    sensitivityText.innerHTML = "You're a real Chad!";
  }
  else if (value <= 25) {
    sensitivityText.innerHTML = "Keep it up like that!";
  }
  else if (value <= 37) {
    sensitivityText.innerHTML = "A bit of motivation won't hurt you.";
  }
  else if (value < 50) {
    sensitivityText.innerHTML = "It's okay to be weak sometimes.";
  }
  else {
    sensitivityText.innerHTML = "Hummm...";
  }
  let r = Math.floor(255 * (1 - value / 50));
  let b = Math.floor(255 * value / 50);
  sensitivityText.style.color = `rgb(${r}, 0, ${b})`;
};