var data;
fetch("portfolio-data.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json;
    init(data);
  });

function loadUrl() {
  console.log(event);
}

var vv;
function init(data) {
  var defaultEntry = document.getElementById("defaultEntry");
  var sections = {};
  Array.from(document.getElementsByClassName("section")).forEach((s) => {
    sections[s.id] = s;
  });
  data.forEach((entry) => {
    var htmlEntry = defaultEntry.cloneNode(true);
    htmlEntry.id = "";
    htmlEntry.style.display = "";
    for (var x in entry) {
      if (entry[x]) {
        if (x === "url") {
          htmlEntry.href = entry[x];
        } else if (x === "image") {
          var txt = "url('images/" + entry[x] + "')";
          htmlEntry.children[0].style.backgroundImage = txt;
        } else if (htmlEntry.children[1].children[x])
          htmlEntry.children[1].children[x].innerText = entry[x];
      }
    }
    if (sections[entry.category])
      sections[entry.category].appendChild(htmlEntry);
  });
}

function changeSectionWithText(newSectionTitle) {
  var section = document.getElementsByClassName("section");
  Array.from(section).forEach((element) => {
    element.classList.remove("active");
    if (element.id === newSectionTitle) {
      element.classList.add("active");
    }
  });
  var headers = document.getElementById("navBarWrapper");
  Array.from(headers.children).forEach((header) => {
    header.classList.remove("active");
    if (header.innerText.toLowerCase() === newSectionTitle)
      header.classList.add("active");
  });
}

function changeSection(e) {
  var newSectionTitle = e.srcElement.innerText.toLowerCase();
  changeSectionWithText(newSectionTitle);
}

var destination = "articles";
if (window.location.search) {
  destination = window.location.search.substr(1);
}
changeSectionWithText(destination);