/*블럭을 정의한다*/
class Block extends GameObject{ //이 시점부터는 GameObject에 있는 모든 코드는
    //다 내꺼!!!(다 접근할 수 있슴)
    constructor(container, src, width, height, x, y, velX, velY){
        super(container, src, width, height, x, y, velX, velY); //블럭인 내가 초기화 되기 전에, 부모를 먼저 초기화!
    }
}