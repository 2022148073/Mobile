
var takePicture = document.querySelector("#takepic"),
    showPicture = document.querySelector("#showpic");

takePicture.onchange = function (event) { // 촬영된 사진이 전송되면
    var files = event.target.files,
        file;
    if (files && files.length > 0) {       
        file = files[0];
        try {
            var imgURL = window.URL.createObjectURL(file); 
            window.alert(imgURL);
            showPicture.src = imgURL; // 이미지의 src 설정
            //URL.revokeObjectURL(imgURL);
        }
        catch (e) {
            try {
                // Fallback if createObjectURL is not supported
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    showPicture.src = event.target.result;
                    window.alert(event.target.result);
                };
            fileReader.readAsDataURL(file);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
};
