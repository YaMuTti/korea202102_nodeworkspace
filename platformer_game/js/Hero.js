/*
    예전에 작성한 코드를 재사용해보자!
*/
class Hero extends GameObject{
    constructor(container, src, width, height, x, y, velX, velY){
        //부모의 생성자 메서드를 호출하자!!(매개변수 빠짐없이)
        super(container, src, width, height, x, y, velX, velY)

        this.g=0.5; //중력 가속도 효과를 내기 위한 변수 , 이변수는 상속과 상관없이 내꺼!!!
        this.jump=false; //주인공의 점프상태를 판단할 수 있는 변수(즉 점프하는지 안하는지)
    }
    //히어로는 움직임이 있다! 따라서 메서드 정의가 요구된다!
    //그렇지만, 부모에게 물려받은 메서드가, 현재 나의 상황에는 맞지 않을 경우
    //업그레이드할 필요가 있다!!!(java, C# 등 oop언어에서는 이러한 메서드 재정의기법을
    //가리켜 오버라이딩(overriding)이라 한다)
    tick(){
        //코드에서는 보이지 않지만, 현재 클래스는 GameObject의 모든것을 다 가지고
        //있는 것과 마찬가지이다!! 즉, 내것 처럼 접근할 수 있다
        this.velY+=this.g; //중력을 표현하기 위해 가속도로 처리!!

        this.y=this.y+this.velY;
        this.x=this.x+this.velX;

        //현재 화면에 존재하는 모든 벽돌들을 대상으로, 주인공의 발바닥과 닿았는지 체크
        for(var i=0;i<blockArray.length;i++){
            var onBlock=collisionCheck(this.img, blockArray[i].img);

            /*onBlock이 true라면 벽돌에 발바닥이 닿은 거임
            1) 속도를 없애고
            2) 1번의 조건은 무조건 수행하지 말고, 우리가 원할때만 수행하도록 제어하자!
            */
            if(onBlock && this.jump==false){ //속도를 없애고
                this.velY=0; //점프버튼을 누르면, velY 값을 0으로 묶어놓지 말자!
                //위치를 벽돌위에 고정 (벽돌의 y값보다 자신의 키만큼 위로 올라가게)
                this.y=blockArray[i].y-this.height;
            }

            //주인공이 점프한 이후, 다시 하강하는 순간을 포착하여 벽돌위에 서있을수 있는
            //핵심 변수인 this.jump를 다시 false로 돌려놓자!!
            if(this.velY>0){ //다시 아래로 떨어지는 순간!!!!
                this.jump=false;

            }
        }
    }
    render(){
        this.img.style.top=this.y+"px";
        this.img.style.left=this.x+"px";
    }
}