import React, { useEffect, useState } from "react";
import "./App.css";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { abi } from "./ABI.json";
import { Spin, SpinGameInitArgs } from "spin";
import { config } from "./web3";
import { readContract } from "wagmi/actions";
import { TaskStatus } from "zkwasm-service-helper";
import { GameState } from "./types";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPosition, setTotalSteps, setGameInitialized } from './gameSlice';
import { setOnChainTotalSteps, setOnChainCurrentPosition } from './gameOnChainSlice';
import { Button, Flex } from "antd";
import { mockSubmitGame } from "./mockSubmit";
import Game from "./Game";
import { gameStatus, spin, subGameInit } from "./globals";

const GAME_CONTRACT_ADDRESS = import.meta.env.VITE_GAME_CONTRACT_ADDRESS;

/* This function is used to verify the proof on-chain */
async function verify_onchain({
    proof,
    verify_instance,
    aux,
    instances,
}: {
    proof: BigInt[];
    verify_instance: BigInt[];
    aux: BigInt[];
    instances: BigInt[];
    status: TaskStatus;
}) {
    console.log("proof", proof, verify_instance, aux, instances);
    const result = await writeContract(config, {
        abi,
        address: GAME_CONTRACT_ADDRESS,
        functionName: "submitGame",
        args: [proof, verify_instance, aux, [instances]],
    });
    const transactionReceipt = waitForTransactionReceipt(config, {
        hash: result,
    });
    return transactionReceipt;
}

/* This function is used to get the on-chain game states */
async function getOnchainGameStates() {
    const result = (await readContract(config, {
        abi,
        address: GAME_CONTRACT_ADDRESS,
        functionName: "getStates",
        args: [],
    })) as [bigint, bigint];
    return result;
}

let aelf: any;

function App() {

    const gameState = useSelector((state) => state.game);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!gameState.onChainStateLoaded || gameState.gameInitialized) {
            return;
        }
        const total_steps = gameState.total_steps;
        const current_position = gameState.current_position;

        console.log("total_steps = ", total_steps);
        console.log("current_position = ", current_position);
        // setOnChainGameStates({
        //     total_steps: total_steps.toString(),
        //     current_position: current_position.toString(),
        // });

        dispatch(setGameInitialized(true));
        console.log("initial total_steps = ", total_steps);
        console.log("initial current_position = ", current_position);
        spin.initialize_import().then(() => {
            const arg = new SpinGameInitArgs(BigInt(total_steps), BigInt(current_position));
            console.log("arg = ", arg);
            spin.initialize_game(arg);
            subGameInit.next({
                total_steps: Number(total_steps),
                current_position: Number(current_position),
            });
            gameStatus.initialized = true;
            updateDisplay();
        });
    }, [gameState]);

    // const [gameState, setGameState] = useState<GameState>({
    //     total_steps: BigInt(0),
    //     current_position: BigInt(0),
    // });
    const onChainGameStates = useSelector((state) => state.gameOnChain);

    const [moves, setMoves] = useState<bigint[]>([]);

    const onClick = (command: bigint) => () => {
        spin.step(command);
        updateDisplay();
    };

    const updateDisplay = () => {
        const newGameState = spin.getGameState();
        dispatch(setCurrentPosition(newGameState.current_position.toString()));
        dispatch(setTotalSteps(newGameState.total_steps.toString()));
        // setGameState({
        //     total_steps: newGameState.total_steps,
        //     current_position: newGameState.current_position,
        // });
        setMoves(spin.witness);
    };

    // Submit the proof to the cloud
    const submitProof = async () => {
        const proof = await spin.generateProof();

        if (!proof) {
            console.error("Proof generation failed");
            return;
        }
        // onchain verification operations
        console.log("submitting proof");
        const verificationResult = await verify_onchain(proof);

        console.log("verificationResult = ", verificationResult);

        // wait for the transaction to be broadcasted, better way is to use event listener
        await new Promise((r) => setTimeout(r, 1000));

        const gameStates = await getOnchainGameStates();
        dispatch(setOnChainTotalSteps(gameStates[0].toString()));
        dispatch(setOnChainCurrentPosition(gameStates[1].toString()));

        await spin.reset();
        // awonGameInitReady(gameStates[0], gameStates[1]);
    };


    const onConnectBtnClickHandler = async () => {
        try {
            // const rs = await bridge.instance.connect();
            // console.log('onConnectBtnClickHandler', rs);
            var wallet = await nightElfWallet.login();
            console.log('wallet', wallet);
            setIsConnected(true);
        } catch (e: any) {
            // message.error(e.message);
        }
    };

    const onDisConnectBtnClickHandler = async () => {
        // const rs = await bridge.instance.disConnect();
        await nightElfWallet.logout();
        setIsConnected(false);
        // console.log('log after execute disConnectWallet', rs);
    };

    const [isConnected, setIsConnected] = useState(false);
    const [isLocking, setIsLocking] = useState(false);

    const lock = async () => {
        setIsLocking(true);
        // await bridge.instance.lock();
        setIsLocking(false);
    };

    return (
        <div className="App">
            <Game></Game>
            {/* <div>GamePlay</div>
            <div>Number of Moves: {moves.length}</div>
            <div>
                How to Play: this game let the player increase or decrease
                the position. The position ranges from 0-10. It keeps track
                of the total steps so far and current position. When
                submitted on-chain, the progresses are updated and recorded
                on-chain{" "}
            </div>

            <div>
                Game State:{" "}
                {JSON.stringify(gameState, (_, v) =>
                    typeof v === "bigint" ? v.toString() : v
                )}
            </div>
            <div>
                OnChain Game State:{" "}
                {JSON.stringify(onChainGameStates, (_, v) =>
                    typeof v === "bigint" ? v.toString() : v
                )}
            </div>
            <Button onClick={onClick(BigInt(0))}>Decrement</Button>
            <Button onClick={onClick(BigInt(1))}>Increment</Button>
            <Button onClick={submitProof}>Submit</Button>
            <Button onClick={mockSubmitGame}>Mock Submit</Button> */}
        </div>
    );
}

export default App;
