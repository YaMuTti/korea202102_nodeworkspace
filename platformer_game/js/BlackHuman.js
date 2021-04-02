/*흑인을 정의한다
나의 메모리 영역뿐만 아니라, Human 이라는 객체의 인스턴스의 메모리 영역도
내것처럼 쓰겠다!! 즉 확장하겠다!!
*/
class BlackHuman extends Human{
    constructor(color){    
        //바로 이 시점이 흑인이 태어나는 시점이므로, 다른 어떠한 
        //코드보다도 앞서서 부모님을 태어나게 해야 한다...
        //this.x=5; //에러발생 ..왜? 부모의 초기화보다 자식의 초기화가 앞설수 없기 때문에
        //금지되어 있다.. 부모생성자 호출보다 앞서는 코드의 존재금지!!
        super(color);
        
        console.log("자식인 BlackHuman 객체의 초기화 완료");
    }
    
    playBasketBall(){
        console.log("농구를 한다");
    }
    playBoxing(){
        console.log("복싱을 한다");
    }
}