(function() {
  // Running on page
  // TODO: Use ID's!
  function modifyPage() {
    // TODO: Refesh somehow after reordered once to maintain order
    // TODO: Make it refresh when innerHTML is modified (i.e. an email is deleted and the # is changed)
    //       so the new order is restored

    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      // Thank god for this guy: https://jsfiddle.net/jltorresm/1ukhzbg2/2/
      var arr = res.order;
      var wrapper = document.getElementsByClassName("TK")[0];
      var children = wrapper.children;
      console.log("Children IDs:");
      console.log(children.id);
      var elements = document.createDocumentFragment();

      arr.forEach(function(number) {
      	elements.appendChild(children[number - 1].cloneNode(true));
      });

      console.log("Order array:");
      console.log(arr);

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
