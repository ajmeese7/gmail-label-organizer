var storageItem = browser.storage.sync.get('default');
storageItem.then((res) => {
  if (typeof res.default == 'undefined') {
    // This is to save the default Gmail inbox code for reset()
    browser.storage.sync.set({
      default: document.getElementById("container").innerHTML
    });
    console.log("Setting default!");
  } else {
    console.log("Sync item `default` already set!");
  }
});

// Used as the default error handler throughout the file
function error(err) {
  console.error("error: " + err);
}

//////////////////////////////////////////////////////////////

function logTabs(tabs) {
  let tab = tabs[0];
  var title = tab.title;
  // Definitely not a perfect system, as it will run on any page with Gmail in the title
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
  } else {
    console.log("Local item `arrangement` not yet set!");
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
      if (e.target.classList.contains("reset")) {
        var storageItem = browser.storage.sync.get('default');
        storageItem.then((res) => {
          document.getElementById("container").innerHTML = res.default;
          browser.storage.local.set({
            arrangement: document.getElementById("container").innerHTML
          });
        });

        // TODO: THIS ISN't WORKING! Popup listeners don't reset until popup is reopened
        setDivListeners();
        setPListeners();

        browser.storage.sync.set({
          order: [1, 2, 3, 4, 5, 6]
        });

        browser.tabs.query({active: true, currentWindow: true})
         .then(reset)
         .catch(reportError);
      } else if (e.target.classList.contains("change")) {
        var children = document.getElementById("container").children;
        var childArray = [];
        for (var i = 0; i < children.length; i++) {
          childArray.push(children[i].children[0].id);
        }

        browser.storage.sync.set({
          order: childArray
        });

        browser.tabs.query({active: true, currentWindow: true})
         .then(change)
         .catch(error);
      }
    } catch(err) {}

    // Sends a "reset" message to the content script in the active tab.
    function reset(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "reset",
      });
    }

    function change(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "change",
      });
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
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
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "contentScript.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
