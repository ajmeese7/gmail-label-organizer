(function() {
  // Running on page
  function reset() {
    // SHOULD only be running on Gmail page, so the object should be able to be retrieved.
    // TODO: Set to do this from within labels to make sure the object is loaded?
    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      document.getElementsByClassName("TK")[0].innerHTML = res.default;
    });
  }

  function change() {
    var storageItem = browser.storage.sync.get('custom');
    storageItem.then((res) => {
      //document.getElementsByClassName("TK")[0].innerHTML = res.custom;
    });
  }

  // Listens for messages from the background script.
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "reset") {
      reset();
    } else if (message.command === "change") {
      change();
    } else {
      console.error("Message not defined!");
    }
  });

})();
