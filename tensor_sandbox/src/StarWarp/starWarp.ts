
export default class StarWarp{
    public starTexture: PIXI.Texture;
    public starAmount: number;
    public cameraZ: number;
    public fov: number;
    public baseSpeed: number;
    public speed: number;
    public warpSpeed: number;
    public startStretch: number;
    public startBaseSize: number;
    public stars: {sprite: PIXI.Sprite,
        z: number,
        x: number,
        y: number,}[];

    constructor(){
        this.starTexture = PIXI.Texture.from("assets/star.png");
        this.starAmount = 1000;
        this.cameraZ = 0;
        this.fov = 20;
        this.baseSpeed = 0.025;
        this.speed = 0;
        this.warpSpeed = 0;
        this.startStretch = 5;
        this.startBaseSize = 0.05;
        this.stars = [];
        this.draw();
        this.createStars();
        this.move();
        window.app.stage.interactive = true;
    }

    draw(){
        const background = PIXI.Sprite.from('assets/back.png');
        window.app.stage.addChild(background);
    }

    createStars(){
        //const stars = [];
        for (let i = 0; i < this.starAmount; i++){
            const star = {
                sprite: new PIXI.Sprite(this.starTexture),
                z: 0,
                x: 0,
                y: 0,
            };
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            this.randomizeStar(star, true);
            window.app.stage.addChild(star.sprite);
            this.stars.push(star);   
        }
    }

    randomizeStar(star: any, initial: boolean){
        star.z = initial ? Math.random() * 2000 : this.cameraZ + Math.random() * 1000 + 2000;
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }

    move(){

        setInterval(() => {
            this.warpSpeed = this.warpSpeed > 0 ? 0 : 1;
        }, 5000);
        window.app.ticker.add((delta) => {
            this.speed += (this.warpSpeed - this.speed) / 20;
            this.cameraZ += delta * 10 * (this.speed + this.baseSpeed);
            for( let i = 0; i < this.starAmount; i++){
                const star = this.stars[i];
                if (star.z < this.cameraZ) this.randomizeStar(star, false);

                const z = star.z - this.cameraZ;
                star.sprite.x = star.x * (this.fov / z) * window.app.renderer.screen.width + window.app.renderer.screen.width /2;
                star.sprite.y = star.y * (this.fov / z) * window.app.renderer.screen.width + window.app.renderer.screen.height /2;
                
                const dxCenter = star.sprite.x - window.app.renderer.screen.width /2;
                const dyCenter = star.sprite.y - window.app.renderer.screen.height / 2;
                const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter*dyCenter);
                const distanceScale = Math.max(0, (2000 - z)/2000);
                star.sprite.scale.x = distanceScale * this.startBaseSize;
                star.sprite.scale.y = distanceScale * this.startBaseSize + distanceScale * this.speed * this.startStretch * distanceCenter / window.app.renderer.screen.width;
                star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
            }
        });
    }
}