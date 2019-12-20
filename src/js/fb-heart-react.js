/*
  This script will enable heart reacts in facebook messenger

  Occasionally facebook seems to reset XMLHttpRequest.prototype.open back to the original built-in method
  For this reason I am only adding the .open wrapper directly before a reaction request, and removing it directly after.
*/

(()=>{
  console.log('Heart React for Messenger')
  
  // Store the default XMLHttpRequest.prototype.open which can be switched back and forth
  let defaultXMLHttpRequestOpen = XMLHttpRequest.prototype.open

  let isHeartCurrentReaction = false    // Whether or not the heart react is already the current reaction

  /**
   * A custom function which replaces the next instance of heart eyes in a reaction with heart react
   */
  const replaceHeartFunction = function(method, url, async=true, user=null, password=null) {    
    // Reset back to the original function so this wrapper is only used temporarily
    XMLHttpRequest.prototype.open = defaultXMLHttpRequestOpen

    // Only modify requests which are heart eyes reactions
    if (method === 'POST' && url.startsWith('/webgraphql/mutation/') && url.indexOf('reaction') !== -1) {
      console.log("Reacting with Heart")
  
      // Replace heart eyes with heart
      url = url.replace(encodeURI('😍'), encodeURI('❤'))
      
      // Dispatch a custom event which to execute code as if it is within the extension sandbox
      const evt = document.createEvent('Event')
      evt.initEvent('heart-react', true, false)
      document.dispatchEvent(evt)

      if (isHeartCurrentReaction) {
        // If heart react is selected while it is already the current reaction, user wants to remove it
        // url = url.replace('ADD_REACTION', 'REMOVE_REACTION')
      } else {
        // If heart react is selected while heart eyes is already the current reaction, user wants to switch reaction
        url = url.replace('REMOVE_REACTION', 'ADD_REACTION')
      }
    }

    // Execute the original XMLHttpRequest.prototype.open with "this" (the particular XMLHttpRequest instance) as the context
    defaultXMLHttpRequestOpen.call(this, method, url, async, user, password)
  }


  /**
   * Adds a heart react to the list of reactions
   * Requires the heart eyes reaction HTMLElement as a reference point
   * @param {HTMLElement} heartEyesReactElement 
   */
  function addHeartReaction(heartEyesReactElement) {
    const reactsContainer = heartEyesReactElement.parentElement

    // This has a false positive when there are no reactions on a message at all
    // I need to figure out a way to tell the difference between no reactions on a message, and a custom heart reaction
    isHeartCurrentReaction = Array.from(reactsContainer.children).filter(el => el.getAttribute('aria-selected') === 'true').length === 0
    // console.log(isHeartCurrentReaction)


    // Only add heart reaction element if it does not already exist
    if (reactsContainer.children.length === 7) {
      const heartReactElement = heartEyesReactElement.cloneNode([true])

      heartReactElement.setAttribute('id', '❤')
      heartReactElement.setAttribute('aria-label', '❤')
      heartReactElement.setAttribute('aria-selected', false)

      // Give heart react element the default style
      heartReactElement.setAttribute('class', heartEyesReactElement.className.split(' ')[0])      

      // Set the elements <img> to use heart react
      const heartReactImg = heartReactElement.getElementsByTagName('img')[0]
      heartReactImg.setAttribute('alt', '❤')
      heartReactImg.setAttribute('src', 'https://static.xx.fbcdn.net/images/emoji.php/v9/t92/1/128/2764.png')      

      // When user clicks heart react, simulate a click on heart eyes and modify the request
      heartReactElement.addEventListener('click', ()=> {
        // Temporarily add a wrapper over the default XMLHttpRequest.open method
        // This wrapper will replace any attempt to react with heart eyes with heart react
        XMLHttpRequest.prototype.open = replaceHeartFunction
        heartEyesReactElement.click()
      })

      reactsContainer.appendChild(heartReactElement)

    }

  }


  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const heartEyesReactElement = document.getElementById('😍')
        if (heartEyesReactElement !== null) {
          addHeartReaction(heartEyesReactElement)
        }
      }
    }
  })


  // Start container which holds the reaction popup
  if (location.host === 'www.messenger.com') {

    observer.observe(document.body, { childList: true })

  } else if (location.host === 'www.facebook.com' && location.pathname.startsWith('/messages/t/')) {

    observer.observe(document.getElementById('globalContainer'), { childList: true })

  } else if (location.host === 'www.facebook.com') {

    // This div contains all dock chats
    const chatTabsPagelet = document.getElementById('ChatTabsPagelet')

    if (chatTabsPagelet === null) return

    // Listen for reaction selection element to be added to any of the dock chats
    chatTabsPagelet.addEventListener('DOMNodeInserted', evt => {
      // Filter many elements which are definitely not the reaction selection (for efficiency purposes)
      if (!evt.target.classList.contains('uiContextualLayerPositioner')) return
     
      // Add heart reaction if reaction selection element was created
      const heartEyesReactElement = document.getElementById('😍')
      if (heartEyesReactElement !== null) {
         addHeartReaction(heartEyesReactElement)
      } 

    })

  }
  
})()

