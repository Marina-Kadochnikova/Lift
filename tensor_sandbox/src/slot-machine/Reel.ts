import SlotMachine from "./slot-machine";
import Tween from "./Tween";

export default class Reel{
    protected parent: SlotMachine;
    public tweens: Tween[];
    public reelContainer: PIXI.Container;
    public containerArr: PIXI.Container[];
    public symbolsArr: PIXI.AnimatedSprite[][];
    public slotTextures: PIXI.Texture[][];
    public lines: PIXI.Sprite[];

    constructor(parent: any){
        this.parent = parent;
        this.tweens = [];
        this.reelContainer = new PIXI.Container();
        this.containerArr = [];
        this.symbolsArr = [];
        this.slotTextures = [];
        this.lines = [];
        this.start();
        this.addTextures();
    }

    start() {
        window.app.ticker.add(() => {
            this.update();
        });
    }

    update() {
        for (let i = 0; i < this.tweens.length; i++) {
            this.tweens[i].update(window.app.ticker.elapsedMS);
        }
    }

    addTween(): Tween {
        const tween = new Tween();
        this.tweens.push(tween);
        return tween;
    }

    stopTween(tween: Tween){
        tween.stop();
        this.parent.button.button.tint = 0xffffff;
        this.parent.button.button.interactive = true;
        this.parent.win.checkWin(this.symbolsArr);
    }

    onButtonDown(){
        this.parent.button.button.interactive = false;
        let tween = this.addTween().addControl(this.reelContainer).do({y:[0,300]}, Tween.Linear);
        tween.start(500, () => {this.newTween();}, 1);
        setTimeout(()=> this.stopTween(tween), 5000);
        for (let l in this.lines){
            this.lines[l].visible = false;
        }
    }

    newTween(){
        this.updateSymbols();
        this.addTween().addControl(this.reelContainer).do({y:[0, 300]}).start(500, ()=>{this.updateSymbols();  this.colTween(); }, 1);
    }

    colTween(){
        this.reelContainer.y = 0;
        for (let i = 0; i< this.containerArr.length; i++){
            this.addTween().addControl(this.containerArr[i]).do({ y: [0, 300] }).start(500, ()=> this.updateCol(i), 1);
        }
    }

    updateCol(i: number){
        for (let j = 0; j < 3; j ++){
            this.symbolsArr[i][j+3].textures = this.symbolsArr[i][j].textures;            
        }
        this.containerArr[i].y = 0;
        let r = this.addTween().addControl(this.containerArr[i]).do({ y: [0, 300] }).start(500, undefined, -1);

        setTimeout(() => { r.stop(); this.containerArr[i].y = 0;}, 1000 + i * 500);
    }

    updateSymbols(){
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 3; j ++){
                let t = this.symbolsArr[i][j].textures;
                this.symbolsArr[i][j].textures = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
                this.symbolsArr[i][j+3].textures = t;
            }
        }
        this.reelContainer.y = 0;
    }

    createReel(){
        this.reelContainer.x = 500;
        this.reelContainer.y = 0;
        for (let i = 0; i < 5; i++){
            let col: PIXI.Container = new PIXI.Container();
            let t = [];
            for (let j = 0; j < 6; j++){
                const symbol = new PIXI.AnimatedSprite(this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]);
                symbol.x = 0;
                symbol.y = j * 100;
                symbol.animationSpeed = 0.3;
                col.addChild(symbol);
                t.push(symbol);
            }
            this.symbolsArr.push(t);
            col.x = 100 * i;
            col.y = 0;
            this.containerArr.push(col);
            this.reelContainer.addChild(col);
        }
        window.app.stage.addChild(this.reelContainer);

        this.parent.win.createWinLines();
    }

    createMask(){
        let thing = new PIXI.Graphics();
        thing.clear();
        thing.drawRect(500, 300, 500, 300);
        this.reelContainer.mask = thing;
        window.app.stage.addChild(thing);
    }

    addTextures(){
        let r: string[] = [];
        for (let i = 1; i < 6; i++) {
            r.push(`assets/sym${i}.json`)
        }
        window.app.loader
        .add(r)
        .load((loader, resources) => {
            for (let j = 1; j < 6; j++){
                const frames = [];
                for (let i = 0; i < 2; i++) {
                    const val = `${j}_${i}`;
                    frames.push(PIXI.Texture.from(`sym${val}.png`));
                }
                this.slotTextures.push(frames);
            }
            this.createMask();
            this.createReel();
        });
    }
}