window.onload = function () {
  var slider = document.getElementById("sensitivity");
  var chadWisdom = document.getElementById("chadWisdom");
  var blackListOnly = document.getElementById("blackListOnly");
  var blackList = document.getElementById("blackList");
  var whiteList = document.getElementById("whiteList");
  var redirectURL = document.getElementById("redirectURL");

  slider.value = localStorage.getItem('sensitivity') || slider.value;
  blackListOnly.checked = localStorage.getItem('blackListOnly') == 'true' || blackListOnly.checked;
  blackList.value = localStorage.getItem('blackList') || blackList.value;
  whiteList.value = localStorage.getItem('whiteList') || whiteList.value;
  redirectURL.value = localStorage.getItem('redirectURL') || redirectURL.value;

  sensitivityTextChange(slider.value);
  chadWisdom.innerHTML = listOfWisdom[Math.floor(Math.random() * listOfWisdom.length)];

  slider.oninput = function () {
    localStorage.setItem('sensitivity', this.value);
    sensitivityTextChange(this.value);
    sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL);
  }

  blackListOnly.onclick = function () {
    localStorage.setItem('blackListOnly', this.checked);
    sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL);
  }

  blackList.onchange = function () {
    localStorage.setItem('blackList', this.value);
    sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL);
  }

  whiteList.onchange = function () {
    localStorage.setItem('whiteList', this.value);
    sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL);
  }


  redirectURL.onchange = function () {
    localStorage.setItem('redirectURL', this.value);
    sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL);
  }

  document.querySelector('.text.oneRow').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
}

function sendInformation(slider, blackListOnly, blackList, whiteList,redirectURL){
  dataStorage = {
    sensitivity: slider.value,
    blackListOnly: blackListOnly.checked,
    blackList: blackList.value,
    whiteList: whiteList.value,
    redirectURL: redirectURL.value,
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, dataStorage, function(response) {
      if (response) {
        console.log(response.result);
      } else {
        console.log('No response received from content script');
      }
    });
  });
}

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
}

const listOfWisdom = [
  "<span style='color: #00b300;'>Seize the day</span>, champ! Time to <span style='color: #002699;'>unleash</span> that untapped <span style='color: #b30000;'>potential</span>!",
  "Every stride <span style='color: #33004d;'>forward</span> brings you closer to <span style='color: #804000;'>greatness</span>. Keep <span style='color: #806600;'>pushing</span>!",
  "<span style='color: #006666;'>Success</span> is not a gift, it is <span style='color: #993366;'>earned</span> one <span style='color: #cc3333;'>step</span> at a time!",
  "<span style='color: #990000;'>Procrastination</span> delays <span style='color: #730099;'>progress</span>. Ignite it with your <span style='color: #b35900;'>determination</span>!",
  "Fuel your <span style='color: #994d00;'>drive</span> with <span style='color: #004d00;'>ambition</span>. Nothing deters someone fueled by <span style='color: #0066cc;'>ambition</span>!",
  "Embrace the <span style='color: #cc3300;'>challenge</span>! It's the catalyst for your <span style='color: #ff8533;'>growth</span> and <span style='color: #0066cc;'>success</span>!",
  "You're not just aiming <span style='color: #33004d;'>high</span>, you're aiming for the <span style='color: #ff6666;'>stars</span>. Claim what's <span style='color: #b35900;'>yours</span>!",
  "<span style='color: #00b300;'>Winners</span> never quit, and <span style='color: #33004d;'>quitters</span> never win. What's your choice?",
  "Chase your <span style='color: #990000;'>dreams</span> passionately. They're closer than you think!",
  "The <span style='color: #404040;'>grind</span> is not easy, but <span style='color: #666666;'>regret</span> is harder. Keep <span style='color: #000000;'>hustling</span>!",
  "<span style='color: #b30000;'>Persistence</span> and <span style='color: #004d00;'>dedication</span> pave the road to <span style='color: #0066cc;'>victory</span>!",
  "<span style='color: #ffcc00;'>Believe</span> in yourself, always. <span style='color: #b30000;'>Trust</span> your journey!",
  "<span style='color: #006666;'>Today's <span style='color: #cc3333;'>efforts</span> yield tomorrow's <span style='color: #0066cc;'>rewards</span>.",
  "No <span style='color: #990000;'>challenge</span> surpasses your <span style='color: #cc3333;'>resolve</span>.",
  "<span style='color: #006666;'>Commit</span> to your <span style='color: #cc3300;'>goals</span>, achieve the unthinkable!",
  "<span style='color: #404040;'>Strive</span> for progress, not perfection.",
  "<span style='color: #004d00;'>Ambition</span> transforms <span style='color: #0066cc;'>dreams</span> into reality!",
  "You're <span style='color: #b35900;'>stronger</span> than you think. <span style='color: #ff8533;'>Believe</span> in yourself!",
  "<span style='color: #ff0000;'>Embrace</span> the <span style='color: #0000ff;'>unknown</span> and <span style='color: #00ff00;'>create</span> your own <span style='color: #ff00ff;'>destiny</span>!",
  "<span style='color: #800080;'>Innovation</span> is the <span style='color: #008000;'>key</span> to <span style='color: #000080;'>unlocking</span> your <span style='color: #800000;'>potential</span>!",
  "<span style='color: #ff8c00;'>Break</span> free from the <span style='color: #8b0000;'>ordinary</span> and <span style='color: #0000cd;'>embrace</span> the <span style='color: #8b008b;'>extraordinary</span>!",
  "<span style='color: #808000;'>Dare</span> to <span style='color: #0000ff;'>dream</span>, <span style='color: #ff00ff;'>believe</span> in yourself, and <span style='color: #008000;'>achieve</span> greatness!",
  "<span style='color: #ff1493;'>Think</span> outside the <span style='color: #0000cd;'>box</span> and <span style='color: #ff8c00;'>create</span> your own <span style='color: #8b008b;'>path</span>!",
  "<span style='color: #800080;'>Don't</span> be afraid to <span style='color: #ff0000;'>fail</span>, it's a <span style='color: #0000ff;'>stepping</span> stone to <span style='color: #008000;'>success</span>!",
  "<span style='color: #ff1493;'>Embrace</span> your <span style='color: #0000cd;'>uniqueness</span> and <span style='color: #ff8c00;'>shine</span> bright like a <span style='color: #8b008b;'>diamond</span>!",
  "<span style='color: #808000;'>Don't</span> wait for <span style='color: #0000ff;'>opportunities</span>, <span style='color: #ff00ff;'>create</span> them!",
  "<span style='color: #ff1493;'>Believe</span> in your <span style='color: #0000cd;'>vision</span> and <span style='color: #ff8c00;'>make</span> it a <span style='color: #8b008b;'>reality</span>!",
  "<span style='color: #800080;'>Success</span> is the <span style='color: #008000;'>result</span> of <span style='color: #000080;'>hard</span> work and <span style='color: #800000;'>originality</span>!",
  "<span style='color: #ff1493;'>Don't</span> be a <span style='color: #0000cd;'>follower</span>, be a <span style='color: #ff8c00;'>trailblazer</span>!",
  "<span style='color: #808000;'>Think</span> big, <span style='color: #0000ff;'>dream</span> big, and <span style='color: #ff00ff;'>achieve</span> big!",
  "<span style='color: #ff1493;'>Break</span> the <span style='color: #0000cd;'>rules</span> and <span style='color: #ff8c00;'>create</span> your own <span style='color: #8b008b;'>success</span> story!",
  "<span style='color: #800080;'>Don't</span> be afraid to <span style='color: #ff0000;'>stand</span> out, be afraid of <span style='color: #0000ff;'>blending</span> in!",
  "<span style='color: #ff1493;'>Innovate</span> or <span style='color: #0000cd;'>stagnate</span>, the choice is yours!",
  "<span style='color: #808000;'>Don't</span> be limited by <span style='color: #0000ff;'>conformity</span>, be inspired by <span style='color: #ff00ff;'>creativity</span>!",
  "<span style='color: #ff1493;'>Think</span> differently, <span style='color: #0000cd;'>act</span> boldly, and <span style='color: #ff8c00;'>create</span> your own <span style='color: #8b008b;'>legacy</span>!"
];