/*콘솔? 전산분야에서 전통적으로 입력과 출력 처리를 담당하는 코드
예전에는, 중앙의 컴퓨터에 접속하여 입력과 출력을 처리했지만,
근래에는, 자신의 pc와 입력 출력을 처리하는 것도 콘솔이라 칭함
따라서 콘솔이랑 GUI(그래픽) 없이, 검정화면에 흰글씨기반으로
컴퓨터에 입력과 출력을 처리하는 도구를 의미*/

//Node.js가 지원하는 콘솔 객체
console.log("banana","orange","apple"); //콘솔에 문자열 출력!!
console.time("my time"); //my time이란 이름으로 시간 측정 시작
for(var i=0;i<1000000;i++){
}
console.timeEnd("my time"); //my time의 측정 종료