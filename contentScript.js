(function() {
  // Running on page
  function reset() {

  }

  function change() { // TODO: Also set!!!
    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      // TODO: Get the saved order  and rearrange the HTML in
      // this part of the page acccordingly like in `organizer.js`
      //document.getElementsByClassName("TK")[0].innerHTML = ;

      // IDEA: Series of local.gets to retrieve the arrangement
      // item's content, or store locally and preload?
      // i.e. if (id == 6) { labelName = "Categories" }
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
