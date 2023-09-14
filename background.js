chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log('reveived: ', message)

    if(message === 'MARCO') sendResponse('POLO')
  }
);

function executeAction(action){
  switch(action){
    case 'actionBackupOnclick': actionBackupOnclick()
  }
}

function actionBackupOnclick(){
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];

    chrome.tabs.executeScript(activeTab.id, {
      code: `
        const btn = document.querySelector('button')
        console.log('btn', btn)
      `
    })
  })
  ;
}