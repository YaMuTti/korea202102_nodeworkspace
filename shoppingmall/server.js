/*쇼핑몰 개발환경 구축 먼저 하자 */
var http = require("http");
var express = require("express");
var static = require("serve-static");//정적자원 처리를 위한 외부모듈 (설치)
var ejs = require("ejs"); //설치
var mysql = require("mysql"); //설치
var path = require("path"); //확장자 추출 등 파일경로와 관련된 처리 모듈
var multer = require("multer"); //파일업로드 처리 모듈
                                            //이 모듈이 기존의 순수한 request 객체를 분석해서
                                            //파일, 파라미터 등을 처리해놓았다!!
                                            //따라서 클라이언트가 파일을 전송하기 위한 인코딩타입인
                                            //multipart/form-data를 명시하는 순간부터는, 순수한
                                            //request로는 파일처리 및 파라미터를 받을수 없으며
                                            //업로드 모듈을 통해 업무를 처리해야 한다..
                                            //jsp, php, asp 등등 언어도 원리가 동일하다..
var mymodule = require("./lib/mymodule.js");
var expressSession=require("express-session"); //서버측 세션을 관리하는 모듈


const conStr={
    url:"localhost",
    user:"root",
    password:"1234",
    database:"shoppingmall"
};


//기존의 순수 요청 정보를 담고있는 request 객체를 multer에게 전달해주자
//그러면 multer가 요청을 분석해준다
var upload = multer({
    storage: multer.diskStorage({
        destination:function(request, file, cd){
            cd(null, __dirname+"/static/product");
        },
        filename:function(request, file, cd){
            cd(null, new Date().valueOf()+path.extname(file.originalname));
        }
    })
});

var app = express();

app.use(static(__dirname+"/static")); //정적자원의 최상위 루트를 설정 
app.use(express.urlencoded({
    extended:true,
}));//post 요청의 파라미터 받기위함

//세션 설정
app.use(expressSession({
    secret:"key secret",
    resave:true,
    saveUninitialized:true
}));

//템플릿 뷰 엔진 등록 (서버 스크립트의 위치 등록)
app.set("view engine","ejs"); //등록 후엔 자동으로 무도건 views 라는 디렉토리 하위에서
//ejs를 찾아나선다.따라서 views라는 정해진 디렉토리를 무조건 존재시켜야 한다!!

/*--------------------------------------------------------------------
쇼핑몰 관리자 측 요청 처리
--------------------------------------------------------------------*/

//관리자모드 로그인 폼 요청 
app.get("/admin/loginform", function(request, response){
    response.render("admin/login");
});

//관리자 로그인 요청 처리 
app.post("/admin/login", function(request, response){
    var master_id=request.body.master_id;
    var master_pass=request.body.master_pass;
    console.log(master_id);
    console.log(master_pass);

    var sql="select * from admin where master_id=? and master_pass=?";

    var con=mysql.createConnection(conStr);
    con.query(sql, [master_id, master_pass] , function(err,  result , fields){
        if(err){
            console.log("조회 실패", err);
        }else{
            //console.log("result는 ",result);
            //로그인이 일치 하는지 않하는지? 

            var flag=false; //로그인 성공 여부

            if(result.length <1){
                console.log("로그인 실패");
                //이전 화면으로 강제로 되돌리기  history.back()
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(mymodule.getMsgBack("로그인 정보가 올바르지 않습니다"));
            }else{
                //데이터베이스 조회가 성공되었으므로, 이 관리자의 정보를 세션 영역에
                //담아놓자.. 이렇게 하면, 추후 접속이 끊어진 이후에 클라이언트가 재 요청을
                //들어오더라도 이미 서버측의 메모리에 존재하는 세션을 참고하여 재 인증하지
                //않아도 된다!! 즉, 마치 웹이 네트워크를 유지할 수 있는 것(stateful)처럼
                //보여질 수 있다..원래 웹은 네트워크 연결 유지가 불가능하다..
                request.session.admin={
                    admin_id: result[0].admin_id,
                    master_id: result[0].master_id,
                    master_pass: result[0].master_pass,
                    master_name: result[0].master_name
                }
                response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                response.end(mymodule.getMsgUrl("로그인성공","/admin/main"));
            }
        }
        con.end();
    });
});

//관리자 모드 메인 요청 처리 
app.get("/admin/main", function(request, response){
    //main.ejs는 아무나 보여주면 안된다!! 즉, 인증을 거친 사람만이 볼 수 잇는 페이지다!
    //따라서 인증과정을 수행했는지 여부는 request.session 객체에 개발자가 의도한
    //변수가 존재하는지 여부로 판단해야 한다..
    checkAdminSession(request, response, "admin/main");
});


//상품 관리 페이지 요청 처리 
app.get("/admin/product/registform", function(request, response){
    if(request.session.admin==underfined){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(mymodule.getMsgBack("관리자 인증이 필요한 서비스입니다"));
    }else{
        //관리자모드의 모든 app.get(), app.post()마다 다 넣어줘야 한다..
        var sql="select * from topcategory";
    
        var con = mysql.createConnection(conStr);
        con.query(sql, function(err, result, fields){
            if(err){
                console.log("상위 카테고리 조회 실패", err);
            }else{
                console.log(result);
                response.render("admin/product/regist", {
                    record:result /*배열을 ejs에 전달*/
                });            
            }                 
            con.end();        
        });
    }
});

//선택된 상위카테고리에 소속된 하위카테고리 목록가져오기 
//이 요청은 클라이언트가 비동기로 요청해야 됨...
//그래야, 결과 전달시 하위 카테고리만 전달하면 되니깐...
app.get("/admin/product/sublist", function(request, response){
    
    var topcategory_id = request.query.topcategory_id; //파라미터 받기
    var sql="select * from subcategory where topcategory_id="+topcategory_id;

    //쿼리문 실행~~~~
    var con = mysql.createConnection(conStr);
    con.query(sql, function(err, result, fields){
        if(err){
            console.log("하위목록 가져오기 실패", err);
        }else{
            console.log("result is ", result);
            //어떤 페이지를 보여줘야 하나?
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(JSON.stringify(result));
        }
        con.end();
    });
});

//상품 등록 요청 처리
app.post("/admin/product/regist", upload.single("product_img") ,function(request, response){
    //상품 정보 파라미터들 받기!!!
    //upload.single()을 명시하면, multer를 이용하여 파라미터를 받을 수 있게 된다.
    var subcategory_id = request.body.subcategory_id;
    var product_name = request.body.product_name;
    var price = request.body.price;
    var brand = request.body.brand;
    var detail = request.body.detail;
    var filename = request.file.filename;

    var sql="insert into product(subcategory_id, product_name, price, brand, detail, filename)";
    sql+=" values(?,?,?,?,?,?)";
    var con = mysql.createConnection(conStr);

    con.query(sql, [subcategory_id, 
        product_name, price, brand, detail, filename] , function(err, fields){
            if(err){
                console.log("등록중 에러", err);
            }else{
                //클라이언트로 하여금 지정한 url로 재접속을 유도함
                response.redirect("/admin/product/list");
            }
            con.end();
    });
});

app.get("/admin/product/list", function(request, response){
    var currentPage = 1; //기본적인 페이지 디폴트 값은 1로 한다..

    //누군가가 페이지 아래 링크를 눌렀다면, currentPage 파라미터가 넘어온다..
    if(request.query.currentPage!=undefined){
        currentPage=request.query.currentPage;
    }

    var sql="select product_id, s.subcategory_id, sub_name, product_name";
    sql+=", price, brand, filename";
    sql+=" from subcategory s,  product p";
    sql+=" where s.subcategory_id = p.subcategory_id";
    
    var con=mysql.createConnection(conStr);
    
    con.query(sql, function(err, result, fields){
        if(err){
            console.log("상품 리스트 가져오기실패", err);
        }else{
            console.log(result);

            response.render("admin/product/list", {
                param:{
                    "currentPage":currentPage,
                    "record":result
                }
            });
        }
        con.end();
    });

});
/*--------------------------------------------------------------------
쇼핑몰 클라이언트 측 요청 처리
--------------------------------------------------------------------*/
//쇼핑몰 메인 요청 처리
app.get("/shop/main", function(request, response){
    //네비게이션의 카테고리 가져오기
    var sql="select * from topcategory";

    var con=mysql.createConnection(conStr);
    con.query(sql, function(err, result, fields){
        if(err){
            console.log("최상위 카테고리 가져오기 실패", err);
        }else{
            response.render("shop/index", {
                topList:result
            });
        }
        con.end();
    });

});

//쇼핑상품 목록 요청 처리
app.get("/shop/list", function(request, response){
    var sql="select * from topcategory";

    var con=mysql.createConnection(conStr);
    con.query(sql, function(err, result, fields){
        if(err){
            console.log("최상위 카테고리 가져오기 실패", err);
        }else{
            response.render("shop/shop", {
                topList:result
            });
        }
        con.end();
    });
});

/*--------------------------------------------------------------------
세션 체크
--------------------------------------------------------------------*/
function checkAdminSession(request, response, url){
    if(request.session.admin){ //undefined가 아니라면..
        //인증 받은 관리자의 정보를 DB가 아닌 메모리 영역의 세션을 이용하여 가져오기!!
        response.render(url, {
            adminUser:request.session.admin
        });
    }else{
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(mymodule.getMsgBack("관리자 인증이 필요한 서비스입니다."));
    }
}

var server = http.createServer(app);
server.listen(9999, function(){
    console.log("Shopping mall is running at 9999 port...");
});