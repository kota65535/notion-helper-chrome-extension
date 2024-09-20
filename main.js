let cachedSettings = {};

const openSubpageTree = (elements) => {
  const treeItems = elements.flatMap(e => 
      Array.from(e.querySelectorAll('div.notion-selectable > a[role="treeitem"]')))
 
  console.debug('openSubpageTree treeItems', treeItems)
  
  // When the page title clicked, programmatically click the toggle button to open the tree
  for (const item of treeItems) {
    const titleDiv = item.querySelector(':scope > div > div:nth-child(2)')
    const treeOpenButton = item.querySelector('div[role="button"]')
    titleDiv.addEventListener('click', () => treeOpenButton.click())
  }
}

const hideNoPagesInside = (elements) => {
  const treeGroups = elements.filter(e => e.matches('div[role="group"]'))

  console.debug('hideNoPagesInside treeGroups', treeGroups)

  // Make 'No pages inside' invisible and keep toggle icon collapsed
  for (const group of treeGroups) {
    if (group.innerHTML.includes('No pages inside')) {
      group.style.display = 'none'
      const svg = group.previousElementSibling.querySelector('svg')
      if (svg) {
        svg.style.transform = 'rotateZ(-90deg)'
      }
    }
  }
}

const onBodyChange = async (mutations, observer) => {
  const addedElements = mutations.flatMap(m => Array.from(m.addedNodes))
      .filter(n => n instanceof HTMLElement)

  if (cachedSettings.openSubpageTree) {
    openSubpageTree(addedElements)
  }
  if (cachedSettings.hideNoPagesInside) {
    hideNoPagesInside(addedElements)
  }
};

const fetchSettings = async () => {
  const result = await chrome.storage.sync.get('settings');
  cachedSettings = result.settings ?? {};
  console.debug('settings', cachedSettings)
};

const main = async () => {
  await fetchSettings();
  
  const observer = new MutationObserver(onBodyChange);
  observer.observe(document.body, { childList: true, subtree: true });
};

chrome.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case 'settings_saved':
      await fetchSettings();
      break;
  }
});

window.addEventListener('load', main, false);

