import Button from "./Button";
import Reel from "./Reel";
import Win from "./Win";

export default class SlotMachine{
    public reel: Reel;
    public button: Button;
    public win: Win;

    constructor(){
        this.reel = new Reel(this);
        this.win = new  Win(this);
        this.draw();
        this.button = new Button(this);
    }

    draw(){
        const background = PIXI.Sprite.from('assets/background.png');
        window.app.stage.addChild(background);

        const graphic = new PIXI.Graphics();
        graphic.lineStyle(4, 0xFF00FF, 1);
        graphic.beginFill(0x650A5A, 0.25);
        graphic.drawRoundedRect(490, 290, 520, 320, 16);
        graphic.endFill();
        window.app.stage.addChild(graphic);
    }
}