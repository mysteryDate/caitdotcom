var data;
fetch("portfolio-data.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json;
    init(data);
  });

function changePage(destination) {
  var titlePage = document.getElementById("title");
  titlePage.classList.add("unfocused");
  titlePage.classList.remove("focused");
}

function init(data) {
  var default_entry = document.getElementById("default_entry");
  var sections = {};
  Array.from(document.getElementsByClassName("section")).forEach((s) => {
    sections[s.id] = s;
  });
  data.forEach((entry) => {
    var htmlEntry = default_entry.cloneNode();
    htmlEntry.id = "";
    var p = document.createElement("p");
    p.innerText = entry.title;
    console.log(entry.category);
    sections[entry.category].appendChild(p);
  });
}