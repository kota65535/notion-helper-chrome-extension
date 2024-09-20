// Save settings to sync storage
const save = async () => {
  const settings = Array.from(document.querySelectorAll('input'))
      .reduce((a, c) => { return {...a, [c.name]: c.checked}}, {})
  await chrome.storage.sync.set({settings})
  // Notify to background.js 
  await chrome.runtime.sendMessage({type: 'settings_saved'})
};

// Load settings from sync storage
const load = async () => {
  const settings = await chrome.storage.sync.get('settings');
  // Change UI states according to the settings
  for (const [k, v] of Object.entries(settings.settings)) {
    const box = document.querySelector(`input#${k}`)
    box.checked = v
  }
};

window.addEventListener('load', async () => {
  await load()
  // Save settings every time if changed
  document.querySelectorAll('input').forEach(e => e.addEventListener('click', save))
});
