const domains = ["its.me.eu.org", "teamcyber.vastserve.com"];

if (window.location.hostname !== "teamcyber.vastserve.com") {
  return;
}

function updateBatteryStatus(battery) {
  const batteryLevel = document.getElementById('battery-level');
  batteryLevel.innerText = `${Math.round(battery.level * 100)}%`;
}

navigator.getBattery().then(battery => {
  updateBatteryStatus(battery);
  battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
});

function updateCurrentTime() {
  const currentTimeElement = document.getElementById('current-time');
  const now = new Date();
  currentTimeElement.innerText = now.toLocaleTimeString('id-ID', {
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
  });
}

function updateNetworkStatus() {
  const networkStatusElement = document.getElementById('network-status');
  if ('connection' in navigator) {
    const networkInfo = navigator.connection;
    networkStatusElement.innerText = `${networkInfo.type} ${networkInfo.effectiveType} (${(networkInfo.downlink * 1024 * 1024 / 1000000).toFixed(1)} Mbps)`;
    networkInfo.addEventListener('change', () => updateNetworkStatus());
  } else {
    networkStatusElement.innerText = 'Tidak tersedia';
  }
}

function updateOnlineStatus() {
  const onlineStatusElement = document.getElementById('online-status');
  onlineStatusElement.innerText = navigator.onLine ? "Online": "Offline";
}

async function measurePing(url) {
  const startTime = new Date().getTime();

  try {
    const response = await fetch(url, {
      method: 'GET', mode: 'no-cors'
    });
    const endTime = new Date().getTime();
    const pingTime = endTime - startTime;
    return pingTime;
  } catch (error) {
    console.error('Error during fetch:', error);
    return null;
  }
}

async function updatePing() {
  const ping = await measurePing('https://ngl.link/api/submit');
  const pingResultDiv = document.getElementById('ping');
  if (ping !== null) {
    pingResultDiv.textContent = `${ping} ms`;
  } else {
    pingResultDiv.textContent = '-';
  }
}


function initializeRealTimeUpdates() {
  updateCurrentTime();
  updateNetworkStatus();
  updateOnlineStatus();
  
  setInterval(updatePing, 1000);
  setInterval(updateCurrentTime, 1000);
  setInterval(updateNetworkStatus, 5000);
  setInterval(updateOnlineStatus, 1000);
}

initializeRealTimeUpdates();
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
