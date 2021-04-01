/*
process 객체는 node.js 프로그램과 관련된 정보를 담고 있슴

x86     :   286,386,486,586 32비트기반 컴퓨터
x64     :   요즘 사용중인 64기반 컴퓨터
*/
console.log("현재 사용중인 node.js의 플랫폼은 ",process.platform);
console.log("컴퓨터 환경 정보는 ",process.env);
console.log("버전은 ",process.version);
