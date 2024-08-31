import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './scenes/gameScene';


const Game = () => {
  useEffect(() => {
    const gameScene = new GameScene();
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 1024,
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

