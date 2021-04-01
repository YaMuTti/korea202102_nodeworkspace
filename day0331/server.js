/*
node.js는 브라우저 탑재된 자바스크립트와는 목적이 틀리다.
즉 응용프로그램 개발 중 주로 서버를 개발할때 많이 사용됨
node.js는 자체적으로 많은 기능을 가지지 못하다!!
따라서 주로 모듈을 이용해서 프로그램을 개발한다.
*/
var http=require("http"); //웹기본 서버 모듈!! 이 모듈만 있으면
                                    //기본적인 웹서버를 구출할 수 있다..
var server = http.createServer(); //서버 객체 생성

//생성된 서버 객체를 이용하여, 서버를 가동해본다!!
server.listen(9999, function(){
    console.log("My Server is running at 9999 port...");
});