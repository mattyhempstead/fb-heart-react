
// Injects a script into the body which correctly overrides the built in 'fetch' function
// Running the script directly in this file does not have any effect on 'fetch'
// I believe this is because extensions each have their own instance of the js interpreter,
// and so they each have their own instances of the built in js functions (like fetch)
// Thus to overide the DOM's own js interpreter's built in functions, I must have the js 
// exectute from within the DOM by injecting the script tag directly.
let injectedScript = document.createElement('script')
injectedScript.src = chrome.extension.getURL('js/fb-heart-react.js')
document.body.appendChild(injectedScript)
