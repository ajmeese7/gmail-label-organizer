var alreadyRan = false;
labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];

  if (typeof systemLabels != 'undefined') {
    var children = systemLabels.children;
    var childrenIDs = children[0].id; // First one always has to exist

    // Sets IDs of Labels
    if (childrenIDs == "") { // TODO: Implement a method of checking validity
      for (var i = 1; i <= children.length; i++) {
        children[i - 1].id = i;
      }
    }

    var existingLabels = ["Inbox"]; // Because the `Inbox` label can't be turned off
    for (var i = 1; i < children.length; i++) {
      existingLabels.push(children[i].children[0].children[0].children[1].innerText);
    }

    browser.storage.local.set({
      existingLabels: existingLabels
    });

    console.log("Existing labels: ");
    console.log(existingLabels);

    // This portion is a slightly modified version of modifyPage() in contentScript.js
    // to restore any previously set order when the page is first loaded
    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      if (alreadyRan) {
        console.log("arr: ");
        var arr = res.order;
        console.log(arr);
        var elements = document.createDocumentFragment();

        arr.forEach(function(number) {
          if (document.getElementById(number + "") != null) {
            elements.appendChild(document.getElementById(number + "").cloneNode(true));
          }
        });

        systemLabels.innerHTML = null;
        systemLabels.appendChild(elements);
      } else {
        var order = [];
        for (var i = 1; i <= children.length; i++) {
          order.push(i);
        }

        console.log("Order: " + order);

        browser.storage.sync.set({
          order: order
        });

        alreadyRan = true;
      }
    });

    setTimeout(labels, 5000);
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
