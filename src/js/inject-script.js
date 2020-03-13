
// Injects a script into the body which correctly overrides the built in 'fetch' function
// Running the script directly in this file does not have any effect on 'fetch'
// I believe this is because extensions each have their own instance of the js interpreter,
// and so they each have their own instances of the built in js functions (like fetch)
// Thus to overide the DOM's own js interpreter's built in functions, I must have the js 
// exectute from within the DOM by injecting the script tag directly.
let injectedScript = document.createElement('script');
injectedScript.src = chrome.extension.getURL('js/main.js');
document.body.appendChild(injectedScript);


// We must execute this fetch from within the extension sandbox
// Otherwise the Content Security Policy of facebook will (often?) prevent the request from leaving the browser
document.addEventListener('heart-eyes-react', (event) => {

  // Send POST request to increment counter
  fetch('https://us-central1-mattyhempstead.cloudfunctions.net/addHeartEyesReact', {
    method: 'POST', // POST will increment heart-react counter
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify({
      reactLocation: event.detail.reactLocation
    })
  });

});
