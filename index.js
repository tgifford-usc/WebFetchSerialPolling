// make variables for the html elements
const sendButton = document.getElementById("sendButton");
const msgTextBox = document.getElementById("msgTextBox");
const dataResultArea = document.getElementById("mainResults");

const endpoint = "https://esp8266.local";

// Make a GET api request
async function sendMessage(msg) {
    // clear out the data printout area of the html page
    dataResultArea.innerHTML = "";
    
    // Fetch a response from the REST API
    const response = await fetch(`${endpoint}?msg=${msg}`);
    
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
