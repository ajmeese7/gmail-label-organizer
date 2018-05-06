var storageItem = browser.storage.sync.get('color');
storageItem.then((res) => {
  document.body.style.border = "5px solid " + res.color;
});

// TODO: Make the labels draggable and the HTML changes reflect it
//       Make the add-on remember user customization
//       Remove a label's data when the label is no longer available

var systemLabels = document.getElementsByClassName("TK")[0];
console.log(systemLabels);


// IDEA: Convert discovered labels into an array and switch the code? Complies with:
//       https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage
//       Use storage?
