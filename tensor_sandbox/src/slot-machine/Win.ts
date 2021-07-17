import SlotMachine from "./slot-machine";

export default class Win{
    protected parent: SlotMachine;

    constructor(parent: any){
        this.parent = parent;
    }

    createWinLines(){
        let line1 = PIXI.Sprite.from('assets/line_1.png');
        line1.x =0;
        line1.y = 350;
        line1.visible = false;

        let line2 = PIXI.Sprite.from('assets/line_2.png');
        line2.x =0;
        line2.y = 450;
        line2.visible = false;


        let line3 = PIXI.Sprite.from('assets/line_3.png');
        line3.x =0;
        line3.y = 550;
        line3.visible = false;

        let line4 = PIXI.Sprite.from('assets/line_4.png');
        line4.x = 50;
        line4.y = 350;
        line4.width = 400;
        line4.visible = false;

        let line5 = PIXI.Sprite.from('assets/line_5.png');
        line5.x = 50;
        line5.y = 310;
        line5.width = 400;
        line5.visible = false;

        this.parent.reel.reelContainer.addChild(line1, line2, line3, line4, line5);
        this.parent.reel.lines.push(line1);
        this.parent.reel.lines.push(line2);
        this.parent.reel.lines.push(line3);
        this.parent.reel.lines.push(line4);
        this.parent.reel.lines.push(line5);
    }

    checkWin(symbolsArr: PIXI.AnimatedSprite[][]){
        for (let j = 3; j < 6; j++){
            if (symbolsArr[0][j].textures === symbolsArr[1][j].textures && symbolsArr[1][j].textures === symbolsArr[2][j].textures ){
                symbolsArr[0][j].play();
                symbolsArr[1][j].play();
                symbolsArr[2][j].play();
                this.parent.reel.lines[j - 3].visible = true;
                if (symbolsArr[2][j].textures === symbolsArr[3][j].textures){
                    symbolsArr[3][j].play();
                    if (symbolsArr[3][j].textures === symbolsArr[4][j].textures){
                        symbolsArr[4][j].play();
                    }
                }
            }
        }

        if(symbolsArr[0][3].textures === symbolsArr[1][4].textures && symbolsArr[1][4].textures === symbolsArr[2][5].textures){
            symbolsArr[0][3].play();
            symbolsArr[1][4].play();
            symbolsArr[2][5].play();
            this.parent.reel.lines[3].visible = true;
            if (symbolsArr[2][5].textures === symbolsArr[3][4].textures){
                symbolsArr[3][4].play();
                if (symbolsArr[3][4].textures === symbolsArr[4][3].textures){
                    symbolsArr[4][3].play();
                }
            }
        }

        if(symbolsArr[0][5].textures === symbolsArr[1][4].textures && symbolsArr[1][4].textures === symbolsArr[2][3].textures){
            symbolsArr[0][5].play();
            symbolsArr[1][4].play();
            symbolsArr[2][3].play();
            this.parent.reel.lines[4].visible = true;
            if (symbolsArr[2][3].textures === symbolsArr[3][4].textures){
                symbolsArr[3][4].play();
                if (symbolsArr[3][4].textures === symbolsArr[4][5].textures){
                    symbolsArr[4][5].play();
                }
            }
        }
    }
}