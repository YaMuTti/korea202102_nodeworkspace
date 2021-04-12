/*모듈은 변수, 함수 등의 코드가 모여진 단위
개발자가 모듈을 정의할때는 내장객체 중 exports 객체를 사용하면 됨
*/

//getMsg 메서드를 현재 모듈 안에 정의한다.
// (여기서 getMsg는 mymodule 의 모듈이다)
exports.getMsg=function(){
    return "This message is from my module"
} 

/* -----------------------------------------------------
1. 매개변수 n : 0~n미만까지의 랜덤한 수를 반환하는 함수
------------------------------------------------------*/
 exports.getRandom=function(n){
        var r=parseInt(Math.random()*n); //0.00xxx ~ 1미만 사이의 난수를 발생시켜줌 
        // console.log(r);
        return r;
 }

 
/* -----------------------------------------------------
2. 자리수 처리
    한자리수의 경우 앞에 0 붙이기
------------------------------------------------------*/
 exports.getZeroString=function(n){
    var result=(n>10)? n: "0"+n;
    return result;
}

/* -----------------------------------------------------
3. 메세지 처리 함수
    alert() 출력할 메세지 생성해주는 함수
    <script>
    alert("하고싶은말");
    location.href=원하는url
    </script>
------------------------------------------------------*/
exports.getMsgUrl=function(msg, url){
    var tag="<script>";
    tag+="alert('"+msg+"');";
    tag+="location.href='"+url+"';";
    tag+="</script>";
    return tag; //함수 호출자에게 최종적으로 생성된 태그문자열 반환
}
