import { useEffect } from "react";
import { callViewMethod as callViewMethodOfUtils } from '@aelf-web-login/utils';
import { GameState } from "./types";
import { useDispatch } from 'react-redux';
import { setCurrentPosition, setTotalSteps, setOnChainStateLoaded } from './gameSlice';
import { setOnChainCurrentPosition, setOnChainTotalSteps } from './gameOnChainSlice';


async function getOnchainGameStates(): Promise<GameState> {
    const res: any = await callViewMethodOfUtils({
        endPoint: 'http://localhost:8000',
        contractAddress: 'V3ejNRkkbERXkStPNBmXRtkdtuDvKPrZ1ha6hpUq9PkXCBCRY',
        methodName: 'GetGameState',
        args: ''
    });
    if (!!res) {
        return {
            total_steps: (res.totalSteps ?? 0).toString(),
            current_position: (res.currentPosition ?? 0).toString(),
        };
    }
    return {
        total_steps: '0',
        current_position: '0'
    };
}

const OnChain = () => {


    const dispatch = useDispatch();

    useEffect(() => {
        getOnchainGameStates().then(async (result): Promise<void> => {
            const total_steps = result.total_steps;
            const current_position = result.current_position;
            dispatch(setOnChainTotalSteps(total_steps));
            dispatch(setOnChainCurrentPosition(current_position));
            dispatch(setTotalSteps(total_steps));
            dispatch(setCurrentPosition(current_position));
            dispatch(setOnChainStateLoaded(true));
        });
    }, []);
    return <></>;

};
export default OnChain;