/*
노드js에 내장된 여러 모듈 중 os 모듈을 사용해보자!!
중요하지는 않다.. 단지 모듈을 가져올때 익숙해지기 위해 연습
현재의 node.js가 실행중인 운영체제와 관련된 정보를 가진 모듈
*/
var os = require("os");
console.log("호스트 이름", os.hostname());
console.log("운영체제 버전", os.release());
console.log("운영체제 실행된 시간", os.uptime());