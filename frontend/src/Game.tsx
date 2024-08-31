import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './scenes/gameScene';

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

const Game = () => {

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

  useEffect(() => {
    const gameScene = new GameScene();
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1440,
      height: 1080,
      parent: 'game-container',
      backgroundColor: '#5f6e7a',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 200 }
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
    };

    const game = new Phaser.Game(config);
    game.scene.add('GameScene', gameScene);
    game.scene.start('GameScene');

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
};

export default Game;

