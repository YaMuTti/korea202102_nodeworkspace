var http = require("http"); //내장모듈, 따라서 별도의 설치 불필요
var fs = require("fs"); //파일을 제어하는 모듈 (내장모듈)

var server = http.createServer(function(request, response){
    //request : 클라이언트의 요청 정도
    //response : 클라이언트에게 보낼 응답 정보

    fs.readFile("./regist_form.html", "utf8", function(err, data){
        //클라이언트에 지정한 문자열을 전송!!
        //HTTP의 형식을 갖추어서 클라이언트에게 응답을 해보자!!

        response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"} ); //header정보를 제대로 갖추어서 응답하자!!!
        response.end(data); 
    });

});

server.listen(7878, function(){
    console.log("My Server is running at 7878...");
}); //서버가동