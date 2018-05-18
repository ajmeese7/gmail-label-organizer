labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  if (typeof systemLabels != 'undefined') {
    // This is to save the default Gmail inbox code for reset()
    browser.storage.sync.set({
      default: systemLabels.innerHTML
    });

    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      console.log(res.default);
      document.querySelector("#popup-content").innerHTML = res.default;
      console.log("setContent() called!");
    });

    // Draggable mini menu that changes the order of the page then refreshes (pastes code w/ innerHTML)
    var children = systemLabels.children;
    var childArray;
    for (var i = 0; i < children.length; i++) {
      // Lists all the direct container divs for the system labels
      console.log(children[i].children[0].children[0]);
    }
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
