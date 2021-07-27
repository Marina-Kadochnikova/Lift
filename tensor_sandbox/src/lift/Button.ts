import { Texture } from "pixi.js-legacy";
import Lift from "./Lift";

export default class Button{
    protected parent: Lift;
    public readonly floor: number;
    public button: PIXI.Sprite;

    constructor(parent: any, floor: number){
        this.parent = parent;
        this.floor = floor;
        this.draw();
    }

    draw(){
        this.button = new PIXI.Sprite(Texture.WHITE);
        // this.button.tint = 0xFFD700;
        this.button.width = 25;
        this.button.height = 25;
        this.button.x = 490;
        this.button.y = 850 - this.floor * 150; 
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.button.on('pointerdown', this.onButtonDown.bind(this));

        let ground = new PIXI.Graphics();
        ground.lineStyle(3, 0x000000);
        ground.moveTo(0, 95);
        ground.lineTo(300, 95);

        let texture = PIXI.Texture.from('assets/lift_bg.png');
        let background = new PIXI.Sprite(texture);
        background.width = 465;
        background.height = 148;
        background.x = 490;
        background.y = 850 - this.floor * 150; 
        window.app.stage.addChild(background);

        let text = new PIXI.Text(this.floor.toString(), { fontFamily: 'Arial', fontSize: 15, fill: 0x000000 });

        this.button.addChild(text);
        this.button.addChild(ground);
        window.app.stage.addChild(this.button);
    }

    onButtonDown(){
        this.parent.controller.buttonDown(this);
        this.button.tint = 0x98FB98;
    }
}