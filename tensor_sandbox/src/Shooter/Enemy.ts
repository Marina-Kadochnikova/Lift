import ShooterGame from "./ShooterGame";

export default class Monster{
    protected parent: ShooterGame;
    public enemy: PIXI.AnimatedSprite;
    public rectM: PIXI.Sprite;

    constructor(parent: any, anim: PIXI.AnimatedSprite){
        this.parent = parent;
        this.enemy = anim;
        this.create();
    }

    create(){
        this.enemy.x = window.app.screen.width;
        this.enemy.y = window.app.screen.height/3;
        this.enemy.height = 200;
        this.enemy.width = 200;
        this.enemy.visible = false;
        window.app.stage.addChild(this.enemy);

        let rect = new PIXI.Sprite(PIXI.Texture.WHITE);
        rect.x = window.app.screen.width;
        rect.y = 160;
        rect.width = 200;
        rect.height = 200;
        rect.visible = false;
        this.rectM = rect;
        window.app.stage.addChild(rect); 
    }  
}