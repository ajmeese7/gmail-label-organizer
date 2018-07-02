// Used as the default error handler throughout the file
function error(err) {
  console.error("error: " + err);
}

//////////////////////////////////////////////////////////////

function logTabs(tabs) {
  let tab = tabs[0];
  var title = tab.title;
  // Definitely not a perfect system, as it will run on any page with Gmail in the title
  // IDEA: Use https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs? Need to
  //       check if link is different under different circumstances (dissect parameters!)
  if (title.includes("Gmail")) {
    document.querySelector("#not-gmail").classList.add("hidden");
    document.querySelector("#popup-content").classList.remove("hidden");
  } else {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#not-gmail").classList.remove("hidden");
  }
}

browser.tabs.query({currentWindow: true, active: true}).then(logTabs, error);

//////////////////////////////////////////////////////////////

// Called every time popup is opened; sets listeners
browser.storage.local.get('existingLabels').then(setContent, error);

// TODO: Decide logic of setting arrangement while maintaining previous order
function setContent(local) {
  var container = document.getElementById("container");
  container.innerHTML = "";
  for (var i = 1; i <= local.existingLabels.length; i++) {
    container.innerHTML += "<p id='" + i + "' class='dragP' draggable='true'>" + local.existingLabels[i - 1] + "</p>";
  }

  // Sets the popup content to contain user-configured arrangement
  // NOTE: Now this won't save non-changed user settings when closed (new functionality, not bug?)
  var storageItem = browser.storage.sync.get('order');
  storageItem.then((res) => {
    var arr = res.order;
    var elements = document.createDocumentFragment();

    arr.forEach(function(number) {
      if (document.getElementById(number + "") != null) {
    	  elements.appendChild(document.getElementById(number + "").cloneNode(true));
      }
    });

    container.innerHTML = null;
    container.appendChild(elements);

    //var labels = document.getElementsByClassName("dragP");
    for (var i = 1; i <= local.existingLabels.length; i++) {
      var div = document.createElement("div");
      div.setAttribute("class", "dragDiv");
      var p = document.getElementById(i + "");
      container.replaceChild(div, p);
      div.appendChild(p);

      setDivListeners();
      setPListeners();
    }
  });

  setDivListeners();
  setPListeners();
}

//////////////////////////////////////////////////////////////
var divDragFunction = function(ev) {
  ev.preventDefault();
}

var divDropFunction = function(ev) {
  ev.preventDefault();
  var src = document.getElementById(ev.dataTransfer.getData("src"));
  var srcParent = src.parentNode;
  var tgt = ev.currentTarget.firstElementChild;

  ev.currentTarget.replaceChild(src, tgt);
  srcParent.appendChild(tgt);
}

function setDivListeners() {
  var div = document.getElementsByClassName("dragDiv");
  for (var i = 0; i < div.length; i++) {
    div[i].addEventListener('dragover', divDragFunction, false);
    div[i].addEventListener('drop', divDropFunction, false);
  }
}

//////////////////////////////////////////////////////////////
var pDrag = function(ev) {
  ev.dataTransfer.setData("src", ev.target.id);
}

function setPListeners() {
  var p = document.getElementsByClassName("dragP");
  for (var i = 0; i < p.length; i++) {
    p[i].addEventListener('dragstart', pDrag, false);
  }
}

//////////////////////////////////////////////////////////////


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    // Running in popup
    try {
      if (e.target.classList.contains("reset")) {
        // IDEA: Iterate over `.TK` scanning for labels and remove from `arr` if they don't appear
        var labels = document.getElementsByClassName("dragP"); // From HTMLCollection (here) to Array (next line)
        var arr = Array.prototype.slice.call(labels);

        // Sorts the labels in increasing order of ID (1,2,3...)
        labels = arr.sort(function(a, b) {
          return a.id.localeCompare(b.id);
        });

        var divGroup = document.getElementsByClassName("dragDiv");
        var divs = Array.prototype.slice.call(divGroup);
        var order = [];
        for (var i = 0; i < divs.length; i++) {
          divs[i].innerHTML = "<p id='" + (i+1) + "' class='dragP' draggable='true'>" + labels[i].textContent + "</p>";
          order.push(i + 1); // Depends on the correct number of dragDivs being displayed (in relation to actual Gmail page)
        }

        setDivListeners();
        setPListeners();

        // Would be [1,2,3,4,5,6] if 6 system labels were visible
        browser.storage.sync.set({
          order: order
        });

        browser.tabs.query({active: true, currentWindow: true})
         .then(modify)
         .catch(error);
      } else if (e.target.classList.contains("change")) {
        var children = document.getElementById("container").children;
        var childArray = [];
        for (var i = 0; i < children.length; i++) {
          var id = children[i].children[0].id;
          childArray.push(parseInt(id));
        }

        setDivListeners();
        setPListeners();

        browser.storage.sync.set({
          order: childArray
        });

        browser.tabs.query({active: true, currentWindow: true})
         .then(modify)
         .catch(error);
      }
    } catch(err) { /* Shove it up yer butt */ }

    // Sends a "modify" message to the content script in the active tab.
    function modify(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "modify",
      });
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  // IDEA: Remove most of this part and just show te default #error-content text?
  //       The user likely doesn't need to see that information
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#not-gmail").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");

  var message = `Failed to execute content script: ${error.message}`;
  document.querySelector("#error-content").innerHTML = "<p>" + message + "</p>";
  console.error(message);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 */
browser.tabs.executeScript({file: "contentScript.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
