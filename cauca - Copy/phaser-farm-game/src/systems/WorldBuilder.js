// src/systems/WorldBuilder.js
// Xây dựng thế giới bằng Sprout Lands assets
// Phase 3: tiles thật, trees thật, house thật, fence thật

export const WORLD_W = 640;
export const WORLD_H = 480;
export const TILE    = 16;

export const ZONES = {
    FARM:   { x: 64,  y: 96,  w: 10, h: 7 },     // lưới nông trại 10×7
    POND:   { x: 460, y: 120, r: 36  },            // ao cá
    SHOP:   { x: 520, y: 320, w: 32, h: 40 },      // NPC shop
    HOUSE:  { x: 380, y: 120, w: 112, h: 80 },     // nhà gỗ (= Wooden House.png size)
    BARN:   { x: 50,  y: 340, w: 48, h: 36 },      // chuồng (for later)
};

export class WorldBuilder {
    constructor(scene) {
        this.scene = scene;
        this._staticGroup = scene.physics.add.staticGroup();
    }

    get staticGroup() { return this._staticGroup; }

    build() {
        this._drawGround();
        this._drawGrassDecor();
        this._drawPaths();
        this._drawWater();
        this._drawHouse();
        this._drawTrees();
        this._drawFences();
        this._drawDecorations();
        this._drawChicken();
        return this._staticGroup;
    }

    // ══════════════════════════════════════════════════════
    //  GROUND – tileSprite grass tiles
    // ══════════════════════════════════════════════════════
    _drawGround() {
        const s = this.scene;

        // Base green fill
        s.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x4a8040).setOrigin(0).setDepth(0);

        // Tile the Sprout Lands grass sheet across the whole world
        // sl_grass (176×112, 16×16 tiles, 77 frames)
        // Frame 0 = first tile in sheet = basic grass tile
        if (s.textures.exists('sl_grass')) {
            // Create tileSprite using a single grass frame (frame 0)
            // Sprout Lands grass sheet is a tileset, first tile (0,0) = basic grass
            const grassBg = s.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'sl_grass')
                .setOrigin(0)
                .setDepth(0);
            // tileSprite with a spritesheet uses the full sheet unless we crop
            // Use frame 0 only = set via setFrame()
            grassBg.setFrame(0);
        }

        // Darker base ring at map edge (slightly darker tone)
        const edgeColor = 0x3a6630;
        // Top strip
        s.add.rectangle(0, 0, WORLD_W, 16, edgeColor).setOrigin(0).setDepth(0);
        // Bottom strip
        s.add.rectangle(0, WORLD_H - 16, WORLD_W, 16, edgeColor).setOrigin(0).setDepth(0);
        // Left strip
        s.add.rectangle(0, 0, 16, WORLD_H, edgeColor).setOrigin(0).setDepth(0);
        // Right strip
        s.add.rectangle(WORLD_W - 16, 0, 16, WORLD_H, edgeColor).setOrigin(0).setDepth(0);
    }

    // ══════════════════════════════════════════════════════
    //  GRASS DECORATION TILES
    // ══════════════════════════════════════════════════════
    _drawGrassDecor() {
        if (!this.scene.textures.exists('sl_grass')) return;
        const s = this.scene;

        // Scatter grass variation tiles (frames 1–10 of sl_grass are edges/variations)
        // Place randomly but avoid farm area and house area
        const grassPositions = [
            [30, 30], [50, 50], [200, 30], [220, 50], [280, 60],
            [100, 260], [130, 280], [300, 350], [350, 330],
            [520, 200], [540, 220], [560, 180],
            [420, 370], [440, 350],
            [80, 420], [100, 440], [580, 380], [600, 400],
            [160, 60], [340, 60], [460, 60],
        ];

        for (const [gx, gy] of grassPositions) {
            // Use various grass frames for texture variation
            const frame = Phaser.Math.Between(1, 5);
            s.add.image(gx, gy, 'sl_grass', frame).setDepth(1).setAlpha(0.7);
        }
    }

    // ══════════════════════════════════════════════════════
    //  PATHS (stone paths around the farm/house)
    // ══════════════════════════════════════════════════════
    _drawPaths() {
        const s = this.scene;

        // Main horizontal path (middle of world)
        // Use sl_paths image (64×64) – treat as a full stone path texture
        if (s.textures.exists('sl_paths')) {
            // Tile path horizontally across middle
            const pathY = 244;
            const pathH = 20;
            const pathTile = s.add.tileSprite(0, pathY, WORLD_W, pathH, 'sl_paths')
                .setOrigin(0).setDepth(2).setAlpha(0.85);

            // Vertical path (left side)
            s.add.tileSprite(52, 0, 20, WORLD_H, 'sl_paths')
                .setOrigin(0).setDepth(2).setAlpha(0.85);
        } else {
            // Fallback color paths
            s.add.rectangle(0, 244, WORLD_W, 20, 0x9b8060).setOrigin(0).setDepth(2);
            s.add.rectangle(52, 0, 20, WORLD_H, 0x9b8060).setOrigin(0).setDepth(2);
        }

        // Stone courtyard in front of house (Stardew style)
        const houseX = ZONES.HOUSE.x;
        const houseY = ZONES.HOUSE.y + ZONES.HOUSE.h;
        if (s.textures.exists('sl_paths')) {
            s.add.tileSprite(houseX - 10, houseY, ZONES.HOUSE.w + 20, 28, 'sl_paths')
                .setOrigin(0).setDepth(2).setAlpha(0.8);
        } else {
            s.add.rectangle(houseX, houseY + 14, ZONES.HOUSE.w, 28, 0xc8b08a)
                .setOrigin(0.5, 0).setDepth(2);
        }
    }

    // ══════════════════════════════════════════════════════
    //  WATER / POND
    // ══════════════════════════════════════════════════════
    _drawWater() {
        const s = this.scene;
        const { x: px, y: py, r } = ZONES.POND;

        // Dark backdrop
        s.add.circle(px, py, r + 6, 0x1a4f7a).setDepth(2);
        // Main water (teal like Sprout Lands)
        s.add.circle(px, py, r, 0x3dbfb8).setDepth(3);

        // Water tiles from sl_water (64×16, 16×16, 4 frames animated)
        if (s.textures.exists('sl_water')) {
            // Tile water tiles inside circle (approximate with rectangles)
            const wSteps = Math.floor(r * 2 / TILE);
            const hSteps = Math.floor(r * 2 / TILE);
            for (let gx = 0; gx < wSteps; gx++) {
                for (let gy = 0; gy < hSteps; gy++) {
                    const tx = px - r + gx * TILE + TILE / 2;
                    const ty = py - r + gy * TILE + TILE / 2;
                    const dist = Phaser.Math.Distance.Between(tx, ty, px, py);
                    if (dist < r - 10) {
                        const wTile = s.add.image(tx, ty, 'sl_water', 0)
                            .setDepth(4).setDisplaySize(TILE, TILE);
                        // Animate between water frames
                        s.time.addEvent({
                            delay: 300 + gx * 50,
                            loop: true,
                            callback: () => {
                                const f = (wTile.frame.name + 1) % 4;
                                wTile.setFrame(f);
                            }
                        });
                    }
                }
            }
        }

        // Water shimmer (animated expanding ring)
        const ripple = s.add.circle(px, py, r * 0.6, 0xffffff, 0).setDepth(5);
        s.tweens.add({
            targets: ripple,
            scaleX: 2, scaleY: 2,
            alpha: { from: 0.15, to: 0 },
            duration: 2400,
            repeat: -1,
            ease: 'Sine.easeOut',
        });

        // Lily pads (small green circles with pink flowers)
        const lilies = [[px - 18, py + 10], [px + 14, py - 14], [px + 20, py + 12]];
        for (const [lx, ly] of lilies) {
            s.add.ellipse(lx, ly, 10, 7, 0x27ae60, 0.92).setDepth(5);
            s.add.circle(lx + 1, ly - 1, 2.5, 0xe91e8c, 0.9).setDepth(6);
        }

        // Pond label
        s.add.text(px, py + r + 6, '[F] Câu cá', {
            fontSize: '5px', color: '#7fdfda', fontFamily: 'Courier New',
            backgroundColor: '#00000066', padding: { x: 2, y: 1 },
        }).setOrigin(0.5).setDepth(6);

        // Invisible wall to stop player walking into pond
        const wall = s.add.circle(px, py, r * 0.8, 0x000000, 0);
        this._staticGroup.add(wall);
    }

    // ══════════════════════════════════════════════════════
    //  HOUSE (Wooden House.png – 112×80)
    // ══════════════════════════════════════════════════════
    _drawHouse() {
        const s = this.scene;
        const { x: hx, y: hy, w: hw, h: hh } = ZONES.HOUSE;
        const cx = hx + hw / 2;

        // Shadow
        s.add.ellipse(cx + 8, hy + hh + 10, hw + 10, 14, 0x000000, 0.2).setDepth(2);

        if (s.textures.exists('sl_house')) {
            // Place the Wooden House sprite (pixel-perfect at 2× game scale)
            const house = s.add.image(hx, hy, 'sl_house')
                .setOrigin(0, 0)
                .setDepth(5)
                .setDisplaySize(hw, hh);

            // Collision wall (solid building body)
            const wall = s.add.rectangle(cx, hy + hh / 2, hw - 8, hh - 8, 0x000000, 0);
            this._staticGroup.add(wall);
        } else {
            // Fallback house
            s.add.rectangle(cx, hy + hh / 2, hw, hh, 0x8d6e4a).setDepth(5);
        }

        // House name tag
        s.add.text(cx, hy + hh + 14, 'Nhà [N]=ngủ', {
            fontSize: '5px', color: '#f5cba7', fontFamily: 'Courier New',
            backgroundColor: '#00000066', padding: { x: 2, y: 1 }
        }).setOrigin(0.5).setDepth(6);

        // Chimney smoke particle
        this._addChimneySmoke(hx + 18, hy - 4);
    }

    _addChimneySmoke(cx, cy) {
        const s = this.scene;
        s.time.addEvent({
            delay: 1800,
            loop: true,
            callback: () => {
                const smoke = s.add.circle(cx, cy, 3, 0xb0bec5, 0.5).setDepth(8);
                s.tweens.add({
                    targets: smoke,
                    y: cy - 20,
                    x: cx + Phaser.Math.Between(-4, 4),
                    alpha: 0,
                    scaleX: 2, scaleY: 2,
                    duration: 1600,
                    ease: 'Sine.easeOut',
                    onComplete: () => smoke.destroy(),
                });
            }
        });
    }

    // ══════════════════════════════════════════════════════
    //  TREES using sl_biome named frames
    // ══════════════════════════════════════════════════════
    _drawTrees() {
        if (!this.scene.textures.exists('sl_biome')) {
            this._drawTreesFallback();
            return;
        }

        const s = this.scene;

        // Tree positions: [worldX, worldY, frameKey, scaleX, scaleY, depth]
        const trees = [
            // Left side
            [20,  60,  'tree_big_1', 1,    1,    3],
            [20,  160, 'tree_big_2', 0.95, 1,    3],
            [22,  290, 'tree_big_1', 1.05, 1.05, 3],
            [24,  390, 'tree_big_2', 0.9,  0.9,  3],

            // Top row
            [120, 18,  'tree_big_1', 1,    1,    3],
            [180, 14,  'tree_big_2', 1.1,  1.1,  3],
            [300, 20,  'tree_big_1', 0.95, 0.95, 3],
            [360, 16,  'tree_big_2', 1,    1,    3],

            // Right side
            [590, 50,  'tree_big_2', 1,    1,    3],
            [600, 150, 'tree_big_1', 1.05, 1,   3],
            [595, 260, 'tree_big_2', 0.9,  0.95, 3],
            [598, 380, 'tree_big_1', 1,    1,    3],

            // Bottom row
            [120, 450, 'tree_big_2', 1,    0.9,  3],
            [220, 460, 'tree_big_1', 0.95, 0.95, 3],
            [380, 455, 'tree_big_2', 1,    1,    3],
            [500, 450, 'tree_big_1', 1.05, 1,    3],

            // Around house
            [370, 90,  'tree_big_1', 0.85, 0.85, 4],
            [510, 100, 'tree_big_2', 0.85, 0.85, 4],

            // Near pond
            [430, 90,  'tree_big_2', 0.8, 0.8, 4],
            [500, 80,  'tree_big_1', 0.75, 0.75, 4],
        ];

        for (const [tx, ty, frame, sx, sy, depth] of trees) {
            // Shadow
            s.add.ellipse(tx + 4, ty + 12, 28 * sx, 10, 0x000000, 0.2).setDepth(depth - 1);
            // Tree sprite (32×48 frame from sl_biome)
            const tree = s.add.image(tx, ty, 'sl_biome', frame)
                .setOrigin(0.5, 0.9)  // anchor near bottom of trunk
                .setScale(sx, sy)
                .setDepth(depth);

            // Gentle sway animation
            s.tweens.add({
                targets: tree,
                angle: { from: -1, to: 1 },
                duration: 2400 + Phaser.Math.Between(-400, 400),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });

            // Static physics body (trunk area)
            const wall = s.add.circle(tx, ty + 8, 6, 0x000000, 0);
            this._staticGroup.add(wall);
        }
    }

    _drawTreesFallback() {
        const s = this.scene;
        const positions = [[24, 220], [470, 50], [130, 290], [470, 140], [24, 280], [300, 310]];
        for (const [tx, ty] of positions) {
            s.add.ellipse(tx + 3, ty + 4, 16, 6, 0x000000, 0.18).setDepth(1);
            s.add.rectangle(tx, ty + 4, 5, 14, 0x8B5E3C).setOrigin(0.5).setDepth(2);
            s.add.circle(tx, ty - 8, 10, 0x27ae60).setDepth(3);
        }
    }

    // ══════════════════════════════════════════════════════
    //  FENCES (Sprout Lands fence sprites)
    // ══════════════════════════════════════════════════════
    _drawFences() {
        const s = this.scene;
        const FARM = ZONES.FARM;
        const fw = FARM.w * TILE;
        const fh = FARM.h * TILE;

        if (s.textures.exists('sl_fences')) {
            // sl_fences: 64×64, 16×16, 4×4 = 16 frames
            // Frame 0 = horizontal fence, Frame 4 = vertical fence (typical layout)
            // Top fence row
            for (let x = FARM.x; x < FARM.x + fw; x += TILE) {
                s.add.image(x + TILE / 2, FARM.y - TILE / 2, 'sl_fences', 0)
                    .setDepth(4).setDisplaySize(TILE, TILE);
            }
            // Bottom fence row
            for (let x = FARM.x; x < FARM.x + fw; x += TILE) {
                s.add.image(x + TILE / 2, FARM.y + fh + TILE / 2, 'sl_fences', 0)
                    .setDepth(4).setDisplaySize(TILE, TILE);
            }
            // Left fence col
            for (let y = FARM.y; y < FARM.y + fh; y += TILE) {
                s.add.image(FARM.x - TILE / 2, y + TILE / 2, 'sl_fences', 4)
                    .setDepth(4).setDisplaySize(TILE, TILE);
            }
            // Right fence col
            for (let y = FARM.y; y < FARM.y + fh; y += TILE) {
                s.add.image(FARM.x + fw + TILE / 2, y + TILE / 2, 'sl_fences', 4)
                    .setDepth(4).setDisplaySize(TILE, TILE);
            }

            // Gate opening (skip one fence on right side, mid point)
            // (Add a gap post for the gate opening)
            const gateY = FARM.y + Math.floor(fh / 2);
            // The gate posts are placed naturally by the above loops
        } else {
            // Fallback graphics fence
            const g = s.add.graphics().setDepth(3);
            g.lineStyle(2, 0x8d6e4a, 0.9);
            g.strokeRect(FARM.x - 3, FARM.y - 3, fw + 6, fh + 6);
        }
    }

    // ══════════════════════════════════════════════════════
    //  DECORATIONS
    // ══════════════════════════════════════════════════════
    _drawDecorations() {
        const s = this.scene;

        // Bushes and small biome objects from sl_biome
        if (s.textures.exists('sl_biome')) {
            const smallDecor = [
                // [x, y, frame]
                [100, 310, 'bush_1'],
                [115, 330, 'bush_2'],
                [280, 400, 'bush_1'],
                [295, 420, 'flower_patch'],
                [460, 340, 'bush_2'],
                [475, 360, 'flower_patch'],
                [340, 300, 'flower_patch'],
                [530, 280, 'bush_1'],
                [160, 440, 'flower_patch'],
            ];
            for (const [dx, dy, frame] of smallDecor) {
                s.add.image(dx, dy, 'sl_biome', frame).setDepth(3).setScale(0.9);
            }
        }

        // Wildflowers (small colored dots)
        const flowerColors = [0xe74c3c, 0xf1c40f, 0xe056e9, 0xff8c00, 0xffffff, 0xff69b4];
        const flowerSpots = [
            [104, 305], [118, 290], [260, 390], [272, 405],
            [338, 292], [352, 306], [536, 275], [550, 290],
            [162, 445], [175, 432],
        ];
        flowerSpots.forEach(([fx, fy], i) => {
            const color = flowerColors[i % flowerColors.length];
            s.add.circle(fx, fy, 2, 0x2d8a2d).setDepth(2);
            s.add.circle(fx, fy - 3, 2.5, color).setDepth(3);
        });

        // Scarecrow (hand-drawn, near farm)
        const scx = ZONES.FARM.x + ZONES.FARM.w * TILE + 24;
        const scy = ZONES.FARM.y + 20;
        s.add.rectangle(scx, scy + 8, 2, 24, 0x8d6e4a).setDepth(3);
        s.add.rectangle(scx, scy + 4, 18, 2, 0x8d6e4a).setDepth(3);
        s.add.circle(scx, scy - 4, 5, 0xf5cba7).setDepth(4); // head
        s.add.rectangle(scx, scy + 2, 13, 10, 0x3498db, 0.9).setDepth(3); // shirt
        s.add.rectangle(scx, scy - 11, 13, 3, 0x5d4037).setDepth(4);  // hat brim
        s.add.rectangle(scx, scy - 14, 9, 5, 0x5d4037).setDepth(4);   // hat top
        s.add.text(scx, scy - 4, '😄', { fontSize: '6px' }).setOrigin(0.5).setDepth(5);

        // Hay bales near barn area  
        const hayPositions = [[80, 370], [80, 386], [96, 370]];
        for (const [hx, hy] of hayPositions) {
            s.add.rectangle(hx, hy, 14, 12, 0xd4a017).setDepth(3);
            s.add.rectangle(hx, hy, 14, 3, 0xb8860b).setDepth(4);
        }

        // Small stone well
        const wx = 240, wy = 330;
        s.add.circle(wx, wy, 10, 0x7c7c7c).setDepth(3);
        s.add.circle(wx, wy, 7, 0x1a1a2e).setDepth(4);
        s.add.rectangle(wx, wy - 12, 2, 12, 0x5d4037).setOrigin(0.5).setDepth(4);
        s.add.rectangle(wx - 7, wy - 14, 14, 3, 0x4e342e).setOrigin(0).setDepth(5);
        s.add.text(wx, wy + 14, 'Giếng', { fontSize: '5px', color: '#aaa', fontFamily: 'Courier New' })
            .setOrigin(0.5).setDepth(5);

        // NPC Shop stall (near top-right)
        this._drawShopStall();

        // Parallax clouds
        this._drawClouds();
    }

    _drawShopStall() {
        const s = this.scene;
        const { x: sx, y: sy } = ZONES.SHOP;

        // Shadow
        s.add.ellipse(sx + 6, sy + 26, 38, 10, 0x000000, 0.2).setDepth(3);
        // Base
        s.add.rectangle(sx, sy, 44, 46, 0x8d6e4a).setOrigin(0.5).setDepth(4);
        // Awning (Stardew style)
        s.add.rectangle(sx, sy - 20, 52, 14, 0xc0392b).setOrigin(0.5).setDepth(5);
        for (let i = -2; i <= 2; i++) {
            this.scene.add.rectangle(sx + i * 8, sy - 20, 5, 14, 0x962d22, 0.5).setDepth(6);
        }
        // Counter
        s.add.rectangle(sx, sy + 5, 42, 8, 0x5d4037).setOrigin(0.5).setDepth(5);
        // Produce decoration
        s.add.text(sx - 10, sy,     '🥕', { fontSize: '7px' }).setOrigin(0.5).setDepth(6);
        s.add.text(sx + 4,  sy,     '🌽', { fontSize: '7px' }).setOrigin(0.5).setDepth(6);
        // Sign
        s.add.text(sx, sy - 32, '🏪 SHOP', {
            fontSize: '6px', color: '#f1c40f', fontFamily: 'Courier New',
            backgroundColor: '#3d1c00cc', padding: { x: 3, y: 2 }
        }).setOrigin(0.5).setDepth(7);
        s.add.text(sx, sy + 28, '[B] Mua bán', {
            fontSize: '5px', color: '#d7bde2', fontFamily: 'Courier New',
            backgroundColor: '#00000066', padding: { x: 2, y: 1 }
        }).setOrigin(0.5).setDepth(7);

        // Collision
        const wall = this.scene.add.rectangle(sx, sy, 44, 46, 0x000000, 0);
        this._staticGroup.add(wall);
    }

    _drawClouds() {
        const s = this.scene;
        const cloudData = [
            { x: 60,  y: 10, r: 10, spd: 0.15 },
            { x: 150, y: 6,  r: 8,  spd: 0.12 },
            { x: 250, y: 12, r: 9,  spd: 0.17 },
            { x: 400, y: 8,  r: 7,  spd: 0.14 },
        ];
        for (const cd of cloudData) {
            const c1 = s.add.circle(cd.x, cd.y, cd.r, 0xffffff, 0.72).setScrollFactor(cd.spd).setDepth(20);
            s.add.circle(cd.x + cd.r, cd.y + 2, cd.r * 0.7, 0xffffff, 0.72).setScrollFactor(cd.spd).setDepth(20);
            s.add.circle(cd.x - cd.r * 0.7, cd.y + 3, cd.r * 0.6, 0xffffff, 0.65).setScrollFactor(cd.spd).setDepth(20);
        }
    }

    // ══════════════════════════════════════════════════════
    //  CHICKEN NPC (bonus from Sprout Lands)
    // ══════════════════════════════════════════════════════
    _drawChicken() {
        if (!this.scene.textures.exists('sl_chicken')) return;
        const s = this.scene;

        const chicken = s.add.sprite(80, 310, 'sl_chicken', 0)
            .setDepth(5).setDisplaySize(16, 16);

        if (s.anims.exists('chicken_walk')) chicken.play('chicken_walk');

        s.tweens.add({
            targets: chicken,
            x: 125,
            duration: 2800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => {
                if (s.anims.exists('chicken_walk_l')) chicken.play('chicken_walk_l');
            },
            onRepeat: () => {
                if (s.anims.exists('chicken_walk')) chicken.play('chicken_walk');
            },
        });
    }
}
