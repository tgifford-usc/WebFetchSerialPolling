// make variables for the html elements
const sendButton = document.getElementById("sendButton");
const pollButton = document.getElementById("pollButton");
const androidButton = document.getElementById("androidButton");
const msgTextBox = document.getElementById("msgTextBox");
const dataResultArea = document.getElementById("mainResults");
const ipAddressTextBox = document.getElementById("ipAddressTextBox");
const ipAddressPanel = document.getElementById("ipAddressPanel");

let ipAddress = "esp8266.local";
// const endpoint = "https://esp8266.local";
// const endpoint = "https://192.168.231.211"
// const endpoint = "https://192.168.20.12";
ipAddressTextBox.value = ipAddress;

// Polling for data on the microcontroller
let polling = false;
let pollInterval = 5000;

// toggle android or not android
let android = false;

// Make a GET api request
async function sendMessage(msg) {
    // clear out the data printout area of the html page
    dataResultArea.innerHTML = "";
    
    // Fetch a response from the REST API
    const response = await fetch(`https://${ipAddress}?msg=${msg}`);
    
    // bail out if the response status was anything other than success
    if (response.status != 200) { 
        console.log(`https://${ipAddress}/poll returned status ${response.status}`);
        return;
    } 

    // extract the JSON payload from the response
    const result = await response.json();
    
    // Sometimes the payload is actually a string instead of an object. If so convert
    // it to an object
    let objResult = (typeof result == "object") ? result  : JSON.parse(result);
    
    // and either way, convert the object to a string to print out. 
    let strResult = JSON.stringify(objResult, undefined, 2);
    dataResultArea.innerHTML = `<pre><code>${strResult}</code></pre>`;
    
    // return the JSON object
    return objResult;
}


// See if the microcontroller has some data it wants to send
async function queryForData() {
    // Fetch a response from the REST API
    const response = await fetch(`https://${ipAddress}/poll`);
    
    // bail out if the response status was anything other than success
    if (response.status != 200) { 
        console.log(`https://${ipAddress}/poll returned status ${response.status}`);
        return;
    } 

    // extract the JSON payload from the response
    const result = await response.json();
    
    // Sometimes the payload is actually a string instead of an object. If so convert
    // it to an object
    let objResult = (typeof result == "object") ? result  : JSON.parse(result);
    
    // and either way, convert the object to a string to print out. 
    let strResult = JSON.stringify(objResult, undefined, 2);
    dataResultArea.innerHTML = `<pre><code>${strResult}</code></pre>`;
    
    // return the JSON object
    return objResult;
}

// Poll regularly for data
async function pollForData() {
    let res = queryForData();
    if (polling) {
        setTimeout(pollForData, pollInterval);
    }
    return res;
}



// Make the GET request when the fetch button is clicked
sendButton.addEventListener('click', async (event) => {
    // fetch whatever URL has been typed into textbox
    let msg = msgTextBox.value;
    let result = await sendMessage(msg);
    // Do something else with 'result' if you want
});


// Also fetch the URL if it changes
msgTextBox.addEventListener('change', async (event) => {
    let msg = msgTextBox.value;
    let result = await sendMessage(msg);
    // Do something else with 'result' if you want
});


// toggle polling when the POLL button is pressed
pollButton.addEventListener('click', (event) => {
    if (polling) {
        polling = false;
        pollButton.classList.remove('toggled-on');
        pollButton.classList.add('toggled-off');
    } else {
        polling = true;
        pollForData();
        pollButton.classList.remove('toggled-off');
        pollButton.classList.add('toggled-on');
    }
});


// toggle android button, and show IP address textbox if it is Android
androidButton.addEventListener('click', (event) => {
    if (android) {
        android = false;
        androidButton.classList.remove('toggled-on');
        androidButton.classList.add('toggled-off');
        ipAddressPanel.setAttribute('style','display: none;');
    } else {
        android = true;
        androidButton.classList.remove('toggled-off');
        androidButton.classList.add('toggled-on');
        ipAddressPanel.setAttribute('style','display: flex;');
    }
});


ipAddressTextBox.addEventListener('change', (event) => {
    ipAddress = ipAddressTextBox.value;    
});