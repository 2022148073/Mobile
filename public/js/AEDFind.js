var markers = [];
var infowindows = [];

var AroundAED = [];
var AEDGroup;

var mapContainer =  document.getElementById("map"),// 지도를 표시할 div
  mapOption = {
  center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  level: 4, // 지도의 확대 레벨
};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

kakao.maps.event.addListener(map, 'idle', function() {
  searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});
  
if (navigator.geolocation) {
      
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
      var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도
        
      var ct = new kakao.maps.LatLng(lat, lon);
      map.panTo(ct);  
      
      //searchAddrFromCoords(ct, displayCenterInfo);


    }, function(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }, options);
      
  } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    console.log("GeoLocation 사용 불가!");
  
}

fetch("/js/json/자동심장 충격기 정보 조회(AED)(표준 데이터).json")
.then((response) => response.json())
.then((json) => getAEDLocation(json.DATA))
.catch((error) => console.log("Error: " + error.message));

function getAEDLocation(AED_group) {

  AEDGroup = AED_group;

  var center = map.getCenter(); 
  searchAddrFromCoords(center, displayCenterInfo);

  //window.alert(AroundAED.length);
}



function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  var geocoder = new kakao.maps.services.Geocoder();
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {

      for(var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === 'H') {
            var search = (result[i].address_name.split(' ')[1]);
            removeMarker(); AroundAED = [];
            for (let j = 0; j < AEDGroup.length; j++) {
              if (search === AEDGroup[j].buildaddress.split(" ")[1]) {AroundAED.push(AEDGroup[j]);}
            }

            for (let i = 0; i < AroundAED.length; i++)
            {
              let AED_lat = AroundAED[i].wgs84lat;
              let AED_lng = AroundAED[i].wgs84lon;
              let pos = new kakao.maps.LatLng(AED_lat, AED_lng);
              
              var marker = addMarker(pos, i, AroundAED[i].org, AroundAED[i].buildplace);
            }
            break;
          }
      }
  }    
}

function addMarker(pos, idx, title, dtitle) {
      marker = new kakao.maps.Marker({
        position: pos,
        clickable : true

      });
    marker.setMap(map);
    markers.push(marker);
    
    //밑 코드를 위치 상세정보가 뜰 수 있게 바꾸면 됨 '<p>' + 상세위치 변수이름 + '</p>'
    var hrefcontent = '<a href = "https://map.kakao.com/link/to/' + title + ' ' + dtitle + ',' + pos.getLat() + ',' + pos.getLng() + '">' + title + "<br>" + dtitle + "</a>";
    
    var Content = '<div style="padding:5px;z-index:1;">' + hrefcontent + "</div>";
    var Removeable = true;
    
    var infowindow = new kakao.maps.InfoWindow({
      content : Content,
      position : pos,
      removable : Removeable
    });

    infowindows.push(infowindow);
  
    kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));

  
    return marker;
  }
  
  function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
  }
// 인포윈도우를 닫는 클로저를 만드는 함수
  function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
  }
 
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for(var i = 0; i < infowindows.length; i++) {
      infowindows[i].close();
    }
    markers = [];
    infowindows = [];
  }




