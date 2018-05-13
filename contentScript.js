(function() {
  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertBeast(beastURL) {
    removeExistingBeasts();
    let beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.style.height = "100vh";
    beastImage.className = "beastify-image";
    document.body.appendChild(beastImage);
  }

  function reset() {
    // SHOULD only be running on Gmail page, so the object should be able to be retrieved.
    // TODO: Set to do this from within labels to make sure the object is loaded?
    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      // TODO: Set this to replace the object itself, not the inner code,
      //       with the default stored object.
      document.getElementsByClassName("TK")[0].innerHTML = res.default;
    });
  }

  /**
   * Listen for messages from the background script.
   * Call "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "reset") {
      reset();
    }
  });

})();
