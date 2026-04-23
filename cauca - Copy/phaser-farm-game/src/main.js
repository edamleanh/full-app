// src/main.js
// Entry point – khởi tạo Phaser với cấu hình pixel-art bắt buộc

import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene   from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,

    // ── Pixel Art Resolution ──────────────────────────────
    // Thiết kế ở 480×270 rồi scale 2× → hiển thị 960×540
    // Character 48×48 ở zoom 2 = 96×96 trên màn hình (vừa đẹp)
    width:  480,
    height: 270,
    zoom:   2,

    // ── Pixel Art Rendering – BẮT BUỘC ───────────────────
    pixelArt: true,
    render: {
        antialias:   false,
        pixelArt:    true,
        roundPixels: true,
    },

    backgroundColor: '#286025',

    parent: 'game-container',

    scale: {
        mode:            Phaser.Scale.FIT,
        autoCenter:      Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug:   false,
        }
    },

    scene: [BootScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);

// Dev helpers
if (import.meta.env.DEV) {
    window.__game = game;
    (async () => {
        window.__state = (await import('./utils/StateManager.js')).stateManager;
        window.__save  = (await import('./utils/SaveManager.js')).SaveManager;
        console.log(`
🌾 Farm Valley – Dev Mode
  window.__game  → Phaser game instance
  window.__state → StateManager
  window.__save  → SaveManager
`);
    })();
}
