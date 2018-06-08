(function() {
  // Running on page
  function modifyPage() {
    // TODO: Make it refresh when innerHTML is modified (i.e. an email is deleted and the # is changed)
    //       so the new order is restored (also somehow destroys IDs)

    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      var arr = res.order;
      var wrapper = document.getElementsByClassName("TK")[0];
      var elements = document.createDocumentFragment();

      arr.forEach(function(number) {
        // Modify elements to modify page
      	elements.appendChild(document.getElementById(number + "").cloneNode(true));
      });

      // IDEA: Run this portion of the code again when the innerHTML is modified by Gmail itself (^^top).
      //       Also, re-implement the IDs by running organizer.js setIDs() again
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
