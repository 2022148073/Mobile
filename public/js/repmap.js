var markers = [];

var mapContainer =  document.getElementById("map"),// 지도를 표시할 div
  mapOption = {
  center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

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
      
    }, function(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }, options);
      
  } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    console.log("GeoLocation 사용 불가!");
  
}

var geocoder = new kakao.maps.services.Geocoder();
var marker = new kakao.maps.Marker(); // 클릭한 위치를 표시할 마커입니다

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

var locquery = document.getElementById('place');
  // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
            

            // 마커를 클릭한 위치에 표시합니다 
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
            locquery.value = detailAddr
        }   
    });
});