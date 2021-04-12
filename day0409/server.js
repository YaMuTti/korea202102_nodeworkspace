var http = require("http");
var express = require("express"); //외부-설치
var fs=require("fs");
var ejs =require("ejs"); //외부-설치
var oracledb=require("oracledb");//외부-설치
// var bodyParser=require("body-parser");
var static=require("serve-static"); //정적 자원을 처리하기 위한 모듈
var mymodule=require("./lib/mymodule.js");

oracledb.autoCommit=true; // 쿼리문 실행마자 트랜잭션을 commit으로 처리
oracledb.fetchAsString=[oracledb.CLOB]; //clob 데이터를 string 으로 변환

var app = express();

//미들웨어 등록
app.use(static(__dirname+"/static")); //정적자원의 루트 디렉토리 등록
app.use(express.urlencoded({extended:true})); //post 방식 데이터 처리

//뷰엔진 등록(서버스크립트 선택)
//일단 뷰엔진이 등록되고 나면, 확장자를 명시할 필요 없다 why???
//view 라는 정해진 디렉토리를 참조하고, 그 안에 모든 파일은 다 ejs이기 때문
app.set("view engine", "ejs");


//이 시점 이후 부터는 conStr변수의 값은 변할 수 없다(상수화 시킴)
const conStr={
    user:"node",
    password:"node",
    connectString:"localhost/XE"
};

//게시판 목록 요청 처리 
app.get("/news/list", function(request, response){
    //클라이언트가 전송한 파라미터 받기!!!
    var currentPage = request.query.currentPage; //클라이언트가 보기를 원하는 페이지수
    
    //게시판의 최초 접속이라면, currentPage정보가 없기 때문에 1페이지로 간주
    if(currentPage==undefined){ 
        currentPage=1;
    } 
    console.log("currentPage ", currentPage);

    oracledb.getConnection(conStr, function(err, con){
        if(err){
            console.log("접속실패",err);
        }else{
            console.log("접속성공");
            //쿼리문 실행
            var sql="select * from news order by news_id desc";
            con.execute(sql, function(error, result){
                if(error){
                    console.log(error);
                }else{
                    console.log("result는", result);
                    fs.readFile("./views/news/list.ejs", "utf8", function(error, data){
                        if(error){
                            console.log(error);
                        }else{
                            var r = ejs.render(data,{
                                //ejs에 넘겨줄 데이터 지정 
                                param:{
                                    page:currentPage,
                                    /*result 는 mysql과 틀리게 json 객체의 rows속성에 들어있으며
                                    그 안에 2차원배열에 들어있다*/
                                    record:result.rows,
                                    lib:mymodule
                                }
                            }); //ejs 해석 및 실행하기
                            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                            response.end(r); //실행한 결과 전송하기
                        }
                    });

                }
                con.close();
            });
        }
    }); //오라클 접속 및 접속객체 가져오기

});

app.post("/news/regist", function(request, response){
    //파라미터 받기(post)
    // console.log(request.body.title);
    var title=request.body.title;
    var writer=request.body.writer;
    var content=request.body.content;

    //오라클에 넣기
    oracledb.getConnection(conStr, function(err, con){
        if(err){
            console.log("접속실패",err);
        }else{
            var sql="insert into news(news_id, title, writer, content)";
            sql +=" values(seq_news.nextval, :1, :2, :3)";
            con.execute(sql, [title, writer, content], function(error, result){
                if(error){
                    console.log("등록중 에러발생", error);
                }else{
                    //여기서도 무조건 등록된다는 보장은 없다. 즉 오라클에 반영되었느냐 여부는
                    //result 를 통해 알아봐야한다.
                    console.log("result는 ", result);
                    if(result.rowsAffected==0){//등록실패
                        //status 코드란, http 통신 서버의 상태를 나타내는 기준값 코드
                        response.writeHead(500, {"Content-Type":"text/html;charset=utf-8"});
                        response.end(mymodule.getMsgUrl("등록실패", "/news/list"));
                    }else{//등록 성공
                        response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                        response.end(mymodule.getMsgUrl("등록성공", "/news/list"));

                    }
                }
                con.close(); //oracle 접속해제
            });
        }
    });
});

//상세보기 요청 처리
app.get("/news/detail", function(request, response){
    //express 모듈이 response객체의 기능을 업그레이드 함
    //response.render() 메서드는 기본적으로 views 라는 정해진 디렉토리안에
    //정해진 뷰엔진을 찾게된다(뷰 엔진은 개발자가 선택할 수 있다)
    var news_id = request.query.news_id; //get방식으로 전송된 파라미터 받기!!
    
    //오라클 연동하기
    oracledb.getConnection(conStr, function(err, con){
        if(err){
            console.log("접속실패", err);
        }else{
            var sql="select * from news where news_id="+news_id;
            con.execute(sql, function(error, result){
                if(error){
                    console.log("SQL실행 중 에러 발생", error); //심각한 에러
                }else{
                    console.log("한건 가져오기 결과는 ",result);

                    //댓글 목록도 가져와야 한다??
                    sql="select * from comments order by comments_id asc";
                    con.execute(sql, function(e, record){
                        if(e){
                            console.log("코멘트목록 가져오기 에러", e);
                        }else{
                            response.render("news/detail", {
                                news:result.rows[0], //뉴스 목록
                                commentsList:record.rows //코멘트 목록
                            });
                        }
                        con.close();
                    });
                }
            });
        }
    });
});


//코멘트 댓글 등록 요청 처리
app.post("/comments/regist", function(request, response){
    //파라미터 받기
    var news_id=request.body.news_id;
    var msg=request.body.msg;
    var author=request.body.author;

    oracledb.getConnection(conStr, function(err, con){
        if(err){
            console.log("접속실패", err);
        }else{
            var sql="insert into comments(comments_id, news_id, msg, author)";
            sql+="values(seq_comments.nextval, :1, :2, :3)";
            
            con.execute(sql, [news_id, msg, author ] ,function(error, result){ //쿼리문 실행
                if(error){
                    console.log("insert 쿼리실행중 에러 발생", error);
                    //server's internal fatal error !!
                    response.writeHead(500, {"Content-Type":"text/html;charset=utf-8"});
                    response.end("이용에 불편을 드려 죄송합니다..");
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(mymodule.getMsgUrl("댓글등록","/news/detail?news_id="+news_id));//클라이언트로 하여금 지정한 url로 재접속하라!!
                }
                con.close();
            });
        }
    });
});

var server = http.createServer(app);
server.listen(8888, function(){
    console.log("The Server with Oracle is running at 8888 port...");
});