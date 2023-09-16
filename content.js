function sayHello(){console.log('hello')}
sayHello()

// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message === 'start') init()
});


const LAYOUT_HTML = `
  <button class="btn btn-start">Start</button>
  <button class="btn btn-stop">Stop</button>
  <div class="direction">
    <input value="top-left" name="direction" type="radio">
    <input value="top-center" name="direction" type="radio">
    <input value="top-right" name="direction" type="radio">
    <input value="center-left" name="direction" type="radio">
    <input value="center-center" name="direction" type="radio">
    <input value="center-right" name="direction" type="radio">
    <input value="bottom-left" name="direction" type="radio">
    <input value="bottom-center" name="direction" type="radio">
    <input value="bottom-right" name="direction" type="radio">
  </div>
  <div class="position">
    <input value="top-left" name="position" type="radio">
    <input value="top-right" name="position" type="radio">
    <input value="bottom-left" name="position" type="radio">
    <input value="bottom-right" name="position" type="radio">
  </div>

  <style>
    .layout-explorer-container {
      display: flex;
      gap: 1rem;
      background: pink;
      padding: 1rem;
      width: 270px;
      justify-content: center;
      position: fixed;
      bottom: 1rem;
      right: 1rem;
    }

    .direction,
    .position {
      display: flex;
      flex-wrap: wrap;
      width: 4rem;
    }

    .direction input {
      flex: 0 0 calc(33.333% - 10px);
    }

    .position input {
      flex: 0 0 calc(40% - 10px);
    }
  </style>
`
function generateHtml(){
  const alreadyExists = document.querySelector('.layout-explorer-container')
  if(alreadyExists) return 
  const div = document.createElement('div')
  div.classList.add('layout-explorer-container')
  div.innerHTML = LAYOUT_HTML
  document.body.appendChild(div)
}

function assignEvents(){
  const btnStart = document.querySelector('.layout-explorer-container .btn-start')
  const btnStop = document.querySelector('.layout-explorer-container .btn-stop')

  btnStart.addEventListener('click', startScanning)
  btnStop.addEventListener('click', stopScanning)
}

function  init(){
  generateHtml()
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
function startScanning(parent = document.body){
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
function stopScanning(parent = document.body){
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

