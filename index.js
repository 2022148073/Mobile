
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 8080;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/messageimg');
    },
    filename: function (req, file, cb) {
        cb(null, 'report.jpg');
    }
});
  
const upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/image'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/json'));
app.use(express.static(__dirname + '/messageimg'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/quickReport.html', (req, res) => {
    res.sendFile(__dirname + '/quickReport.html');
})

app.get('/emergencyReport.html', (req, res) => {
    res.sendFile(__dirname + '/emergencyReport.html');
})

app.get('/hospitalFind.html', (req, res) => {
    res.sendFile(__dirname + '/hospitalFind.html');
})

app.get('/wiki_main.html', (req, res) => {
    res.sendFile(__dirname + '/wiki_main.html');
})

app.get('/AEDFind.html', (req, res) => {
    res.sendFile(__dirname + '/AEDFind.html');
})

app.listen(port, () =>{
    console.log(port);
})


app.post("/quickReport", function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if(req.body.loc){
        send_qmessage(req.body.loc, req.body.sym, "01088487493");
        res.write("<script>location.href='/emergencyReport.html'</script>");
    }
    else res.write("<script>alert('지역이 입력되지 않았습니다!');location.href='/quickReport.html'</script>");
});

app.post("/detailReport", function(req, res) {
    var name = req.body.name;
    var phon = req.body.phone;
    var desc = req.body.desc;
    var age = req.body.age;
    var gend = req.body.gender;
    //var pic = req.body.pic;

    console.log(name);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
    if((name) && (phon) && (desc) && (age) && (gend)) { 
        send_dmessage(name, phon, desc, age, gend, "01088487493");
        console.log(phon);
        res.write("<script>location.href='/'</script>");
    }
    else res.write("<script>alert('정보가 제대로 입력되지 않았습니다!');location.href='/emergencyReport.html'</script>");
});

app.post("/take_pic", upload.single('pic'), function(req, res, next) {

    res.write("<script>location.href='/emergencyReport.html'</script>");

});


function send_qmessage(loc, symptom, phone) {

    // 응급상황 위치, 증상, 전화번호
    const user_phone_number = phone;
    const user_loc = loc;
    const user_symptom = symptom;
    
    // 모듈들을 불러오기. 오류 코드는 맨 마지막에 삽입 예정
    const finErrCode = 404;
    const axios = require('axios');
    const CryptoJS = require('crypto-js');
    const date = Date.now().toString();
    
    // 환경변수로 저장했던 중요한 정보들
    const serviceId = "ncp:sms:kr:308915017835:ip"; 
    const secretKey = "WULw7fXIsUyUXzMS9Y6An2GMyIYPut61yBeuK2XL";
    const accessKey = "EF9OGSTyZLh0D0whYtUy";
    const my_number = "01088487493";

    console.log(serviceId);
    console.log(accessKey);
    console.log(secretKey);
    console.log(my_number);
    
    // 그 외 url 관련
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;

    // 중요한 key들을 한번 더 crypto-js 모듈을 이용하여 암호화 하는 과정.
    // 이런 모습은 꽤나 믿을 만 한 api이다.

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    
axios({
    method: method,
    // request는 uri였지만 axios는 url이다
    url: url,
    headers: {
        "Contenc-type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
    },
    // request는 body였지만 axios는 data다
    data: {
        type: "SMS",
        countryCode: "82",
        from: my_number,
        // 원하는 메세지 내용
        content: `${user_loc}에서 ${user_symptom} 환자 발생.`,
        messages: [
        // 신청자의 전화번호
            { to: `${user_phone_number}`, },],
    },
}).then(res => {
    console.log(res.data);
})
    .catch(err => {
        console.log(err);
    })
return finErrCode;
}


function send_dmessage(name, phon, desc, age, gend, phone) {

    // 응급상황 위치, 증상, 전화번호
    const user_phone_number = phone;
    const user_phone = phon;
    const user_name = name;
    const user_description = desc;
    const user_age = age;
    const user_gender = gend;
    const pic_exist = fs.existsSync(__dirname + '/public/messageimg/report.jpg');
    
    // 모듈들을 불러오기. 오류 코드는 맨 마지막에 삽입 예정
    const finErrCode = 404;
    const axios = require('axios');
    const CryptoJS = require('crypto-js');
    const date = Date.now().toString();
    
    // 환경변수로 저장했던 중요한 정보들
    const serviceId = "ncp:sms:kr:308915017835:ip"; 
    const secretKey = "WULw7fXIsUyUXzMS9Y6An2GMyIYPut61yBeuK2XL";
    const accessKey = "EF9OGSTyZLh0D0whYtUy";
    const my_number = "01088487493";
    
    // 그 외 url 관련
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const urlf = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/files`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;
    const urlf2 = `/sms/v2/services/${serviceId}/files`;

    // 중요한 key들을 한번 더 crypto-js 모듈을 이용하여 암호화 하는 과정.
    // 이런 모습은 꽤나 믿을 만 한 api이다.

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    
    const hmac2 = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac2.update(method);
    hmac2.update(space);
    hmac2.update(urlf2);
    hmac2.update(newLine);
    hmac2.update(date);
    hmac2.update(newLine);
    hmac2.update(accessKey);
    const hash2 = hmac2.finalize();
    const signature2 = hash2.toString(CryptoJS.enc.Base64);

    if(pic_exist){

          try {
            sharp(__dirname + '/public/messageimg/report.jpg')  // 압축할 이미지 경로
              .resize({ width: 320, height : 320}) // 비율을 유지하며 가로 크기 줄이기
              .withMetadata()	// 이미지의 exif데이터 유지
              .toBuffer((err, buffer) => {
                if (err) throw err;
                // 압축된 파일 새로 저장(덮어씌우기)
                fs.writeFile(__dirname + '/public/messageimg/report.jpg', buffer, (err) => {
                  if (err) throw err;
                });
              });
          } catch (err) {
            console.log(err);
          }

        const user_picture = __dirname + '/public/messageimg/report.jpg';
        let rF = fs.readFileSync(user_picture);
        const encode = Buffer.from(rF).toString('base64');

        axios({
            method: method,
            // request는 uri였지만 axios는 url이다
            url: urlf,
            headers: {
                "Contenc-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature2,
            },
            // request는 body였지만 axios는 data다
            data: {
                fileName : `123.jpg`,
                fileBody : `${encode}`
            },
        }).then(res => {
            console.log(res.data);
            axios({
                method: method,
                // request는 uri였지만 axios는 url이다
                url: url,
                headers: {
                    "Contenc-type": "application/json; charset=utf-8",
                    "x-ncp-iam-access-key": accessKey,
                    "x-ncp-apigw-timestamp": date,
                    "x-ncp-apigw-signature-v2": signature,
                },
                // request는 body였지만 axios는 data다
                data: {
                    type: "MMS",
                    countryCode: "82",
                    from: my_number,
                    // 원하는 메세지 내용
                    content: `신고자 이름 : ${user_name}, 전화번호 ${user_phone}. 환자의 나이 : ${user_age}, 환자의 성별 : ${user_gender}. 추가 설명 : ${user_description}`,
                    messages: [
                    // 신청자의 전화번호
                    { to: `${user_phone_number}`, },]  ,
                    files : [
                        {fileId : `${res.data.fileId}`}
                    ],
                },
            }).then(res => {
                console.log(res.data);
                delete_img();
            })
            .catch(err => {
                console.log(err);
                delete_img();
            })
        })
        .catch(err => {
            console.log(err.response.data);
            delete_img();
        })
        return finErrCode;
    }
    else{
    axios({
        method: method,
        // request는 uri였지만 axios는 url이다
        url: url,
        headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        // request는 body였지만 axios는 data다
        data: {
            type: "MMS",
            countryCode: "82",
            from: my_number,
            // 원하는 메세지 내용
            content: `신고자 이름 : ${user_name}, 전화번호 ${user_phone}. 환자의 나이 : ${user_age}, 환자의 성별 : ${user_gender}. 추가 설명 : ${user_description}`,
            messages: [
            // 신청자의 전화번호
            { to: `${user_phone_number}`, },]  ,
        },
    }).then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    }
}

function delete_img() {
    if (fs.existsSync(__dirname + '/public/messageimg/report.jpg')) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(__dirname + '/public/messageimg/report.jpg');
          console.log("report delete");
        } catch (error) {
          console.log(error);
        }
    }
}