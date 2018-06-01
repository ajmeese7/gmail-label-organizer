labels();

function labels() {
  var systemLabels = document.getElementsByClassName("TK")[0];
  if (typeof systemLabels != 'undefined') {
    var children = systemLabels.children;
    for (var i = 0; i < children.length; i++) {
      children[i].id = i + 1;
    }
  } else {
    // Calls until the content is loaded
    setTimeout(labels, 100);
  }
}
