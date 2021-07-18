var data;
let numColumns;
const columnWidthsDesktop = [600, 900, 1200];
const columnWidthsMobile = [300, 800, 3000];
const sectionTitles = ["articles", "fiction", "contact", "translation"];

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};




function changeSectionWithText(newSectionTitle) {
  if (!sectionTitles.includes(newSectionTitle))
    return;
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

  positionTiles();
}

function positionTiles() {
  let columnNumber = 0;
  entries = document.getElementsByClassName("entry");
  const columnPositions = Array(numColumns).fill(0);
  Array.from(entries).forEach((entry) => {
    if (entry.parentElement.classList.contains("active")) {
      if (columnNumber == numColumns)
        columnNumber = 0;
      entry.style.left = `${columnNumber * window.innerWidth/numColumns}px`;
      entry.style.top = `${columnPositions[columnNumber]}px`;
      const style = getComputedStyle(entry);
      columnPositions[columnNumber] += entry.offsetHeight +
        parseInt(style.marginTop) + parseInt(style.marginBottom);
      columnNumber += 1;
    } else {
      entry.style.left = `0px`;
      entry.style.top = `${Math.random() * 2000}px`;
    }
  });
}

let positionTilesTimeout;
document.body.onresize = function(e) {
  entries = document.getElementsByClassName("entry");
  var width = window.innerWidth;
  var columnWidths = columnWidthsDesktop;
  if (mobileCheck()) {
    columnWidths = columnWidthsMobile;
    width = window.screen.width;
  }

  var newNumColumns;
  if (width < columnWidths[0])
    newNumColumns = 1;
  if (width > columnWidths[0] && width < columnWidths[1])
    newNumColumns = 2;
  if (width > columnWidths[1] && width < columnWidths[2])
    newNumColumns = 3;
  if (width > columnWidths[2])
    newNumColumns = 4;
  if (numColumns != newNumColumns) {
    numColumns = newNumColumns;
    Array.from(entries).forEach((entry) => {
      entry.classList.remove(entry.classList[1]);
      if (newNumColumns == 1)
        entry.classList.add("onecolumn")
      if (newNumColumns == 2)
        entry.classList.add("twocolumn")
      if (newNumColumns == 3)
        entry.classList.add("threecolumn")
      if (newNumColumns == 4)
        entry.classList.add("fourcolumn")
    });
  }

  window.clearTimeout(positionTilesTimeout);
  positionTilesTimeout = window.setTimeout(() => {
    positionTiles();
  }, 1000);
}

function changeSection(e) {
  var newSectionTitle = e.srcElement.innerText.toLowerCase();
  changeSectionWithText(newSectionTitle);
}

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
          var txt = "url('small-images/" + entry[x] + ".jpg')";
          htmlEntry.children[0].style.backgroundImage = txt;
        } else if (htmlEntry.children[1].children[x])
          htmlEntry.children[1].children[x].innerText = entry[x];
      }
    }
    if (sections[entry.category])
      sections[entry.category].appendChild(htmlEntry);
  });
  defaultEntry.remove();
  setTimeout(() => {
    document.body.onresize();
    var destination = "articles";
    if (window.location.search) {
      var searchQuery = window.location.search.substr(1);
      if (sectionTitles.includes(searchQuery))
        destination = searchQuery;
    }
    changeSectionWithText(destination);
  });
}

fetch("portfolio-data.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json;
    init(data);
  });



