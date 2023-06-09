function getmap() {

    var mapCont = document.getElementById("mapc");
    var mapBut = document.getElementById("mapb");

    if(mapCont) {
        var mapScr = document.getElementById("maps");
        mapScr.remove();
        mapCont.remove();
        mapBut.innerText = "지도 가져오기";
        return;
    }

    mapCont = document.createElement('div');
    var mapView = document.createElement('div');
    var mapP = document.createElement('h2');
    var mapScr = document.createElement('script');


    mapCont.setAttribute("class", "Emergency_main");
    mapCont.setAttribute("id", "mapc");

    mapView.setAttribute("id", "map");

    mapP.textContent = "환자 위치를 표시해주세요!";

    mapScr.setAttribute("type", "text/javascript");
    mapScr.setAttribute("src", "/js/repmap.js");
    mapScr.setAttribute("id", "maps");

    mapCont.appendChild(mapP);
    mapCont.appendChild(mapView);
    document.body.appendChild(mapCont);
    document.body.appendChild(mapScr);
    mapBut.innerText = "지도 없애기";
    
}

function getloc() {
    if (navigator.geolocation) {
    
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            
          var lat = position.coords.latitude, // 위도
              lon = position.coords.longitude; // 경도
            
          var ct = new kakao.maps.LatLng(lat, lon); 
          
          searchDetailAddrFromCoords(ct, retloc);
          
        });
          
      } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        
        console.log("GeoLocation 사용 불가!");
      
      }
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    var geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}
  
function retloc(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var locquery = document.getElementById('place');
        var detailAddr = !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
        locquery.value = detailAddr;
    }    
}