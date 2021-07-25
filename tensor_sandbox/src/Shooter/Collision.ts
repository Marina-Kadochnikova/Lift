import ShooterGame from "./ShooterGame";

export default class Collision{
    protected parent: ShooterGame;

    constructor(parent: any){
        this.parent = parent;
    }

    static checkCollision(item1: PIXI.Sprite, item2: PIXI.Sprite){
        return item1.x < item2.x + item2.width
        && item1.x + item1.width > item2.x
        && item1.y < item2.y + item2.height
        && item1.y + item1.height > item2.y;
    }
}