var markers = [];


var mapContainer = document.getElementById("map"),// 지도를 표시할 div
  mapOption = {
  center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

if (navigator.geolocation) {
    
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function(position) {
      
    var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도
      
    var ct = new kakao.maps.LatLng(lat, lon);
    map.panTo(ct);  
    
    searchAddrFromCoords(ct, displayCenterInfo);
    
  }, function(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }, options);
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때
  
  console.log("GeoLocation 사용 불가!");

}

var geocoder = new kakao.maps.services.Geocoder();


function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
      var locquery = document.getElementById('loc');

      for(var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === 'H') {
              locquery.value = result[i].address_name;
              break;
          }
      }
  }    
}

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

  var keyword = document.getElementById('loc').value;
	var filterList = document.getElementsByName('hd');

	filterList.forEach((node) => {
		if(node.checked)  {
			console.log(node.value);
		  keyword = keyword + " " + node.value;
		}
	})

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  removeAllChildNods(listEl);

  removeMarker();

  for (var i = 0; i < places.length; i++) {
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i, places[i].place_name),
      itemEl = getListItem(i, places[i]);

    bounds.extend(placePosition);

    fragment.appendChild(itemEl);
  }

  listEl.appendChild(fragment);
  // menuEl.scrollTop = 0;

  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";
  
  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

function addMarker(position, idx, title) {
  var imageSrc = "/css/image/marker_number_blue.png",
    imageSize = new kakao.maps.Size(36, 37),
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position,
      image: markerImage,
      clickable : true
    });

  marker.setMap(map);
  markers.push(marker);
  
  var hrefcontent = '<a href = "https://map.kakao.com/link/to/' + title + ',' + position.getLat() + ',' + position.getLng() + '">' + title + "</a>";
  var Content = '<div style="padding:5px;z-index:1;">' + hrefcontent + "</div>";
  var Removeable = true;
  
  var infowindow = new kakao.maps.InfoWindow({
    content : Content,
    removable : Removeable
  });

  kakao.maps.event.addListener(marker, 'click', function() {
  // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);  
  });

  return marker;
  }

function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

/*function displayInfowindow(marker, title) {
  var Content = '<div style="padding:5px;z-index:1;">' + title + "</div>";
  var Removeable = true;
  
  var infowindow = new kakao.maps.Infowindow({
    content : Content,
    removeable : Removeable
  });
  infowindow.open(map, marker);
}*/

function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}
