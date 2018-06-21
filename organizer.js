labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  var children = systemLabels.children;
  var childrenIDs = children[children.length - 1].id;
  if (typeof systemLabels != 'undefined') {
    if (childrenIDs == "") {
      for (var i = 0; i < children.length; i++) {
        children[i].id = i + 1;
      }
    }

    // This portion is a slightly modified version of modifyPage() in contentScript.js
    // to restore any previously set order when the page is first loaded
    var storageItem = browser.storage.sync.get('order');
    storageItem.then((res) => {
      var arr = res.order;
      var elements = document.createDocumentFragment();

      arr.forEach(function(number) {
        // Works for document, but not popup
        if (document.getElementById(number + "") != null) {
          elements.appendChild(document.getElementById(number + "").cloneNode(true));
        }
      });

      systemLabels.innerHTML = null;
      systemLabels.appendChild(elements);
    });

    setTimeout(labels, 5000);
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
