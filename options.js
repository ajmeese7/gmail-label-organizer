function saveOptions(e) {
  browser.storage.sync.set({
    color: document.querySelector("#color").value
  });
  e.preventDefault();
}

function restoreOptions() {
  var storageItem = browser.storage.sync.get('color');
  storageItem.then((res) => {
    document.querySelector("#managed-color").innerText = res.color;
    document.querySelector("#color").value = res.color || 'Firefox red';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
