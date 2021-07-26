import { Spine } from "pixi-spine";
import ShooterGame from "./ShooterGame";

export default class SpineBoy{
    protected parent: ShooterGame;
    public spineAnim: Spine;
    public hitBox: PIXI.Sprite;
    public health: number = 300;
    public mask: PIXI.Graphics;
    public healthLine: PIXI.Graphics;

    
    constructor(parent: any, spine: Spine){
        this.parent = parent;
        this.spineAnim = spine;
        this.addHitBox();
        this.createHealth();
        this.createMask();
        window.app.stage.addChild(this.spineAnim);
        window.app.stage.interactive = true;
    }

    changeHealth(damage: number){
        this.health -= damage
        this.mask.clear();
        this.mask.drawRect(300, 50, this.health, 30);
        this.healthLine.mask = this.mask;
    }

    createHealth(){
        this.healthLine = new PIXI.Graphics();
        this.healthLine.beginFill(0xDE3249);
        this.healthLine.drawRect(300, 50, this.health, 30);
        this.healthLine.endFill();
        window.app.stage.addChild(this.healthLine);

        let graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0x650A5A, 0.25);
        graphics.drawRoundedRect(295, 45, this.health + 10, 40, 16);
        graphics.endFill();
        window.app.stage.addChild(graphics);
    }

    createMask(){
        this.mask = new PIXI.Graphics();
        this.mask.clear();
        this.mask.drawRect(300, 50, this.health, 30);
        this.healthLine.mask = this.mask;
        window.app.stage.addChild(this.mask);
    }

    addHitBox(): void {
        const ikCross = this.spineAnim.skeleton.ikConstraints[0].target;
        ikCross.x = 1000;
        ikCross.y = this.spineAnim.y + 150;

        let rect = new PIXI.Sprite(PIXI.Texture.WHITE);
        rect.x = window.app.screen.width / 3.5;
        rect.y = window.app.screen.height / 2.15;
        rect.width = this.spineAnim.width;
        rect.height = this.spineAnim.height;
        rect.visible = false;
        this.hitBox = rect;
        this.spineAnim.visible = false;
        window.app.stage.addChild(rect);  
    }
}