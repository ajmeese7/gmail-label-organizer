function logTabs(tabs) {
  let tab = tabs[0]; // Safe to assume there will only be one result
  var title = tab.title;
  if (title.includes("Gmail")) {
    document.querySelector("#not-gmail").classList.add("hidden");
    document.querySelector("#popup-content").classList.remove("hidden");
  } else {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#not-gmail").classList.remove("hidden");
  }
}

function onError(err){
  console.error(err);
}

browser.tabs.query({currentWindow: true, active: true}).then(logTabs, onError);


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`An error occured: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "reset()" as appropriate.
     */
     if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "contentScript.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
