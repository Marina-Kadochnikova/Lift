import "./scss/main.scss";
import * as PIXI from "pixi.js-legacy";
import Handlers from "./utils/handlers";
import Demo from "./demo/Demo";
import SlotMachine from "./slot-machine/slot-machine"
import SpineBoy from "./Shooter/SpineBoy"
import Shooter from "./Shooter/shooter";
import ShooterGame from "./Shooter/ShooterGame";
import Lift from "./lift/Lift";

initPIXI();
const handlers = new Handlers();
handlers.init();
start();

/**
 * Инициализация PIXI
 */
function start(): void {
    // const demo = new Demo();
    // demo.start();
    //  const slotM = new SlotMachine();


    const lift = new Lift();

    // const shooterGame = new ShooterGame();
}

function initPIXI(): void {
    window.PIXI = PIXI;
    // Проверим инициализацию библиотеки PIXI
    if (PIXI === undefined) {
        throw new Error('PIXI is undefined');
    }

    window.sceneWidth = screen.width || 800;
    window.sceneHeight = screen.height || 600;

    const app = new PIXI.Application({
        width: window.sceneWidth,
        height: window.sceneHeight,
        ///transparent: true,
        forceCanvas: true,
        backgroundColor: 0x00ff00,
        view: <HTMLCanvasElement>getElement("scene")
    });
    window.renderer = app.renderer;
    window.app = app;
    getElement("sceneDiv").appendChild(app.view);
}

function getElement(elementName: string): HTMLElement {
    return <HTMLElement>document.getElementById(elementName);
}

document.onready = function () {
    window.sizeHandler();
};