function sayHello() { console.log('hello') }

// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'start') init()
});

async function generateHtml() {
  const askHtml = await fetch(chrome.runtime.getURL('layout-explorer.html'))
  const askCss = await fetch(chrome.runtime.getURL('layout-explorer.css'))

  const css = await askCss.text()
  const html = await askHtml.text()

  const div = document.createElement('div')
  div.innerHTML = html
  div.innerHTML += `<style>${css}</style>`

  div.querySelectorAll('*').forEach(element => element.classList.add('no-scan'))


  document.body.appendChild(div)
}

function assignEvents() {
  const btnStart = document.querySelector('.layout-explorer-container .btn-start')
  const btnStop = document.querySelector('.layout-explorer-container .btn-stop')
  const btnScan = document.querySelector('.layout-explorer-container .btn-scan')
  const btnChild = document.querySelector('.layout-explorer-container .btn-child')
  const btnParent = document.querySelector('.layout-explorer-container .btn-parents')
  const allInputDirection = document.querySelectorAll('.input-direction')


  btnStart.addEventListener('click', startScanning)
  btnStop.addEventListener('click', stopScanning)

  btnScan.addEventListener('click', changeMode)
  btnChild.addEventListener('click', changeMode)
  btnParent.addEventListener('click', changeMode)

  allInputDirection.forEach(input => {
    input.addEventListener('change', changeDirection)
  })
}

async function init() {
  await generateHtml()
  assignEvents()
}

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

  function getDirection() {
    return instance.direction
  }
  function getMode() {
    return instance.mode
  }

  const createInstance = () => {
    return {
      clicksEnabled: true,
      scanningEnabled: false,
      mode: 'scan',
      getMode,
      direction: '1rem, -1rem',
      getDirection,
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

function backupOnclick(element) {
  const backup = []
  // const listeners = window.getEventListeners(helloBtn)
  // listeners.forEach(l => backup.push)

}


function updateDirectionForCurrentElements(){
  const mode = layoutExplorer.getMode()
  const direction = layoutExplorer.getDirection()

  if(mode ==='scan'){
    const elements = document.querySelectorAll('.scan-hover')
    
    elements.forEach(element=> {
      const currentDirectionClass = element.dataset.directionClass
      element.classList.remove(currentDirectionClass)
      element.classList.add(direction)
      element.dataset.directionClass = direction
    })
  }


  
}

// methods
function startScanning(e, parent = document.body) {
  const elements = document.querySelectorAll('body *:not(.no-scan)')
  let activateMode

  const mode = layoutExplorer.getMode()
  if (mode === 'scan') activateMode = activateScanMode
  if (mode === 'child') activateMode = activateChildMode
  if (mode === 'parents') activateMode = activateParentsMode

  elements.forEach(element => {
    element.classList.add('scan')

    // backup onclick
    backupOnclick(element)

    activateMode(element)


    // // click
    // element.addEventListener('contextmenu', e => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   element.style.transform = `translate(${layoutExplorer.getDirection()})`
    // })

    // hover
    // element.addEventListener('mousemove', e => {
    //   e.stopPropagation()
    //   if (e.shiftKey) {
    //     element.style.transform = `translate(${layoutExplorer.getDirection()})`
    //   } else if (e.altKey) {
    //     element.style.transform = ``
    //   }
    // })
  })

  e.target.setAttribute('disabled', true)
  document.querySelector('.btn-stop').removeAttribute('disabled')
}
function stopScanning(e, parent = document.body) {
  const elements = document.querySelectorAll('.scan')
  elements.forEach(el => {
    el.classList.remove('scan')
    el.classList.remove('scan-hover')
  })
  e.target.setAttribute('disabled', true)
  document.querySelector('.btn-start').removeAttribute('disabled')
}
function changeMode(e) {
  const mode = e.target.dataset.mode
  layoutExplorer.mode = mode

  // update UI
  const allBtnMode = document.querySelectorAll('.btn-mode')
  allBtnMode.forEach(btn => {
    btn.classList.remove('btn-mode-selected')
    e.target.classList.add('btn-mode-selected')
  })
}

function changeDirection(e) {
  const direction = e.target.dataset.direction
  layoutExplorer.direction = direction

  updateDirectionForCurrentElements()
}
function activateScanMode(element) {
  removeCurrentMode()
  
  element.addEventListener('mousemove', e => {
    e.stopPropagation()
    const direction = layoutExplorer.getDirection() 
    
    if (e.shiftKey) {
      element.classList.add('scan-hover', direction)
      element.dataset.directionClass = direction
    } else if (e.altKey) {
      element.classList.remove('scan-hover', direction)
      element.dataset.directionClass = ''
    }
  })

}
function activateChildMode(element) {
  removeCurrentMode()

}
function activateParentsMode(element) {
  removeCurrentMode()

}
function removeCurrentMode() {

}

// register actions
layoutExplorer.addAction({ name: 'startScanning', func: startScanning })
layoutExplorer.addAction({ name: 'stopScanning', func: stopScanning })


/*********************  test  */

