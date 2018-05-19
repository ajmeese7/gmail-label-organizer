labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  if (typeof systemLabels != 'undefined') {
    // This is to save the default Gmail inbox code for reset()
    browser.storage.sync.set({
      default: systemLabels.innerHTML
    });

    var pi = {
      num: 2,
      text: "yes"
    }

    browser.storage.sync.set({ pi });

    var storageItem = browser.storage.sync.get('default');
    storageItem.then((res) => {
      console.log("Organizer default:");
      console.log(res.default);
    });

    var storageItem = browser.storage.sync.get('pi');
    storageItem.then((res) => {
      console.log("pi:");
      console.log(res.pi);
    });

    // Draggable mini menu that changes the order of the page then refreshes (pastes code w/ innerHTML)
    var children = systemLabels.children;
    var childArray;
    for (var i = 0; i < children.length; i++) {
      // Lists all the direct container divs for the system labels
      console.log(children[i].children[0].children[0]);
      // ++ image classes
    }

    var completeLabels = {
      styles: labelStyles,
      labels: children,
      HTML: systemLabels.innerHTML
    }

    browser.storage.sync.set({ completeLabels });
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
