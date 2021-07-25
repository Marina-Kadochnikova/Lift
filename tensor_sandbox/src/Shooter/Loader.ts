import { Spine } from "pixi-spine";

export default class Loader{
    public spineboy: Spine;
    public enemy: PIXI.AnimatedSprite;

    constructor(){
        this.loadall();
    }

    loadall(){
        window.app.loader
        .add('spineCharacter', 'assets/spineboy-pro.json')
        .add('assets/fighter.json')
        .load((loader, resources) => {
            //Player
            const spine = new Spine(resources.spineCharacter.spineData);
            spine.x = window.app.screen.width / 3;
            spine.y = window.app.screen.height / 1.15;
            spine.scale.set(0.5);
            spine.state.timeScale = 0.5;
            this.spineboy = spine;
            
            //Enemy
            const frames = [];
            for (let i = 0; i < 30; i++) {
                const val = i < 10 ? `0${i}` : i;
                frames.push(PIXI.Texture.from(`rollSequence00${val}.png`));
            }
            const anim = new PIXI.AnimatedSprite(frames);
            anim.anchor.set(0.5);
            anim.animationSpeed = 0.5;
            anim.rotation = Math.PI / -2;
            anim.play();
            this.enemy = anim;
        }
    } 
}