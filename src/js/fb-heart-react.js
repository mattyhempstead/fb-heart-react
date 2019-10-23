
(()=>{
  console.log('Running fb-heart-react.js')
  
  let oldOpen = XMLHttpRequest.prototype.open

  let selectedHeart = false
  let isHeartCurrentReaction = false    // Whether or not the heart react is already the current reaction


  XMLHttpRequest.prototype.open = function(method, url, async=true, user=null, password=null) {
    
    // if (method === 'POST') console.log(selectedHeart, isHeartCurrentReaction, decodeURI(url))

    // Only modify requests which are heart eyes reactions
    if (selectedHeart && method === 'POST' && url.startsWith('/webgraphql/mutation/') && url.indexOf('reaction') !== -1) {
      selectedHeart = false
      url = url.replace(encodeURI('😍'), encodeURI('❤'))

      if (isHeartCurrentReaction) {
        // If heart react is selected while it is already the current reaction, user wants to remove it
        // url = url.replace('ADD_REACTION', 'REMOVE_REACTION')
      } else {
        // If heart react is selected while heart eyes is already the current reaction, user wants to switch reaction
        url = url.replace('REMOVE_REACTION', 'ADD_REACTION')
        console.log('reacting with heart')
      }
    }
    oldOpen.call(this, method, url, async, user, password)
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
        selectedHeart = true
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

  // Start observing container which holds the reaction popup
  const globalContainer = document.getElementById('globalContainer')
  observer.observe(globalContainer, { childList: true })
  
})()
