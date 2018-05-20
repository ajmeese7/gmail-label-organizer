labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  if (typeof systemLabels != 'undefined') {

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
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
