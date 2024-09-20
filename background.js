const INITIAL_SETTINGS = {
  openSubpageTree: true,
  hideNoPagesInside: true,
}

// Set initial settings on installed
chrome.runtime.onInstalled.addListener((detail) => {
  chrome.storage.sync.set({settings: INITIAL_SETTINGS});
});

// Relay events from the pop-up to the content script
chrome.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'settings_saved':
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
      break;
  }
});
