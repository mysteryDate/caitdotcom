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

function init(data) {
  var default_entry = document.getElementById("defaultEntry");
  var sections = {};
  Array.from(document.getElementsByClassName("section")).forEach((s) => {
    sections[s.id] = s;
  });
  data.forEach((entry) => {
    var htmlEntry = default_entry.cloneNode(true);
    htmlEntry.id = "";
    htmlEntry.style.display = "";
    for (var x in entry) {
      if (entry[x]) {
        if (x === "url") {
          htmlEntry.href = entry[x];
        }
        else if (htmlEntry.children[1].children[x])
          htmlEntry.children[1].children[x].innerText = entry[x];
      }
    }
    sections[entry.category].appendChild(htmlEntry);
  });
}

function changeSection(e) {
  var newSectionTitle = e.srcElement.innerText.toLowerCase();
  var section = document.getElementsByClassName("section");
  Array.from(section).forEach((element) => {
    element.classList.remove("active");
    if (element.id === newSectionTitle) {
      element.classList.add("active");
    }
  })
}
