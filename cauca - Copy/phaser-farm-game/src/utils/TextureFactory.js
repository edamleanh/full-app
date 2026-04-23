// src/utils/TextureFactory.js
// Tạo tất cả sprites bằng Phaser Graphics API (không cần file ảnh ngoài)
// Mỗi sprite là 16×16 pixel – chuẩn pixel art

export class TextureFactory {
    /**
     * Tạo toàn bộ textures cần thiết cho game.
     * Gọi trong BootScene.preload() hoặc create()
     */
    static createAll(scene) {
        TextureFactory.createPlayer(scene);
        TextureFactory.createCrops(scene);
        TextureFactory.createTiles(scene);
        TextureFactory.createNPC(scene);
        TextureFactory.createFishingBobber(scene);
        TextureFactory.createUI(scene);
        console.log('[TextureFactory] All textures created ✓');
    }

    // ─────────────────────────────────────────────────────
    //  PLAYER – spritesheet 16×16, 8 frames
    //  Frames: down0,down1, up0,up1, left0,left1, right0,right1
    // ─────────────────────────────────────────────────────
    static createPlayer(scene) {
        if (scene.textures.exists('player')) return;

        const W = 16, H = 16;
        const COLS = 4; // frames per direction (2 walk + 2 idle mirror)
        const ROWS = 4; // directions: down, up, left, right
        const canvas = document.createElement('canvas');
        canvas.width  = W * COLS;
        canvas.height = H * ROWS;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Palette
        const SKIN   = '#f5cba7';
        const SHIRT  = '#2980b9';
        const PANTS  = '#1a5276';
        const HAT    = '#e74c3c';
        const SHOE   = '#2c2c2c';
        const HAIR   = '#6e2f0a';
        const SHADE  = '#c39b78';

        // Helper – fill a pixel (scaled to W×H space)
        const px = (ctx, x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        };

        // Draw one player frame at offset (ox, oy), facing direction, leg phase
        const drawFrame = (ox, oy, dir, phase) => {
            // Clear
            ctx.clearRect(ox, oy, W, H);

            // Hat
            px(ctx, ox+5, oy+0, HAT); px(ctx, ox+6, oy+0, HAT); px(ctx, ox+7, oy+0, HAT); px(ctx, ox+8, oy+0, HAT); px(ctx, ox+9, oy+0, HAT);
            px(ctx, ox+4, oy+1, HAT); px(ctx, ox+5, oy+1, HAT); px(ctx, ox+6, oy+1, HAT); px(ctx, ox+7, oy+1, HAT); px(ctx, ox+8, oy+1, HAT); px(ctx, ox+9, oy+1, HAT); px(ctx, ox+10, oy+1, HAT);

            // Head (face)
            for (let hx = 5; hx <= 10; hx++)
                for (let hy = 2; hy <= 5; hy++)
                    px(ctx, ox+hx, oy+hy, SKIN);
            // Hair sides
            px(ctx, ox+4, oy+2, HAIR); px(ctx, ox+4, oy+3, HAIR);
            px(ctx, ox+11, oy+2, HAIR); px(ctx, ox+11, oy+3, HAIR);

            // Eyes (based on direction)
            if (dir === 'down') {
                px(ctx, ox+6, oy+3, '#2c2c2c'); px(ctx, ox+9, oy+3, '#2c2c2c');
                px(ctx, ox+7, oy+4, '#c0392b'); // mouth
            } else if (dir === 'up') {
                px(ctx, ox+6, oy+4, HAIR); px(ctx, ox+9, oy+4, HAIR); // hair back
            } else if (dir === 'left') {
                px(ctx, ox+5, oy+3, '#2c2c2c'); // single eye
                px(ctx, ox+5, oy+4, '#c0392b'); // mouth left
            } else { // right
                px(ctx, ox+10, oy+3, '#2c2c2c');
                px(ctx, ox+10, oy+4, '#c0392b');
            }

            // Shade on face
            px(ctx, ox+5, oy+2, SHADE); px(ctx, ox+10, oy+5, SHADE);

            // Body / shirt
            for (let bx = 5; bx <= 10; bx++)
                for (let by = 6; by <= 9; by++)
                    px(ctx, ox+bx, oy+by, SHIRT);
            // Collar
            px(ctx, ox+7, oy+6, '#fff'); px(ctx, ox+8, oy+6, '#fff');

            // Arms
            const armY1 = 6, armY2 = 8;
            if (phase === 0) {
                // left arm forward
                px(ctx, ox+3, oy+armY1, SHIRT); px(ctx, ox+3, oy+7, SHIRT); px(ctx, ox+3, oy+armY2, SKIN);
                px(ctx, ox+11, oy+armY1, SHIRT); px(ctx, ox+11, oy+7, SHIRT); px(ctx, ox+11, oy+armY2, SKIN);
            } else {
                // arms swinging
                px(ctx, ox+3, oy+7, SHIRT); px(ctx, ox+3, oy+8, SHIRT); px(ctx, ox+3, oy+9, SKIN);
                px(ctx, ox+12, oy+6, SHIRT); px(ctx, ox+12, oy+7, SHIRT); px(ctx, ox+12, oy+8, SKIN);
            }

            // Pants
            for (let bx = 5; bx <= 10; bx++)
                for (let by = 10; by <= 12; by++)
                    px(ctx, ox+bx, oy+by, PANTS);

            // Legs (walking phase)
            if (phase === 0) {
                // right leg forward
                px(ctx, ox+8, oy+13, PANTS); px(ctx, ox+8, oy+14, SHOE); px(ctx, ox+8, oy+15, SHOE);
                px(ctx, ox+6, oy+13, PANTS); px(ctx, ox+6, oy+14, SHOE); px(ctx, ox+5, oy+15, SHOE);
            } else {
                px(ctx, ox+6, oy+13, PANTS); px(ctx, ox+6, oy+14, SHOE); px(ctx, ox+6, oy+15, SHOE);
                px(ctx, ox+9, oy+13, PANTS); px(ctx, ox+9, oy+14, SHOE); px(ctx, ox+10, oy+15, SHOE);
            }
        };

        const dirs = ['down', 'up', 'left', 'right'];
        dirs.forEach((dir, row) => {
            drawFrame(0,      row * H, dir, 0); // frame 0 – idle/walk
            drawFrame(W,      row * H, dir, 1); // frame 1 – walk
            drawFrame(W * 2,  row * H, dir, 0); // frame 2 – walk (mirror of 0)
            drawFrame(W * 3,  row * H, dir, 1); // frame 3 – walk (mirror of 1)
        });

        scene.textures.addCanvas('player', canvas);

        // Define walk animations
        const anims = scene.anims;
        const makeAnim = (key, row, frames, rate) => {
            if (anims.exists(key)) return;
            anims.create({
                key,
                frames: frames.map(f => ({ key: 'player', frame: row * 4 + f })),
                frameRate: rate,
                repeat: -1,
            });
        };

        // Create spritesheet frame data manually
        scene.textures.get('player').add('__BASE', 0, 0, 0, W * COLS, H * ROWS);
        // Add individual frames
        let fi = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                scene.textures.get('player').add(fi, 0, c * W, r * H, W, H);
                fi++;
            }
        }

        makeAnim('walk_down',  0, [0, 1, 2, 3], 8);
        makeAnim('walk_up',    1, [0, 1, 2, 3], 8);
        makeAnim('walk_left',  2, [0, 1, 2, 3], 8);
        makeAnim('walk_right', 3, [0, 1, 2, 3], 8);
        makeAnim('idle_down',  0, [0], 1);
        makeAnim('idle_up',    1, [0], 1);
        makeAnim('idle_left',  2, [0], 1);
        makeAnim('idle_right', 3, [0], 1);
    }

    // ─────────────────────────────────────────────────────
    //  CROPS – spritesheet 16×16, 5 stages per crop
    //  Crops: radish(0), carrot(1)
    //  Stages: seed, sprout, mid, tall, ready
    // ─────────────────────────────────────────────────────
    static createCrops(scene) {
        if (scene.textures.exists('crops')) return;

        const W = 16, H = 16;
        const STAGES = 5;
        const CROPS  = 2;
        const canvas = document.createElement('canvas');
        canvas.width  = W * STAGES;
        canvas.height = H * CROPS;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const px = (x, y, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, 1, 1); };
        const soil = '#6B4226';
        const soilW = '#4a2810'; // tưới = tối hơn

        // Draw soil base for a crop stage
        const drawSoil = (ox, oy) => {
            for (let x = 3; x <= 12; x++) {
                px(ox+x, oy+14, soil);
                px(ox+x, oy+15, '#5a3520');
            }
        };

        // radish stages (row 0)
        const drawRadish = (ox, oy, stage) => {
            drawSoil(ox, oy);
            if (stage === 0) { // seed
                px(ox+7, oy+13, '#c0392b'); px(ox+8, oy+13, '#c0392b');
                px(ox+7, oy+12, '#7dcea0');
            } else if (stage === 1) { // sprout
                px(ox+8, oy+10, '#27ae60'); px(ox+7, oy+11, '#2ecc71'); px(ox+8, oy+12, '#27ae60');
                px(ox+8, oy+13, '#c0392b');
            } else if (stage === 2) { // mid
                for (let y = 8; y <= 12; y++) px(ox+8, oy+y, '#2ecc71');
                px(ox+6, oy+9, '#27ae60'); px(ox+10, oy+9, '#27ae60');
                px(ox+7, oy+13, '#e74c3c'); px(ox+8, oy+13, '#c0392b'); px(ox+9, oy+13, '#e74c3c');
            } else if (stage === 3) { // tall
                for (let y = 5; y <= 12; y++) px(ox+8, oy+y, '#2ecc71');
                px(ox+5, oy+7, '#27ae60'); px(ox+11, oy+7, '#27ae60');
                px(ox+6, oy+9, '#27ae60'); px(ox+10, oy+9, '#27ae60');
                px(ox+7, oy+13, '#e74c3c'); px(ox+8, oy+13, '#c0392b'); px(ox+9, oy+13, '#e74c3c');
                px(ox+6, oy+13, '#c0392b'); px(ox+10, oy+13, '#c0392b');
            } else { // ready (stage 4)
                for (let y = 4; y <= 11; y++) px(ox+8, oy+y, '#2ecc71');
                px(ox+5, oy+6, '#27ae60'); px(ox+11, oy+6, '#27ae60');
                px(ox+4, oy+8, '#27ae60'); px(ox+12, oy+8, '#27ae60');
                // Big red radish
                for (let rx = 6; rx <= 10; rx++)
                    for (let ry = 12; ry <= 14; ry++)
                        px(ox+rx, oy+ry, '#e74c3c');
                px(ox+7, oy+11, '#c0392b'); px(ox+9, oy+11, '#c0392b');
                // White gleam
                px(ox+6, oy+12, '#ff9999');
                px(ox+7, oy+15, '#fff'); px(ox+8, oy+15, '#d5dbdb'); // roots
            }
        };

        // carrot stages (row 1)
        const drawCarrot = (ox, oy, stage) => {
            drawSoil(ox, oy);
            if (stage === 0) { // seed
                px(ox+7, oy+13, '#e67e22'); px(ox+8, oy+13, '#e67e22');
                px(ox+7, oy+12, '#2ecc71');
            } else if (stage === 1) {
                px(ox+8, oy+11, '#2ecc71'); px(ox+7, oy+12, '#27ae60'); px(ox+8, oy+13, '#e67e22');
            } else if (stage === 2) {
                for (let y = 9; y <= 12; y++) px(ox+8, oy+y, '#27ae60');
                px(ox+6, oy+10, '#2ecc71'); px(ox+10, oy+10, '#2ecc71');
                px(ox+8, oy+13, '#e67e22'); px(ox+7, oy+13, '#d35400');
            } else if (stage === 3) {
                for (let y = 6; y <= 12; y++) px(ox+8, oy+y, '#27ae60');
                px(ox+5, oy+8, '#2ecc71'); px(ox+11, oy+8, '#2ecc71');
                px(ox+6, oy+10, '#2ecc71'); px(ox+10, oy+10, '#2ecc71');
                for (let rx = 7; rx <= 9; rx++) px(ox+rx, oy+13, '#e67e22');
                px(ox+8, oy+14, '#d35400');
            } else { // ready
                for (let y = 4; y <= 11; y++) px(ox+8, oy+y, '#2ecc71');
                px(ox+4, oy+7, '#27ae60'); px(ox+12, oy+7, '#27ae60');
                px(ox+5, oy+9, '#2ecc71'); px(ox+11, oy+9, '#2ecc71');
                // Big orange carrot
                for (let rx = 6; rx <= 10; rx++) px(ox+rx, oy+12, '#e67e22');
                for (let rx = 7; rx <= 9; rx++) px(ox+rx, oy+13, '#e67e22');
                px(ox+8, oy+14, '#e67e22');
                px(ox+8, oy+15, '#d35400');
                px(ox+6, oy+12, '#f0b27a'); // gleam
            }
        };

        for (let s = 0; s < STAGES; s++) {
            drawRadish(s * W, 0,      s);
            drawCarrot(s * W, H, s);
        }

        scene.textures.addCanvas('crops', canvas);

        // Add frames
        let fi = 0;
        for (let r = 0; r < CROPS; r++) {
            for (let c = 0; c < STAGES; c++) {
                scene.textures.get('crops').add(fi, 0, c * W, r * H, W, H);
                fi++;
            }
        }
    }

    // ─────────────────────────────────────────────────────
    //  TILES – 16×16 tileset
    //  tile 0: grass, tile 1: tilled, tile 2: watered, tile 3: path
    // ─────────────────────────────────────────────────────
    static createTiles(scene) {
        if (scene.textures.exists('tiles')) return;

        const W = 16, H = 16;
        const COUNT = 5;
        const canvas = document.createElement('canvas');
        canvas.width  = W * COUNT;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const px = (x, y, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, 1, 1); };

        // Tile 0: Grass
        const drawGrass = (ox) => {
            ctx.fillStyle = '#4a7c3f';
            ctx.fillRect(ox, 0, W, H);
            // grass details
            const details = ['#5a9c4f','#3d6835','#6ab554'];
            for (let i = 0; i < 8; i++) {
                const gx = ox + (i * 3 + 2) % 14;
                const gy = (i * 5 + 1) % 12;
                ctx.fillStyle = details[i % 3];
                ctx.fillRect(gx, gy, 1, 2);
            }
        };

        // Tile 1: Tilled
        const drawTilled = (ox) => {
            ctx.fillStyle = '#8B5E3C';
            ctx.fillRect(ox, 0, W, H);
            // furrow lines
            ctx.fillStyle = '#6B4226';
            for (let y = 2; y < H; y += 4) {
                ctx.fillRect(ox, y, W, 1);
            }
            ctx.fillStyle = '#a07048';
            for (let x = 0; x < W; x += 6) {
                px(ox+x, 0, '#a07048'); px(ox+x, 4, '#a07048');
            }
        };

        // Tile 2: Watered
        const drawWatered = (ox) => {
            ctx.fillStyle = '#4a3018';
            ctx.fillRect(ox, 0, W, H);
            ctx.fillStyle = '#5a3825';
            for (let y = 2; y < H; y += 4) ctx.fillRect(ox, y, W, 1);
            // moisture sparkles
            ctx.fillStyle = '#7fb3e8aa';
            for (let i = 0; i < 5; i++) {
                const sx = ox + (i * 4 + 1) % 14;
                const sy = (i * 3 + 2) % 13;
                px(sx, sy, '#85c1e9');
            }
        };

        // Tile 3: Path (dirt)
        const drawPath = (ox) => {
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(ox, 0, W, H);
            ctx.fillStyle = '#7d6545';
            for (let i = 0; i < 6; i++) {
                ctx.fillRect(ox + i*3, i%2 === 0 ? 2 : 6, 2, 1);
            }
        };

        // Tile 4: Water (pond surface)
        const drawWater = (ox) => {
            ctx.fillStyle = '#2980b9';
            ctx.fillRect(ox, 0, W, H);
            ctx.fillStyle = '#3498db';
            for (let y = 2; y < H; y += 4) ctx.fillRect(ox, y, W, 1);
            ctx.fillStyle = '#85c1e9';
            px(ox+3, 3, '#85c1e9'); px(ox+10, 7, '#85c1e9'); px(ox+5, 12, '#85c1e9');
        };

        drawGrass(0);
        drawTilled(W);
        drawWatered(W*2);
        drawPath(W*3);
        drawWater(W*4);

        scene.textures.addCanvas('tiles', canvas);
        for (let i = 0; i < COUNT; i++) {
            scene.textures.get('tiles').add(i, 0, i * W, 0, W, H);
        }
    }

    // ─────────────────────────────────────────────────────
    //  NPC – shop keeper 16×16
    // ─────────────────────────────────────────────────────
    static createNPC(scene) {
        if (scene.textures.exists('npc')) return;

        const W = 16, H = 16;
        const canvas = document.createElement('canvas');
        canvas.width = W * 2; // 2 frames: idle0, idle1
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };

        const drawNPC = (ox) => {
            // Hat (straw)
            ctx.fillStyle = '#d4a017';
            ctx.fillRect(ox+4, 0, 8, 1);
            ctx.fillRect(ox+5, 1, 6, 1);
            // Head
            ctx.fillStyle = '#f5cba7';
            ctx.fillRect(ox+5, 2, 6, 4);
            px(ox+6, 3, '#2c2c2c'); px(ox+9, 3, '#2c2c2c'); // eyes
            px(ox+7, 5, '#e74c3c'); // smile
            // Body (green apron)
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(ox+4, 6, 8, 6);
            // White apron
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(ox+6, 7, 4, 4);
            // Legs
            ctx.fillStyle = '#2c2c2c';
            ctx.fillRect(ox+5, 12, 2, 3);
            ctx.fillRect(ox+9, 12, 2, 3);
            px(ox+4, 14, '#2c2c2c'); px(ox+4, 15, '#2c2c2c');
            px(ox+11, 14, '#2c2c2c'); px(ox+11, 15, '#2c2c2c');
        };

        drawNPC(0);
        drawNPC(W); // second frame slight variation
        px(W + 5, 7, '#f5cba7'); // arm raised in frame 1

        scene.textures.addCanvas('npc', canvas);
        scene.textures.get('npc').add(0, 0, 0,  0, W, H);
        scene.textures.get('npc').add(1, 0, W, 0, W, H);

        const a = scene.anims;
        if (!a.exists('npc_idle')) {
            a.create({ key: 'npc_idle', frames: [{ key: 'npc', frame: 0 }, { key: 'npc', frame: 1 }], frameRate: 1, repeat: -1 });
        }
    }

    // ─────────────────────────────────────────────────────
    //  FISHING BOBBER – 8×8 animated
    // ─────────────────────────────────────────────────────
    static createFishingBobber(scene) {
        if (scene.textures.exists('bobber')) return;

        const W = 8, H = 8;
        const canvas = document.createElement('canvas');
        canvas.width = W * 2;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };

        // Frame 0: bobber floating
        px(3, 2, '#e74c3c'); px(4, 2, '#e74c3c');
        px(2, 3, '#e74c3c'); px(3, 3, '#c0392b'); px(4, 3, '#c0392b'); px(5, 3, '#e74c3c');
        px(2, 4, '#c0392b'); px(3, 4, '#ffffff'); px(4, 4, '#c0392b'); px(5, 4, '#c0392b');
        px(3, 5, '#e74c3c'); px(4, 5, '#e74c3c');
        // water line
        px(0, 4, '#3498db'); px(1, 4, '#2980b9'); px(6, 4, '#2980b9'); px(7, 4, '#3498db');

        // Frame 1: bobber dipped
        const ox = W;
        px(ox+3, 3, '#e74c3c'); px(ox+4, 3, '#e74c3c');
        px(ox+2, 4, '#e74c3c'); px(ox+3, 4, '#c0392b'); px(ox+4, 4, '#c0392b'); px(ox+5, 4, '#e74c3c');
        px(ox+3, 5, '#e74c3c'); px(ox+4, 5, '#e74c3c');
        px(ox+0, 3, '#3498db'); px(ox+1, 3, '#2980b9'); px(ox+6, 3, '#2980b9'); px(ox+7, 3, '#3498db');
        // splash
        px(ox+1, 2, '#85c1e9'); px(ox+6, 2, '#85c1e9');

        scene.textures.addCanvas('bobber', canvas);
        scene.textures.get('bobber').add(0, 0, 0, 0, W, H);
        scene.textures.get('bobber').add(1, 0, W, 0, W, H);

        if (!scene.anims.exists('bobber_float')) {
            scene.anims.create({
                key: 'bobber_float',
                frames: [{ key: 'bobber', frame: 0 }, { key: 'bobber', frame: 1 }],
                frameRate: 2, repeat: -1
            });
        }
    }

    // ─────────────────────────────────────────────────────
    //  UI ICONS – 8×8 small icons
    // ─────────────────────────────────────────────────────
    static createUI(scene) {
        if (scene.textures.exists('ui_icons')) return;

        const W = 8, H = 8;
        const COUNT = 4; // coin, seed, fish, shovel
        const canvas = document.createElement('canvas');
        canvas.width = W * COUNT;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };

        // Coin icon
        const drawCoin = (ox) => {
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(ox+2, 1, 4, 6);
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(ox+1, 2, 1, 4); ctx.fillRect(ox+6, 2, 1, 4);
            ctx.fillStyle = '#f9e79f';
            px(ox+3, 2, '#f9e79f'); px(ox+4, 2, '#f9e79f');
        };

        // Seed icon
        const drawSeed = (ox) => {
            px(ox+3, 0, '#a0522d'); px(ox+4, 0, '#a0522d');
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(ox+2, 1, 4, 3);
            px(ox+3, 4, '#27ae60'); px(ox+4, 4, '#2ecc71');
            px(ox+4, 5, '#27ae60'); px(ox+4, 6, '#2ecc71');
        };

        // Fish icon
        const drawFish = (ox) => {
            ctx.fillStyle = '#3498db';
            ctx.fillRect(ox+1, 3, 5, 2);
            px(ox+6, 2, '#3498db'); px(ox+6, 5, '#3498db'); // tail
            px(ox+7, 1, '#2980b9'); px(ox+7, 6, '#2980b9');
            px(ox+1, 3, '#85c1e9'); // eye shine
        };

        // Shovel icon
        const drawShovel = (ox) => {
            px(ox+4, 0, '#95a5a6'); px(ox+4, 1, '#95a5a6');
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(ox+3, 2, 3, 3);
            px(ox+2, 5, '#7f8c8d'); px(ox+5, 5, '#7f8c8d');
            px(ox+4, 5, '#a0522d'); // handle start
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(ox+4, 6, 1, 2);
        };

        drawCoin(0);
        drawSeed(W);
        drawFish(W*2);
        drawShovel(W*3);

        scene.textures.addCanvas('ui_icons', canvas);
        for (let i = 0; i < COUNT; i++) {
            scene.textures.get('ui_icons').add(i, 0, i * W, 0, W, H);
        }
    }
}
