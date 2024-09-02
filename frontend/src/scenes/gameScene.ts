
import backgroundImage from "../assets/background.png";
import mario from "../assets/mario.png";
import submitButton from "../assets/submit.png";
import { aelf, spin, GameStateOfNumberFormat, subGameInit, subMoved, gameStatus } from "../globals";
import AElf from 'aelf-sdk';
import { mockInput } from "../mockSubmit";

const STEP_SIZE = 130.8;
const MAKE_PROOF_INVALID = false;

type ProofType = Awaited<ReturnType<typeof spin.generateProof>>;
interface SubmitGameRequest {
    proof: string[];
    verifyInstance: string[];
    aux: string[];
    targetInstance: { value: string[] }[];
}

function maybeTweakProof(req: SubmitGameRequest): SubmitGameRequest {
    if (!MAKE_PROOF_INVALID) return req;
    return {
        ...req,
        proof: req.proof.map(p => p.replace('1', '2')),
    };

}

function convert(proof: NonNullable<ProofType>): SubmitGameRequest {
    return {
        proof: proof.proof.map(p => p.toString()),
        verifyInstance: proof.verify_instance.map(p => p.toString()),
        aux: proof.aux.map(p => p.toString()),
        targetInstance: [{ value: proof.instances.map(pp => pp.toString()) }]
    };
}

export default class GameScene extends Phaser.Scene {
    initialized: boolean = false;
    submitting: boolean = false;
    submitted: boolean = false;
    backgroundImage: Phaser.GameObjects.Sprite | undefined;
    marioImage: Phaser.GameObjects.Sprite | undefined;
    marioText: Phaser.GameObjects.Text | undefined;
    submitButton: Phaser.GameObjects.Sprite | undefined;
    stepsText: Phaser.GameObjects.Text | undefined;
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image("background", backgroundImage);
        this.load.image("mario", mario);
        this.load.image("submit", submitButton);
    }

    initializeDisplay(data: GameStateOfNumberFormat) {

        this.submitButton = this.add.sprite(1280, 60, "submit");
        this.submitButton.setScale(1.5);
        this.submitButton.setInteractive({ useHandCursor: true });
        this.submitButton.on('pointerdown', this.submitGame, this);

        this.stepsText = this.add.text(40, 40, 'Steps: ' + data.total_steps,
            {
                fontSize: '48px',
                fontFamily: 'Times New Roman',
                fill: '#DEB887'
            });
        this.marioImage = this.add.sprite(58 + STEP_SIZE * data.current_position, 870, "mario");
        this.marioImage.setScale(0.7);
        this.marioText = this.add.text(
            STEP_SIZE * data.current_position,
            this.marioImage.y - 135,
            '  ' + data.current_position,
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
        this.backgroundImage.y = 540;

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
        this.marioImage!.x = 58 + STEP_SIZE * data.current_position;
        this.marioText!.x = STEP_SIZE * data.current_position;
        this.marioText!.setText('  ' + data.current_position);
        this.stepsText!.setText('Steps: ' + data.total_steps);
    }


    async submitGame() {
        if (this.submitting || this.submitted) return;
        this.submitting = true;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const producingProofText = this.add.text(centerX, centerY, 'Producing proof ...', {
            fontSize: '48px',
            fontFamily: 'Times New Roman',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        const proof = await spin.generateProof();

        if (!proof) {
            producingProofText.setText('Failed to produce proof ...');
            return;
        }
        this.sendToAelf(producingProofText, proof);

    }

    async sendToAelf(producingProofText: Phaser.GameObjects.Text, proof: NonNullable<ProofType>) {
        producingProofText.setText('Submitting game to aelf ...');

        const wallet = AElf.wallet.getWalletByPrivateKey('1111111111111111111111111111111111111111111111111111111111111111');
        const contractAddress = 'V3ejNRkkbERXkStPNBmXRtkdtuDvKPrZ1ha6hpUq9PkXCBCRY';
        const gameContract = await aelf.chain.contractAt(contractAddress, wallet);

        const txSent = await gameContract.SubmitGame(maybeTweakProof(convert(proof)));
        console.log("tx id", txSent);

        this.time.delayedCall(3000, async () => {
            try {
                await aelf.chain.getTxResult(txSent.TransactionId);
                producingProofText.setText('Submitted');
            } catch (e) {
                console.log("error", e);
                producingProofText.setText('Failed: ' + (e as { Status?: string, Error?: string })?.Error?.replace('AElf.Sdk.CSharp.AssertionException: ', '') ?? '');
            }
            this.submitted = true;
        }, [], this);
    }
}