import Button from "./Button";
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
    public isBullOnScreen: boolean;
    public isJump: boolean;
    public currentBox: PIXI.Sprite;
    public currentEnemy: Enemy;
    public currentBull: PIXI.Sprite;
    public score: number;
    public textScore: PIXI.Text;



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
        this.score = 0;
        this.createScore();
        this.button.gameov();
        this.isLife = false;
        this.isBoxOnScreen = false;
        this.isEnemyOnScreen = false;
        this.isBullOnScreen = false;
        this.isJump = false;
        this.tweens = [];

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
                    { fontFamily: 'Arial',
                     fontSize: 35,
                     fontWeight: 'bold',
                     fill: 0xFF00FF });
        this.textScore.x = 900;
        this.textScore.y = 10;
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

    start() {
        this.spineBoy.spineAnim.visible = true;
        let start = this.newGame.bind(this)
        this.spineBoy.spineAnim.state.setAnimation(0, 'portal', false);
        this.spineBoy.spineAnim.state.tracks[0].listener = {
            complete: function (trackEntry, count) {
                if ('portal' === trackEntry.animation.name) {
                    this.started = false;
                    if (this.callback) {
                        this.callback();
                    }
                }
            }, callback: start
        };

        window.app.ticker.add(() => {
            this.update();
        });
    }


    update() {
        if (this.isLife) {
            this.textScore.text = this.score.toString();

            if (this.spineBoy.health === 0) {
                this.isLife = false;
                this.spineBoy.spineAnim.state.setAnimation(0, 'death', false);
                setTimeout(()=>this.gameOver(), 2000);
            }

            for (let i = 0; i < this.tweens.length; i++) {
                this.tweens[i].update(window.app.ticker.elapsedMS);
            }
            
            this.background.tilePosition.x -= window.app.ticker.elapsedMS; //1000 * 800;
        }

        if (this.spineBoy.spineAnim) {
            this.spineBoy.spineAnim.update(window.app.ticker.elapsedMS / 1000)
        }

    }

    newGame(){
        this.spineBoy.spineAnim.state.addAnimation(0, 'run', true, 0).mixDuration = 0.2;
        this.isLife = true;
        this.newHindrance();
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

            }, Math.random() * 2000);
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
                    this.isBoxOnScreen = false;}, 1);
            this.checkDamage(this.currentBox);
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
                .start(2000, ()=>{this.currentEnemy.rectM.x = window.app.screen.width;}, 1);
        }
    }

    checkDamage(item: PIXI.Sprite){
        setInterval(()=>{
            if(this.spineBoy.spineAnim && Collision.checkCollision(this.spineBoy.hitBox, item)) {
                this.addTween().addControl(item)
                    .do({height:[item.height, 0], y:[item.y, item.y + item.width]}, Tween.Linear)
                    .start(500, ()=> {item.height = 150; item.y = window.app.screen.height / 1.45;}, 1);
                this.spineBoy.changeHealth(100);
            } else {
                this.score += 5;
            }
        }, 300);
    }

    checkHitEnemy(){
        setInterval(()=>{
            if (this.spineBoy.spineAnim && this.isBullOnScreen && Collision.checkCollision(this.currentEnemy.rectM, this.currentBull)) {
                this.addTween().addControl(this.currentEnemy.enemy).do({height:[this.currentEnemy.enemy.height, 0]})
                    .start(200, ()=>{this.currentEnemy.enemy.height = 200; 
                                    this.currentEnemy.enemy.visible = false;}, 1);
                this.isBullOnScreen = false;
                this.score += 20;
            }
        }, 100);
    }

    gameOver(){
        this.currentEnemy.enemy.visible = false;
        this.spineBoy.healthLine.visible = false;
        this.textScore.visible = false;
        this.button.finalScore.text += this.textScore.text;
        this.button.over.visible = true;
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
                .do({x:[this.spineBoy.hitBox.x, 1000], y:[550, 300]}).start(200, ()=>{
                    this.currentBull.x = this.spineBoy.hitBox.x;
                    this.currentBull.y = 550; 
                    this.spineBoy.spineAnim.state.addEmptyAnimation(1, 1, 0); 
                    this.currentBull.visible = false}, 1);
            this.checkHitEnemy();
        }
    }
}