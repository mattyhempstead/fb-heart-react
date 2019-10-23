
(()=>{
  console.log('Running fb-heart-react.js')
  
  let oldOpen = XMLHttpRequest.prototype.open

  let selectedHeart = false
  let isHeartCurrentReaction = false   // Whether not the current message reaction is already a heart


  XMLHttpRequest.prototype.open = function(method, url, async=true, user=null, password=null) {
    
    if (method === 'POST') console.log(url)

    // if ()


    if (selectedHeart && method === 'POST' && url.startsWith('/webgraphql/mutation/') && url.indexOf('reaction') !== -1) {
      console.log('detected heart react')
      url = url.replace(encodeURI('😍'), encodeURI('❤'))
    }
    oldOpen.call(this, method, url, async, user, password)
  }


  /**
   * Adds a heart react to the list of reactions
   * Requires the heart eyes reaction HTMLElement as a reference point
   * @param {HTMLElement} heartEyesReactElement 
   */
  function addHeartReaction(heartEyesReactElement) {
    selectedHeart = false
    isRemoving = reactsContainer.children.filter(reactEl => reactEl.getAttribute('aria-selected') === 'false')


    const reactsContainer = heartEyesReactElement.parentElement

    console.log('reacts container')
    console.log(reactsContainer)
    for (let i of Array.from(reactsContainer.children)) {
      console.log(i)
    }
    console.log(' ')

    // _1z8r _5-2b _5f0v

    // console.log(heartEyesReactElement)

    // Only add heart reaction element if it does not already exist
    if (reactsContainer.children.length === 7) {
      console.log('adding heart react element')

      const heartReactElement = heartEyesReactElement.cloneNode([true])

      heartReactElement.setAttribute('id', '❤')
      heartReactElement.setAttribute('aria-label', '❤')
      // heartReactElement.setAttribute('aria-selected', false)

      // Give heart react element the default style
      heartReactElement.setAttribute('class', heartEyesReactElement.className.split(' ')[0])

      console.log(heartReactElement)
      

      // Set the elements <img> to use heart react
      const heartReactImg = heartReactElement.getElementsByTagName('img')[0]
      heartReactImg.setAttribute('alt', '❤')
      heartReactImg.setAttribute('src', 'https://static.xx.fbcdn.net/images/emoji.php/v9/t92/1/128/2764.png')      


      heartReactElement.addEventListener('click', ()=> {
        selectedHeart = true

        console.log(isRemoving)

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
        } // else {
          // Remove XMLHttpRequest.prototype.open wrapper while it is not needed
          // console.log('removing heart react and using default XMLHttpRequest.prototype.open')
          // XMLHttpRequest.prototype.open = oldOpen          
        // }

      }
    }
  })

  // Start observing container which holds the reaction popup
  const globalContainer = document.getElementById('globalContainer')
  observer.observe(globalContainer, { childList: true })

  // Later, you can stop observing
  // observer.disconnect();
  
})()
