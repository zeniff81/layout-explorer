console.log('popup.js')
function sayHello() {
  console.log('hello')
}

(function init() {
  assignEvent('#startScanning', 'click', handleStartScanning)
  assignEvent('#stopScanning', 'click', handleStopScanning)
  assignEvent('#render-btn', 'click', loadLocalStorage)

  localStorage.setItem('startScanningDisabled', false)
  localStorage.setItem('stopScanningDisabled', true)
})()

// helpers
function assignEvent(selector, event, func) {
  const element = document.querySelector(selector)
  element.addEventListener(event, func)
}
function loadLocalStorage() {
  // =============================================> this is not working. WE'll probably have to use background.js
  const startScanningDisabled = localStorage.getItem('startScanningDisabled') === 'true'
  const stopScanningDisabled = localStorage.getItem('stopScanningDisabled') === 'true'

  if (startScanningDisabled) {startScanning.setAttribute('disabled', true)} else{startScanning.removeAttribute('disabled')}
  if (stopScanningDisabled) {stopScanning.setAttribute('disabled', true)} else{stopScanning.removeAttribute('disabled')}
}
function saveLocalStorage(newStatus) {
  Object.entries(newStatus).map((el, index) => {
    const key = Object.keys(newStatus)[index]
    const value = Object.values(newStatus)[index]

    localStorage.setItem(key, value)
    loadLocalStorage()
  })
}

// Save state when the popup is closed
window.addEventListener('unload', function () {
  const state = {
    startScanningDisabled: document.getElementById('startScanning').disabled,
    stopScanningDisabled: document.getElementById('stopScanning').disabled,
  };

  chrome.storage.local.set({ popupState: state });
});

// Restore state when the popup is opened
chrome.storage?.local.get(['popupState'], function (result) {
  const state = result.popupState;
  if (state) {
    document.getElementById('startScanning').disabled = state.startScanningDisabled;
    document.getElementById('stopScanning').disabled = state.stopScanningDisabled;
  }
});

// assignDispatchEvent
function dispatchEvent(message) {
  console.log('message', message)
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    const response = await chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// methods 
function handleStartScanning(e) {
  dispatchEvent({ action: 'startScanning' })
  saveLocalStorage({ startScanningDisabled: true, stopScanningDisabled: false })
}
function handleStopScanning(e) {
  dispatchEvent({ action: 'stopScanning' })
  saveLocalStorage({ startScanningDisabled: false, stopScanningDisabled: true })
}
const startScanning = document.querySelector('#startScanning')
startScanning.addEventListener('click', handleStartScanning)
const stopScanning = document.querySelector('#stopScanning')
stopScanning.addEventListener('click', handleStopScanning)

function actionBackupOnclick(){
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, "Hello from popup")
  })
  ;
}