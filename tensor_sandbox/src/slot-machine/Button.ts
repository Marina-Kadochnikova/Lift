import SlotMachine from "./slot-machine";

export default class Button{
    protected parent: SlotMachine;
    public button: PIXI.Sprite;

    constructor(parent: any){
        this.parent = parent;
        this.draw();
    }

    draw(){
        const textureOn = PIXI.Texture.from('assets/button.png')
        this.button = new PIXI.Sprite(textureOn);
        this.button.scale.y = 0.5;
        this.button.scale.x = 0.5;
        this.button.x = 1100;
        this.button.y = 500;
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.button.on('pointerdown', this.onButtonDown.bind(this));
        window.app.stage.addChild(this.button);
    }

    onButtonDown(){
        this.parent.reel.onButtonDown();
        this.button.tint = 0x696969;

    }
}