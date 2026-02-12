// CornBlocker — popup logic

const toggleSwitch = document.getElementById('toggleSwitch');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statToday = document.getElementById('statToday');
const statTotal = document.getElementById('statTotal');

function updateUI(enabled) {
  toggleSwitch.checked = enabled;
  statusDot.classList.toggle('off', !enabled);
  statusText.textContent = enabled ? 'Protection ON' : 'Protection OFF';
}

async function loadState() {
  const result = await chrome.storage.local.get(['enabled', 'cornblocker_stats']);
  const enabled = result.enabled !== false;
  updateUI(enabled);

  const today = new Date().toDateString();
  const stats = result.cornblocker_stats || { date: today, count: 0, total: 0 };
  const count = stats.date === today ? stats.count : 0;
  statToday.textContent = count;
  statTotal.textContent = stats.total;
}

toggleSwitch.addEventListener('change', async () => {
  const enabled = toggleSwitch.checked;
  await chrome.storage.local.set({ enabled });
  updateUI(enabled);
  chrome.runtime.sendMessage({ type: 'toggle', enabled });
});

loadState();
