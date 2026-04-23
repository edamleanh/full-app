// src/scenes/BootScene.js
// Loading & tạo animations từ Sprout Lands assets

// Đường dẫn tắt đến asset pack
const SL = 'assets/Sprout Lands - Sprites - Basic pack/Sprout Lands - Sprites - Basic pack';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        // ── Title Screen ───────────────────────────────────
        this.add.rectangle(0, 0, W, H, 0x1a2e0a).setOrigin(0);

        // Stars
        for (let i = 0; i < 60; i++) {
            const sx = Phaser.Math.Between(0, W);
            const sy = Phaser.Math.Between(0, H * 0.7);
            const sr = Math.random() < 0.2 ? 1 : 0.5;
            this.add.circle(sx, sy, sr, 0xffffff, Math.random() * 0.5 + 0.2);
        }

        // Logo
        this.add.text(W / 2, H / 2 - 52, '🌾', { fontSize: '20px' }).setOrigin(0.5);
        this.add.text(W / 2, H / 2 - 34, 'FARM VALLEY', {
            fontSize: '10px', color: '#f1c40f',
            fontFamily: 'Courier New', stroke: '#000', strokeThickness: 3,
            letterSpacing: 3,
        }).setOrigin(0.5);
        this.add.text(W / 2, H / 2 - 20, 'Sprout Lands Edition', {
            fontSize: '6px', color: '#95d36a', fontFamily: 'Courier New',
        }).setOrigin(0.5);

        // Loading bar
        const bw = 180, bh = 8;
        const bx = W / 2 - bw / 2, by = H / 2 + 2;
        this.add.rectangle(bx - 1, by - 1, bw + 2, bh + 2, 0x000000).setOrigin(0);
        this.add.rectangle(bx, by, bw, bh, 0x2c3e50).setOrigin(0);
        const bar = this.add.rectangle(bx, by, 0, bh, 0x95d36a).setOrigin(0);
        this._loadLabel = this.add.text(W / 2, by + 12, 'Đang tải...', {
            fontSize: '5px', color: '#888', fontFamily: 'Courier New'
        }).setOrigin(0.5, 0);

        this.load.on('progress', (v) => {
            bar.width = bw * v;
            this._loadLabel?.setText(`Đang tải... ${Math.floor(v * 100)}%`);
        });

        // ── Load Sprout Lands Tilesets ───────────────────────
        // 16×16 tiles
        this.load.spritesheet('sl_grass',   `${SL}/Tilesets/Grass.png`,        { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('sl_tilled',  `${SL}/Tilesets/Tilled_Dirt.png`,  { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('sl_water',   `${SL}/Tilesets/Water.png`,         { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('sl_fences',  `${SL}/Tilesets/Fences.png`,        { frameWidth: 16, frameHeight: 16 });

        // House (place as a whole image)
        this.load.image('sl_house',       `${SL}/Tilesets/Wooden House.png`);
        this.load.image('sl_house_roof',  `${SL}/Tilesets/Wooden_House_Roof_Tilset.png`);

        // ── Load Sprout Lands Objects ────────────────────────
        // Plants 16×16 per frame, 6 cols × 2 rows = 12 frames
        this.load.spritesheet('sl_plants',  `${SL}/Objects/Basic Plants.png`,            { frameWidth: 16, frameHeight: 16 });
        this.load.image('sl_biome',         `${SL}/Objects/Basic Grass Biom things 1.png`);
        this.load.image('sl_paths',         `${SL}/Objects/Paths.png`);
        this.load.image('sl_furniture',     `${SL}/Objects/Basic Furniture.png`);

        // ── Load Sprout Lands Characters ─────────────────────
        // Basic Charakter Spritesheet: 192×192, 48×48 per frame, 4×4 grid
        this.load.spritesheet('sl_player',   `${SL}/Characters/Basic Charakter Spritesheet.png`, { frameWidth: 48, frameHeight: 48 });
        // Actions: 96×576, 48×48 per frame, 2×12 grid
        this.load.spritesheet('sl_actions',  `${SL}/Characters/Basic Charakter Actions.png`,     { frameWidth: 48, frameHeight: 48 });
        // Chicken NPC (fun bonus)
        this.load.spritesheet('sl_chicken',  `${SL}/Characters/Free Chicken Sprites.png`,        { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // ── Define biome object frames manually ───────────────
        // Basic Grass Biom things 1.png = 144×80 pixels
        // Objects arranged left-to-right: big trees, bushes, small items
        // Visually estimated pixel positions:
        const biome = this.textures.get('sl_biome');
        biome.add('tree_big_1',   0,  0,  0,  32, 64);  // Round green tree (left)
        biome.add('tree_big_2',   0, 32,  0,  32, 64);  // Round dark tree (2nd)
        biome.add('tree_big_3',   0, 64,  0,  32, 64);  // Orange/autumn tree (3rd)
        biome.add('tree_big_4',   0, 96,  0,  32, 64);  // 4th tree type (right)
        biome.add('bush_1',       0,  0, 48,  16, 16);  // Small bush
        biome.add('bush_2',       0, 16, 48,  16, 16);  // Darker bush
        biome.add('flower_patch', 0, 32, 48,  16, 16);  // Flower cluster
        biome.add('mushroom',     0, 48, 64,  16, 16);  // Mushroom
        biome.add('rock',         0, 64, 64,  16, 16);  // Rock
        biome.add('log',          0, 80, 48,  16, 16);  // Log stump

        // ── Define paths frames ────────────────────────────────
        // Paths.png = 64×64, 16×16 tiles → 4×4 = 16 frames of path stones
        // Frame 0 = left end, frame 5 = center, etc.
        // We'll load it as spritesheet separately for tiling

        // ── Create Player Animations ──────────────────────────
        // Basic Charakter Spritesheet: 192×192, 48×48, 4 cols × 4 rows
        // Row 0 = Walk Down (frames 0-3)
        // Row 1 = Walk Left (frames 4-7)
        // Row 2 = Walk Right (frames 8-11)
        // Row 3 = Walk Up (frames 12-15)
        const PAM = this.anims;

        PAM.create({ key: 'walk_down',  frames: PAM.generateFrameNumbers('sl_player', { start: 0,  end: 3  }), frameRate: 8, repeat: -1 });
        PAM.create({ key: 'walk_left',  frames: PAM.generateFrameNumbers('sl_player', { start: 4,  end: 7  }), frameRate: 8, repeat: -1 });
        PAM.create({ key: 'walk_right', frames: PAM.generateFrameNumbers('sl_player', { start: 8,  end: 11 }), frameRate: 8, repeat: -1 });
        PAM.create({ key: 'walk_up',    frames: PAM.generateFrameNumbers('sl_player', { start: 12, end: 15 }), frameRate: 8, repeat: -1 });
        PAM.create({ key: 'idle_down',  frames: [{ key: 'sl_player', frame: 0  }], frameRate: 1 });
        PAM.create({ key: 'idle_left',  frames: [{ key: 'sl_player', frame: 4  }], frameRate: 1 });
        PAM.create({ key: 'idle_right', frames: [{ key: 'sl_player', frame: 8  }], frameRate: 1 });
        PAM.create({ key: 'idle_up',    frames: [{ key: 'sl_player', frame: 12 }], frameRate: 1 });

        // Action anims from Basic Charakter Actions.png (96×576, 48×48, 2×12)
        // Row pairs: (0-1)=tool swing D, (2-3)=L, (4-5)=R, (6-7)=U, + more
        PAM.create({ key: 'action_down',  frames: PAM.generateFrameNumbers('sl_actions', { start: 0,  end: 1 }), frameRate: 6, repeat: 0 });
        PAM.create({ key: 'action_left',  frames: PAM.generateFrameNumbers('sl_actions', { start: 2,  end: 3 }), frameRate: 6, repeat: 0 });
        PAM.create({ key: 'action_right', frames: PAM.generateFrameNumbers('sl_actions', { start: 4,  end: 5 }), frameRate: 6, repeat: 0 });
        PAM.create({ key: 'action_up',    frames: PAM.generateFrameNumbers('sl_actions', { start: 6,  end: 7 }), frameRate: 6, repeat: 0 });

        // Chicken animation (64×32, 16×16 per frame, 4 cols × 2 rows = 8 frames)
        // Row 0: walk right (frames 0-3), Row 1: walk left (frames 4-7)
        PAM.create({ key: 'chicken_walk', frames: PAM.generateFrameNumbers('sl_chicken', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
        PAM.create({ key: 'chicken_walk_l', frames: PAM.generateFrameNumbers('sl_chicken', { start: 4, end: 7 }), frameRate: 8, repeat: -1 });

        // ── Transition → GameScene ────────────────────────────
        this._loadLabel?.setText('Vào game...');
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}
