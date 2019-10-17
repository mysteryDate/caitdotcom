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
  var default_entry = document.getElementById("default_entry");
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
        else if (htmlEntry.children[x])
          htmlEntry.children[x].innerText = entry[x];
      }
    }
    var div = document.createElement("div");
    div.classList.add("entry-container"); 
    div.appendChild(htmlEntry);
    sections[entry.category].appendChild(div);
  });
}