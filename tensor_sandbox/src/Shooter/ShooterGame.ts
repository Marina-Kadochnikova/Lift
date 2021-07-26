import Button from "./Buttons";
import Box from "./Box";
import Bullet from "./Bullet";
import Enemy from "./Enemy";
import SpineBoy from "./SpineBoy";
import Tween from "./Tween";
import Collision from "./Collision";
import Loader from "./Loader";


export default class ShooterGame{
    public loader: Loader;
    public spineBoy: SpineBoy;
    public button: Button;
    public bullets: Bullet[];
    public enemies: Enemy[];
    public boxes: Box[];
    public tweens: Tween[];
    public background: PIXI.TilingSprite;

    public isLife: boolean;
    public isBoxOnScreen: boolean;
    public isEnemyOnScreen: boolean;
    public isBullOnScreen: boolean = false;
    public isJump: boolean;
    public currentBox: PIXI.Sprite;
    public currentEnemy: Enemy;
    public currentBull: PIXI.Sprite;
    public score: number;
    public textScore: PIXI.Text;
    public isGameStart: boolean = false;


    constructor(){
        this.loader = new Loader();
        window.app.loader.onComplete.add(() => {
            this.boxes = this.createBox();
            this.spineBoy = new SpineBoy(this, this.loader.spineboy);
            this.bullets = this.createBullet();
            this.enemies = this.createMonster();
        });
        this.makeBg();
        this.button = new Button(this);
        this.button.createGameOvBanner();
        this.newGame();
        this.createScore();
        document.addEventListener('keydown', (e) => this.onKeyPress(e)) 
    }

    createBullet(){
        let result: Bullet[] = [];
        for(let i = 0; i < 4; i++){
            result.push(new Bullet(this));
        }
        return result;
    }

    createBox(){
        let result: Box[] = [];
        for(let i = 0; i < 4; i++){
            result.push(new Box(this));
        }
        return result;
    }

    createMonster(){
        let result: Enemy[] = [];
        for(let i = 0; i < 4; i++){
            result.push(new Enemy(this, this.loader.enemy));
        }
        return result;
    }

    createScore(){
        this.textScore = new PIXI.Text(this.score.toString(),
                    {fontSize: 45,
                     fontWeight: 'bold',
                     fill: 0xFF00FF });
        this.textScore.x = 700;
        this.textScore.y = 38;
        window.app.stage.addChild(this.textScore);
    }

    addTween(): Tween {
        const tween = new Tween();
        this.tweens.push(tween);
        return tween;
    }

    makeBg() {
        const texture = PIXI.Texture.from("assets/new_back2.jpeg");
        this.background = new PIXI.TilingSprite(texture, window.screen.width, window.screen.height);
        window.app.stage.addChild(this.background);
    }

    newGame(){
        this.score = 0;
        this.tweens = [];
        this.isLife = false;
        this.isJump = false;

        if (this.isBoxOnScreen){
            this.isBoxOnScreen = false;
            this.currentBox.x = window.app.screen.width; 
            this.currentBox.visible = false; 
            this.currentBox.height = 150;
        }

        if (this.isEnemyOnScreen){
            this.isEnemyOnScreen = false;
            this.currentEnemy.enemy.x = window.app.screen.width; 
            this.currentEnemy.enemy.visible = false; 
            this.currentEnemy.rectM.x = window.app.screen.width;
        }

    }

    start() {
        this.isGameStart = true;
        this.spineBoy.spineAnim.visible = true;
        this.addStartAnimation();

        window.app.ticker.add(() => {
            this.update();
        });
    }


    update() {
        if (this.isLife) {
            this.score += 1/100;
            this.textScore.text = Math.round(this.score).toString();

            if (this.spineBoy.health === 0) {
                this.isLife = false;
                this.spineBoy.spineAnim.state.setAnimation(0, 'death', false);
                setTimeout(()=>this.gameOver(), 2000);
            }

            for (let i = 0; i < this.tweens.length; i++) {
                this.tweens[i].update(window.app.ticker.elapsedMS);
            }
            
            this.background.tilePosition.x -= window.app.ticker.elapsedMS;

            if (this.isBoxOnScreen){
                this.checkDamage(this.currentBox);
            }

            if (this.isEnemyOnScreen){
                this.checkHitEnemy();
                this.checkDamage(this.currentEnemy.rectM);
            }
        }

        if (this.spineBoy.spineAnim) {
            this.spineBoy.spineAnim.update(window.app.ticker.elapsedMS / 1000);
        }
    }

    restartGame(){
        this.newGame();
        this.spineBoy.healthLine.visible = true;
        this.textScore.visible = true;
        this.spineBoy.health = 300;
        this.spineBoy.changeHealth(0);
        this.textScore.text = this.score.toString();
        this.addStartAnimation();
    }


    addStartAnimation(){
        this.spineBoy.hitBox.y = window.app.screen.width / 3.6;
        let start = this.startNewGame.bind(this)
        this.spineBoy.spineAnim.state.setAnimation(0, 'portal', false);
        this.spineBoy.spineAnim.state.tracks[0].listener = {
            complete: function (trackEntry, count) {
                if ('portal' === trackEntry.animation.name) {
                    if (this.callback) {
                        this.callback();
                    }
                }
            }, callback: start
        }
    }

    startNewGame(){
        this.spineBoy.spineAnim.state.addAnimation(0, 'run', true, 0).mixDuration = 0.2;
        this.isLife = true;
        this.newHindrance();
    }

    gameOver(){
        this.currentEnemy.enemy.visible = false;
        this.spineBoy.healthLine.visible = false;
        this.textScore.visible = false;
        this.button.finalScore.text = this.textScore.text;
        this.button.banner.visible = true;
    }

    newHindrance() {
        if (this.isLife) {
            if(Math.random() < 0.5){
                this.addBox();
            } else{
                this.addEnemy();
            }

            setTimeout(() => {
                this.newHindrance();

            }, Math.random() * 1500);
        }
    }

    addBox(){
        if (!this.isBoxOnScreen){
            this.isBoxOnScreen = true;
            this.currentBox = this.boxes[Math.floor(Math.random()* this.boxes.length)].box;
            this.currentBox.visible = true;
            
            this.addTween().addControl(this.currentBox)
                .do({x:[this.currentBox.x, -200]})
                .start(1800, ()=> {
                    this.currentBox.x = window.app.screen.width; 
                    this.currentBox.visible = false;
                    this.currentBox.height = 150; 
                    this.isBoxOnScreen = false;}, 1);
        }
    }

    addEnemy(){
        if(!this.isEnemyOnScreen){
            this.isEnemyOnScreen = true;
            this.currentEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            this.currentEnemy.enemy.visible = true;
            
            this.addTween().addControl(this.currentEnemy.enemy)
                .do({x:[this.currentEnemy.enemy.x, -200]})
                .start(2000, ()=>{this.currentEnemy.enemy.x = window.app.screen.width; 
                                this.currentEnemy.enemy.visible = false; 
                                this.isEnemyOnScreen = false;}, 1);

            this.addTween().addControl(this.currentEnemy.rectM)
                .do({x:[this.currentEnemy.enemy.x - 100, -200]})
                .start(2000, ()=>{this.currentEnemy.rectM.x = window.app.screen.width;
                                 this.currentEnemy.rectM.height = 200;}, 1);
        }
    }

    checkDamage(item: PIXI.Sprite){
        if(this.spineBoy.spineAnim && Collision.checkCollision(this.spineBoy.hitBox, item)) {
            this.addTween().addControl(item)
                .do({height:[item.height, 0]}, Tween.Linear)
                .start(300,undefined, 1);
            this.spineBoy.changeHealth(5);
        }
    }

    checkHitEnemy(){
        if (this.spineBoy.spineAnim && this.isBullOnScreen && Collision.checkCollision(this.currentEnemy.rectM, this.currentBull)) {
            this.addTween().addControl(this.currentEnemy.rectM).do({height:[this.currentEnemy.rectM.height,0]})
                .start(100, undefined, 1);

            this.addTween().addControl(this.currentEnemy.enemy).do({height:[this.currentEnemy.enemy.height, 0]})
                .start(100, ()=>{this.currentEnemy.enemy.height = 200; 
                                this.currentEnemy.enemy.visible = false;
                                }, 1);
            this.isBullOnScreen = false;
            this.score += 20;
        }
    }

    onKeyPress(e: KeyboardEvent) {
        if (this.spineBoy.spineAnim && e.code === 'Space') {
            if(!this.isJump){
                this.isJump = true;
            this.spineBoy.hitBox.y -= this.spineBoy.hitBox.height - 50;
            this.spineBoy.spineAnim.state.setAnimation(0, 'jump', false);
            this.spineBoy.spineAnim.state.addAnimation(0, 'run', true, 0);
            this.addTween()
                .addControl(this.spineBoy.hitBox)
                .do({ y: [this.spineBoy.hitBox.y + this.spineBoy.hitBox.height - 50, this.spineBoy.hitBox.y] }, Tween.LinearBack)
                .start(1400, ()=> this.isJump = false, 1);
            }   
        }

        if (this.spineBoy.spineAnim && e.code === 'KeyQ') {
            this.isBullOnScreen = true;

            this.spineBoy.spineAnim.state.setAnimation(1, 'aim', false);
            this.spineBoy.spineAnim.state.setAnimation(2, 'shoot', false);

            this.currentBull = this.bullets[Math.floor(Math.random()*this.bullets.length)].bullet;
            this.currentBull.visible = true;

            this.addTween().addControl(this.currentBull)
                .do({x:[this.spineBoy.hitBox.x, 1000], y:[this.spineBoy.hitBox.y + 100, 250]}).start(200, ()=>{
                    this.currentBull.x = this.spineBoy.hitBox.x;
                    this.currentBull.y = 550; 
                    this.spineBoy.spineAnim.state.addEmptyAnimation(1, 1, 0); 
                    this.currentBull.visible = false}, 1);
        }
    }
}