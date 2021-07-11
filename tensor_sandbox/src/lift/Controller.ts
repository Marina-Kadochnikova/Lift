import Button from "./Button";
import Lift from "./Lift";

export default class Controller{
    protected parent: Lift;
    public queueUp: Button[];
    public queueDown: Button[];
    public queu: Button[];
    private currentFloor: Button;
    private firstFloor: Button;
    private task: Button;
    private onNeedFloor: boolean;
    
    constructor(parent: any){
        this.parent = parent;
        this.currentFloor = this.parent.buttons[0];
        this.firstFloor = this.parent.buttons[0];
        this.queueUp = [];
        this.queueDown = [];
        this.onNeedFloor = false;
        this.task = this.parent.buttons[0];
        this.queu = [];
        this.start();
    }

    buttonDown(button: Button){
        if (this.currentFloor.floor < button.floor && this.currentFloor.floor === this.firstFloor.floor){
            this.queueUp.splice(this.getPosition(this.queueUp, button), 0, button);
        } else if (this.currentFloor.floor < button.floor && this.currentFloor.floor !== this.firstFloor.floor){
            this.queueUp.push(this.firstFloor);
            this.queueUp.push(button);
        }
         else{
            this.queueDown.splice(this.getPosition(this.queueDown, button), 0, button);
        }
    }

    getPosition(queue: Button[], button: Button){
        for (let i = 0; i < queue.length; i++){

            if (queue[i].floor < button.floor){ 
                return i;
            }
        }
        return queue.length;
    }

    public currentQueue(): Button[]{
        if (this.queueUp.length !== 0){
            return this.queueUp;
        } else if (this.queueDown.length !== 0){
            return this.queueDown;
        } else{
            return this.queueDown; 
        }
    }

    start() {
        window.app.ticker.add((dt) => {
            if (this.currentQueue().length !==0 && !this.onNeedFloor ) {
                this.task = this.currentQueue()[0];
                this.update(dt);
                this.stop();
            }
            
            if (this.currentQueue.length === 0 && this.queueUp.length === 0 && this.queueDown.length ===0 && this.currentFloor !== this.firstFloor){
                this.currentQueue().push(this.firstFloor);
            }
        });
    }

    stop(){
        if (Math.round(this.parent.cabin.cabin.y) === this.task.button.y) {    
            this.onNeedFloor = true;
            this.currentFloor = this.task;
            this.task.button.tint = 0xFFD700;
            setTimeout(()=> {this.onNeedFloor = false; }, 1000);
            this.currentQueue().shift();
        }
    }

    update(dt: any) {
        if (this.task.floor > this.currentFloor.floor){
            this.parent.cabin.cabin.y -= dt;
        } 

        if (this.task.floor < this.currentFloor.floor){
            this.parent.cabin.cabin.y += dt;
        }
    }
}