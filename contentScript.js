(function() {
  // Running on page
  function modifyPage() {
    // IDEA: Make it refresh when innerHTML is modified?

    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      var arr = res.order;
      var wrapper = document.getElementsByClassName("TK")[0];
      var elements = document.createDocumentFragment();

      arr.forEach(function(number) {
        // Modify elements to modify page
      	elements.appendChild(document.getElementById(number + "").cloneNode(true));
      });

      wrapper.innerHTML = null;
      wrapper.appendChild(elements);
    });
  }

  // Listens for messages from the background script.
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "modify") {
      modifyPage();
    } else {
      console.error("Message not defined!");
    }
  });

})();
