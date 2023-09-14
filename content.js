function sayHello(){
  console.log('hello')
}

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    executeAction(message.action)
    console.log(sender)
    sendResponse('content.js: received...')
  }
);

const LayoutExplorerSingleton = (function () {
  let instance;

  const arrActions = []

  function getAction(name) {
    const action = arrActions.find(func => func.name === name)
    if (action) return action.func
  }

  function addAction(payload) {
    arrActions.push(payload)
  }

  const createInstance = () => {
    return {
      clicksEnabled: true,
      scanningEnabled: false,
      getAction,
      addAction
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }

      return instance
    }
  }
})()
const layoutExplorer = LayoutExplorerSingleton.getInstance()

function executeAction(action) {
  const func = layoutExplorer.getAction(action)
  if (func) {
    func()
  } else {
    console.log(new Error('Action not found... '))
  }
}

// helpers
function toggleClass(element, classToAdd) {
  const classExists = element.classList.contains(classToAdd)
  if (!classExists) {
    element.classList.add(classToAdd)
  } else {
    element.classList.remove(classToAdd)
  }
}

function backupOnclick(element){
  const backup = []
  // const listeners = window.getEventListeners(helloBtn)
  // listeners.forEach(l => backup.push)

  console.log(window.window.getEventListeners)


}

// methods
const startScanning = (parent = document.body) => {
  const elements = document.querySelectorAll('body *')
  elements.forEach(el => {
    el.classList.add('scan')

    // backup onclick
    backupOnclick(el)

    // click
    el.addEventListener('contextmenu', e => {
      e.preventDefault()
      e.stopPropagation()
      toggleClass(el, 'scan-hover')
    })

    // hover
    el.addEventListener('mousemove', e => {
      e.stopPropagation()
      if (e.shiftKey) {
        el.classList.add('scan-hover')
      }else if(e.altKey){
        el.classList.remove('scan-hover')
      }
    })
  })
}
const stopScanning = (parent = document.body) => {
  const elements = document.querySelectorAll('.scan')  
  elements.forEach(el => {
    el.classList.remove('scan')
    el.classList.remove('scan-hover')
  })
}

// register actions
layoutExplorer.addAction({ name: 'startScanning', func: startScanning })
layoutExplorer.addAction({ name: 'stopScanning', func: stopScanning })


/*********************  test  */

chrome.runtime.sendMessage('MARCO')