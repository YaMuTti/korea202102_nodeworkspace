/*오라클 데이터 베이스 접속하기
오라클 인스턴스 및 리스너 프로세스가 가동되어 있어야 한다.
특히 Listener는 오라클에 다른 응용프로그램들이 접속할 수 있도록
허용해주는 역할..
*/
var oracledb = require("oracledb");
var conStr={
    user:"node",
    password:"node",
    connection:"localhost/xe"
};


oracledb.getConnection(conStr, function(err,con){//접속 성공시 커넥션 객체 반환
    if(err){
        console.log("접속실패",err)
    }else{
        console.log("접속성공");
    }
});