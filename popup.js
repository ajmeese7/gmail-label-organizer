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
browser.storage.local.get('arrangement').then(setContent, error);

function setContent(local) {
  if (typeof local.arrangement != 'undefined') {
    // Sets the popup content to contain user-configured arrangement
    document.getElementById("container").innerHTML = local.arrangement;
  }

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

  // Sets local storage with current arrangement to save it for when the popup is reopened
  // TODO: Replace with JS function that works same as new reset (no innerHTML!)
  browser.storage.local.set({
    arrangement: document.getElementById("container").innerHTML
  });
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
      // TODO: Get new order based on document contents when clicked (in case user removed some labels)
      if (e.target.classList.contains("reset")) {
        var labels = document.getElementsByClassName("dragP"); // From HTMLCollection to Array
        var arr = Array.prototype.slice.call(labels);
        labels = arr.sort(function(a, b) {
          return a.id.localeCompare(b.id);
        });

        var divGroup = document.getElementsByClassName("dragDiv");
        var divs = Array.prototype.slice.call(divGroup);
        for (var i = 0; i < divs.length; i++) {
          // TODO: Look for a way to simply paste the object, not this complicated mess.
          //       The labels[] themselves are the correct objects
          divs[i].innerHTML = "<p id='" + (i+1) + "' class='dragP' draggable='true'>" + labels[i].textContent + "</p>";
        }

        setDivListeners();
        setPListeners();

        browser.storage.sync.set({
          order: [1, 2, 3, 4, 5, 6]
        });

        browser.storage.local.set({
          arrangement: document.getElementById("container").innerHTML
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
