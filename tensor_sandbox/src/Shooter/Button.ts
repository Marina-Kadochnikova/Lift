import ShooterGame from "./ShooterGame";

export default class Button{
    protected parent: ShooterGame;
    private button: PIXI.Sprite;
    public restart: PIXI.Sprite;
    public over: PIXI.Graphics;
    public finalScore: PIXI.Text;

    private textStyle: PIXI.TextStyle;

    constructor(parent: any){
        this.parent = parent
        this.create();
        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 55,
            fontWeight: 'bold',
            fill: 0xFF00FF
        });
    }

    create(){
        const texture = PIXI.Texture.from('assets/button1.png');
        this.button = new PIXI.Sprite(texture);
        this.button.scale.y = 0.5;
        this.button.scale.x = 0.5;
        this.button.x = 0;
        this.button.y = 0;
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.button.on('pointerdown', this.onStartBtnDown.bind(this));
        window.app.stage.addChild(this.button);
    }

    onStartBtnDown(){
        this.button.visible = false;
        this.parent.start();
    }

    gameov(){
        let gameover = new PIXI.Text("GAME OVER", this.textStyle);
        gameover.x = 550;
        gameover.y = 250;

        this.finalScore = new PIXI.Text("Your score: ", this.textStyle);
        this.finalScore.x = 400;
        this.finalScore.y = 350;


        const texture = PIXI.Texture.from('assets/button1.png');
        this.restart = new PIXI.Sprite(texture);
        this.restart.scale.y = 0.5;
        this.restart.scale.x = 0.5;
        this.restart.x = window.app.screen.width / 2;
        this.restart.y = window.app.screen.height / 2;
        this.restart.interactive = true;
        this.restart.buttonMode = true;

        this.over = new PIXI.Graphics();
        this.over.lineStyle(8, 0xFF00FF, 1);
        this.over.beginFill(0x650A5A, 0.8);
        this.over.drawRect(window.app.screen.width/4, window.app.screen.height/4, 700, 300);
        this.over.endFill();
        this.over.addChild(this.finalScore, this.restart, gameover);
        this.over.visible = false;
        window.app.stage.addChild(this.over);
    }

    newGameStart(){
        this.restart.visible = false;
        this.finalScore.visible = false;
        this.over.visible = false;
    }
}