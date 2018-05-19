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
    console.log("Top of reset");
    // SHOULD only be running on Gmail page, so the object should be able to be retrieved.
    // TODO: Set to do this from within labels to make sure the object is loaded?
    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      console.log("HI I'M BIG GAY");
      // TODO: Set this to replace the object itself, not the inner code,
      //       with the default stored object.
      //document.getElementsByClassName("TK")[0].innerHTML = res.default;
      console.log(res.default);
      console.log("Bottom of reset");
    });
  }

  /**
   * Listen for messages from the background script.
   * Call "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "reset") {
      console.log("Reset command handler!");
      reset();
      console.log("After reset call!");
    } else {
      console.log("Message not defined!");
    }
  });

})();
