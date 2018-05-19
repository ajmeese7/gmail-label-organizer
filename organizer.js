labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  if (typeof systemLabels != 'undefined') {
    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      if (typeof res.default == 'undefined') {
        // This is to save the default Gmail inbox code for reset()
        browser.storage.sync.set({
          default: systemLabels.innerHTML
        });
      } else {
        console.log("Storage item `default` already set!");
      }
    });


    // Draggable mini menu that changes the order of the page then refreshes (pastes code w/ innerHTML)
    var children = systemLabels.children;
    var childArray = [];
    for (var i = 0; i < children.length; i++) {
      // Lists all the direct container divs for the system labels
      console.log(children[i].children[0].children[0]);
      childArray.push(children[i].children[0].children[0].innerText);
      // reorder in document with Array.splice
    }

    console.log("childArray:");
    console.log(childArray);

    var storageItem = browser.storage.sync.get('custom');
    storageItem.then((res) => {
      if (typeof res.custom == 'undefined') {
        // This is to save the user's configuration of the labels
        browser.storage.sync.set({
          custom: childArray
        });
      } else {
        console.log("Storage item `childArray` already set!");
      }
    });
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
