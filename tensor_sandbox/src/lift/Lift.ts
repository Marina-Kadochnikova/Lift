import Cabin from "./Cabin";
import Controller from "./Controller";
import Button from "./Button";

export default class Lift{
    public cabin: Cabin;
    public buttons: Button[];
    public controller: Controller;
    public floorsNumber = 5;

    constructor(){
        this.cabin = new Cabin(this);
        this.buttons = this.createButton();
        this.controller = new Controller(this);
    }

    createButton(){
        let result: Button[] = [];
        for(let i = 1; i < this.floorsNumber + 1; i++){
            result.push(new Button(this, i));
        }
        return result;
    }
}