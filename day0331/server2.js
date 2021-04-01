/*
클라이언트의 요청을 받을 웹서버를 구축한다!!(두번째 실습)
*/
var http = require("http"); //http 모듈(웹서버 모듈)을 가져오기

var server = http.createServer(); //서버 객체 생성

//클라이언트의 접속을 감지해보자!!
server.on("connection", function(){
    console.log("클라인트의 접속 감지!!");

});

server.listen(9999, function(){
    console.log("Second Server is running at 9999 port...")
}); //클라이언트의 접속을 기다림..