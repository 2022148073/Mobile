fetch("/js/json/main.json")
  .then((response) => response.json())
  .then((json) => initialize(json))
  .catch((error) => console.log("Error: " + error.message));

var name_disease_group = [];
var category_disease_group = [];

const name_search_button = document.getElementById("name_search_button");
const name_search = document.getElementById("search");
const disease_list = document.querySelector(".list");

const menu = document.querySelector(".menu");
const menu_button = document.getElementById("category");
const menu_icon = document.querySelector("#category i");

function initialize(total_disease_group) {
  for (let i = 0; i < 15; i++) {
    let categoryNumber = "category_" + (i + 1);
    let categoryList = document.getElementById(categoryNumber);
    let categoryListValue = document.getElementById(categoryNumber).innerHTML;
    console.log(document.getElementById(categoryNumber));
    let categoryListValue_parent =
      document.getElementById(categoryNumber).parentNode;
    let subMenu = document.createElement("ul");

    subMenu.className = "submenu";

    for (let j = 0; j < total_disease_group.length; j++) {
      if (total_disease_group[j].type === categoryListValue) {
        let subMenuList = document.createElement("li");
        let subMenuList_href = document.createElement("a");

        subMenuList_href.href = "#";
        subMenuList_href.innerHTML = total_disease_group[j].name;

        subMenuList.appendChild(subMenuList_href);
        subMenu.appendChild(subMenuList);

        subMenuList.addEventListener("click", function () {
          category_disease_group = [];
          category_disease_group.push(total_disease_group[j]);
          displayDetailByCategory();
        });
      }
    }

    categoryListValue_parent.appendChild(subMenu);

    categoryList.addEventListener("click", function () {
      name_disease_group = [];
      for (let k = 0; k < total_disease_group.length; k++) {
        if (total_disease_group[k].type === categoryListValue) {
          name_disease_group.push(total_disease_group[k]);
        }
      }
      update_list();
    });
  }

  name_search_button.addEventListener("click", function () {
    name_disease_group = [];
    category_disease_group = [];

    const searchValue = name_search.value.trim().split(" ").join("");

    if (searchValue !== "") {
      for (let i = 0; i < total_disease_group.length; i++) {
        var disease_name = total_disease_group[i].name.split(" ").join("");
        if (disease_name.indexOf(searchValue) !== -1) {
          name_disease_group.push(total_disease_group[i]);
        }
      }
      update_list();
    } else {
      alert("검색어를 입력해주세요!");
    }
  });
}

function update_list() {
  while (disease_list.firstChild !== null) {
    disease_list.removeChild(disease_list.firstChild);
  }

  if (name_disease_group.length !== 0) {
    display();
  } else {
    var no_result = document.createElement("div");
    no_result.className = "no_result";
    no_result.innerHTML = "검색 결과가 없습니다.";
    disease_list.appendChild(no_result);
  }
}

function display() {
  for (let i = 0; i < name_disease_group.length; i++) {
    const disease = document.createElement("div");
    const diseaseImageBox = document.createElement("div");
    const diseaseImage = document.createElement("img");
    const diseaseComment = document.createElement("div");
    const detailButton = document.createElement("button");

    disease.className = "lst";
    diseaseImageBox.className = "disease_img";
    diseaseComment.className = "comment";

    diseaseImage.src = `/css/image/${name_disease_group[i].image}`;
    diseaseImage.alt = name_disease_group[i].name + " 사진";
    diseaseImageBox.appendChild(diseaseImage);

    detailButton.id = "button_" + (i + 1);
    detailButton.innerHTML = "자세히보기";

    var short_comment =
      "<h2>" +
      name_disease_group[i].name +
      "</h2><p>" +
      name_disease_group[i].comment +
      "</p>";
    diseaseComment.innerHTML = short_comment;
    diseaseComment.appendChild(detailButton);

    disease.appendChild(diseaseImageBox);
    disease.appendChild(diseaseComment);
    disease_list.appendChild(disease);

    detailButton.addEventListener("click", function () {
      displayDetail(i);
    });
  }
}

function displayDetail(order) {
  while (disease_list.firstChild !== null) {
    disease_list.removeChild(disease_list.firstChild);
  }
  console.log(name_disease_group[order]);

  const detailLeftAlign = document.createElement("div");
  const detailImageBox = document.createElement("div");
  const detailImage = document.createElement("img");

  detailLeftAlign.className = "leftAlign";
  detailImageBox.className = "detailImage";

  detailImage.src = `/css/image/${name_disease_group[order].image}`;
  detailImage.alt = name_disease_group[order].name + " 사진";
  detailImageBox.appendChild(detailImage);

  var detailExplain_1 =
    "<h1>개요: " + name_disease_group[order].name + "</h1><hr><br>";
  var detailExplain_2 =
    "<p>" +
    name_disease_group[order].intro +
    "</p><h1>치료방법</h1><hr><p>" +
    name_disease_group[order].cure +
    "</p>";

  detailLeftAlign.innerHTML = detailExplain_1;
  detailLeftAlign.appendChild(detailImageBox);
  detailLeftAlign.innerHTML += detailExplain_2;
  disease_list.appendChild(detailLeftAlign);
}

function displayDetailByCategory() {
  while (disease_list.firstChild !== null) {
    disease_list.removeChild(disease_list.firstChild);
  }
  // console.log(name_disease_group[order]);

  const detailLeftAlign = document.createElement("div");
  const detailImageBox = document.createElement("div");
  const detailImage = document.createElement("img");

  detailLeftAlign.className = "leftAlign";
  detailImageBox.className = "detailImage";

  detailImage.src = `/css/image/${category_disease_group[0].image}`;
  detailImage.alt = category_disease_group[0].name + " 사진";
  detailImageBox.appendChild(detailImage);

  var detailExplain_1 =
    "<h1>개요: " + category_disease_group[0].name + "</h1><hr><br>";
  var detailExplain_2 =
    "<p>" +
    category_disease_group[0].intro +
    "</p><h1>치료방법</h1><hr><p>" +
    category_disease_group[0].cure +
    "</p>";

  detailLeftAlign.innerHTML = detailExplain_1;
  detailLeftAlign.appendChild(detailImageBox);
  detailLeftAlign.innerHTML += detailExplain_2;
  disease_list.appendChild(detailLeftAlign);
}
