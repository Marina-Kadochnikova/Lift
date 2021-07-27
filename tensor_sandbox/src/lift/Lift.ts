import Cabin from "./Cabin";
import Controller from "./Controller";
import Button from "./Button";

export default class Lift{
    public cabin: Cabin;
    public buttons: Button[];
    public controller: Controller;
    public floorsNumber = 5;
    public background: PIXI.Sprite;

    constructor(){
        this.createBg();

        this.cabin = new Cabin(this);
        this.buttons = this.createButton();
        this.controller = new Controller(this);
    }

    createBg(){
        let t = PIXI.Texture.from('assets/lift_bgbg.png');
        let bg = new PIXI.Sprite(t);
        window.app.stage.addChild(bg);

        let liftShaft = new PIXI.Graphics();
        liftShaft.beginFill(0xa39c99);
        liftShaft.drawRect(410, 100, 80, 750);
        liftShaft.endFill();
        window.app.stage.addChild(liftShaft);
    }

    createButton(){
        let result: Button[] = [];
        for(let i = 1; i < this.floorsNumber + 1; i++){
            result.push(new Button(this, i));
        }
        return result;
    }
}