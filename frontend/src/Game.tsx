import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { callViewMethod as callViewMethodOfUtils } from '@aelf-web-login/utils';
import { Spin, SpinGameInitArgs } from "spin";


const GAME_CONTRACT_ADDRESS = import.meta.env.VITE_GAME_CONTRACT_ADDRESS;
const ZK_USER_ADDRESS = import.meta.env.VITE_ZK_CLOUD_USER_ADDRESS;
const ZK_USER_PRIVATE_KEY = import.meta.env.VITE_ZK_CLOUD_USER_PRIVATE_KEY;
const ZK_IMAGE_MD5 = import.meta.env.VITE_ZK_CLOUD_IMAGE_MD5;
const ZK_CLOUD_RPC_URL = import.meta.env.VITE_ZK_CLOUD_URL;

interface GameState {
    total_steps: bigint;
    current_position: bigint;
}

async function getOnchainGameStates(): Promise<GameState> {
    const res: any = await callViewMethodOfUtils({
        endPoint: 'http://localhost:8000',
        contractAddress: 'V3ejNRkkbERXkStPNBmXRtkdtuDvKPrZ1ha6hpUq9PkXCBCRY',
        methodName: 'GetGameState',
        args: ''
    });
    if (!!res) {
        return {
            total_steps: BigInt(res.total_steps ?? 0),
            current_position: BigInt(res.current_position ?? 0),
        };
    }
    return {
        total_steps: BigInt(0),
        current_position: BigInt(0)
    };
}

let spin:Spin;

const Game = () => {
    // const { callViewMethod, getAccountByChainId, walletInfo, isConnected } = useConnectWallet();
    const [gameState, setGameState] = useState<GameState>({
        total_steps: BigInt(0),
        current_position: BigInt(0),
    });
    const [onChainGameStates, setOnChainGameStates] = useState<GameState>({
        total_steps: BigInt(0),
        current_position: BigInt(0),
    });


    const updateDisplay = () => {
        const newGameState = spin.getGameState();
        setGameState({
            total_steps: newGameState.total_steps,
            current_position: newGameState.current_position,
        });
        setMoves(spin.witness);
    };

    useEffect(() => {
        getOnchainGameStates().then(async (result): Promise<any> => {
            const total_steps = result.total_steps;
            const current_position = result.current_position;

            console.log("total_steps = ", total_steps);
            console.log("current_position = ", current_position);
            setOnChainGameStates({
                total_steps,
                current_position,
            });

            spin = new Spin({
                cloudCredentials: {
                    CLOUD_RPC_URL: ZK_CLOUD_RPC_URL,
                    USER_ADDRESS: ZK_USER_ADDRESS,
                    USER_PRIVATE_KEY: ZK_USER_PRIVATE_KEY,
                    IMAGE_HASH: ZK_IMAGE_MD5,
                },
            });
            console.log("spin = ", spin);
            spin.initialize_import().then(() => {
                const arg = new SpinGameInitArgs(total_steps, current_position);
                console.log("arg = ", arg);
                spin.initialize_game(arg);
                updateDisplay();
            });
        });
    }, []);

    const [moves, setMoves] = useState<bigint[]>([]);

    const onClick = (command: bigint) => () => {
        spin.step(command);
        updateDisplay();
    };
    return (
        <div>
            {/* <Button onClick={onGetBalanceHandler}>GetGameState</Button> */}
            {/* <div>
                <h4>Result</h4>
                <pre className="result">{JSON.stringify(result, null, '  ')}</pre>
            </div> */}
            <div>GamePlay</div>
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
        </div>
    );

};
export default Game;