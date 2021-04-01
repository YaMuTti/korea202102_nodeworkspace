/*
클라이언트의 브라우저에서 전송한 데이터를 가리켜 파라미터값이라고 하고,
이 파라미터 값을 서버측에서 받아서 처리해본다!!
*/
var http=require("http");
var querystring=require("querystring"); //파라미터 처리 모듈

var server = http.createServer(function(request, response){
    if(request.url=="/param"){
        //클라이언트가 전송한 파라미터 받기

        //get방식으로 전송된 데이터 받아보기
        querystring.parse();
        console.log("클라이언트의 요청 발견", querystring);
    }
});

server.listen(7777, function(){
    console.log("Server is running at 7777");
});