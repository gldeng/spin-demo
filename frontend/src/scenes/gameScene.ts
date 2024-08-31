
import backgroundImage from "../assets/background.png";
import mario from "../assets/mario.png";
import { spin, GameStateOfNumberFormat, subGameInit, subMoved, gameStatus } from "../globals";

export default class GameScene extends Phaser.Scene {
    initialized: boolean = false;
    backgroundImage: Phaser.GameObjects.Sprite | undefined;
    marioImage: Phaser.GameObjects.Sprite | undefined;
    marioText: Phaser.GameObjects.Text | undefined;
    stepsText: Phaser.GameObjects.Text | undefined;
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image("background", backgroundImage);
        this.load.image("mario", mario);
    }

    initializeDisplay(data: GameStateOfNumberFormat) {

        this.stepsText = this.add.text(40, 40, 'Steps: ' + data.total_steps,
            {
                fontSize: '48px',
                fontFamily: 'Times New Roman',
                fill: '#DEB887'
            });
        this.marioImage = this.add.sprite(58 + 93 * data.current_position, 798, "mario");
        this.marioText = this.add.text(
            93 * data.current_position,
            this.marioImage.y - 170,
            '' + data.current_position,
            {
                fontSize: '48px',
                fontFamily: 'Times New Roman',
                fill: '#ffffff'
            }
        );
        this.initialized = true;
    }

    create() {
        this.backgroundImage = this.add.sprite(0, 0, "background");
        this.backgroundImage.x = 512;
        this.backgroundImage.y = 512;

        var that = this;
        console.log("creating game")
        subGameInit.subscribe((data) => {
            console.log('subGameInit in game', data);
            that.initializeDisplay(data);
        });

        if (gameStatus.initialized) {
            const gameState = spin.getGameState()
            that.initializeDisplay({
                total_steps: Number(gameState.total_steps.toString()),
                current_position: Number(gameState.current_position.toString()),
            });
        } else {
            subMoved.subscribe((_) => {
                const gameState = spin.getGameState()
                that.updateDisplay({
                    total_steps: Number(gameState.total_steps.toString()),
                    current_position: Number(gameState.current_position.toString()),
                });
            });
        }

        this.input.keyboard?.addListener('keydown-RIGHT', () => {
            if (!this.initialized) return;
            const command = BigInt(1);
            spin.step(command);
            subMoved.next(1);
        }, this);

        this.input.keyboard?.addListener('keydown-LEFT', () => {
            if (!this.initialized) return;
            const command = BigInt(0);
            spin.step(command);
            subMoved.next(0);
        }, this);
    }

    updateDisplay(data: GameStateOfNumberFormat) {
        this.marioImage!.x = 58 + 93 * data.current_position;
        this.marioText!.x = 93 * data.current_position;
        this.marioText!.setText('' + data.current_position);
        this.stepsText!.setText('Steps: ' + data.total_steps);
    }


}