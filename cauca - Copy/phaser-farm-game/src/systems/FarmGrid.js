// src/systems/FarmGrid.js
// Quản lý lưới ô đất – Phase 3: dùng Sprout Lands sprites thật
// Tiles: sl_tilled (16×16 bitmask sheet), Crops: sl_plants (16×16, 6×2 = 12 frames)

export const TileState = {
    GRASS:   'grass',
    TILLED:  'tilled',
    WATERED: 'watered',
    PLANTED: 'planted',
};

// Config cây trồng
// frameStart: frame đầu tiên trong sl_plants cho loại cây này (6 frame/cây)
export const CROP_CONFIG = {
    radish_seed: {
        id:         'radish',
        name:       'Củ Cải',
        growDays:   4,
        sellPrice:  60,
        frameStart: 0,   // sl_plants frames 0–5
        color:      0xe74c3c,
    },
    carrot_seed: {
        id:         'carrot',
        name:       'Cà Rốt',
        growDays:   7,
        sellPrice:  130,
        frameStart: 6,   // sl_plants frames 6–11
        color:      0xe67e22,
    },
};

// sl_tilled (176×112, 16×16, 11 cols × 7 rows = 77 frames)
// Frame 0  = single isolated tile (no connected neighbors) – looks great for individual cells
// Frame 38 = fully-surrounded center tile – use when many cells tilled together
// We use frame 0 for simplicity (shows outlined pixel-art dirt tile)
const TILLED_FRAME        = 0;
const TILLED_TINT_DEFAULT = 0xffffff; // no tint → natural brown
const TILLED_TINT_WATERED = 0x85c1e9; // blue tint = watered

export default class FarmGrid {
    constructor(scene, cols, rows, tileSize, originX, originY) {
        this.scene   = scene;
        this.cols    = cols;
        this.rows    = rows;
        this.tileSize = tileSize;
        this.originX  = originX;
        this.originY  = originY;

        /** @type {Map<string, CellData>} */
        this.cells      = new Map();
        this._tileSprites = {}; // key → Phaser.GameObjects.Image
        this.cropGroup  = scene.add.group();

        this._drawGrid();
    }

    // ── Helpers ────────────────────────────────────────────

    _key(gx, gy)  { return `${gx},${gy}`; }

    _worldToGrid(wx, wy) {
        return {
            gx: Math.floor((wx - this.originX) / this.tileSize),
            gy: Math.floor((wy - this.originY) / this.tileSize),
        };
    }

    _gridToWorld(gx, gy) {
        return {
            wx: this.originX + gx * this.tileSize + this.tileSize / 2,
            wy: this.originY + gy * this.tileSize + this.tileSize / 2,
        };
    }

    _isValid(gx, gy) {
        return gx >= 0 && gx < this.cols && gy >= 0 && gy < this.rows;
    }

    // ── Draw initial grid ──────────────────────────────────

    _drawGrid() {
        const hasSL = this.scene.textures.exists('sl_tilled');

        for (let gx = 0; gx < this.cols; gx++) {
            for (let gy = 0; gy < this.rows; gy++) {
                const { wx, wy } = this._gridToWorld(gx, gy);
                const key = this._key(gx, gy);

                if (hasSL) {
                    // Grass base under each cell (neutral grass color)
                    this.scene.add.rectangle(wx, wy, this.tileSize, this.tileSize, 0x4a8040, 0.5)
                        .setDepth(1);

                    // Tilled tile sprite (initially hidden / grass state = invisible tilled)
                    const tile = this.scene.add.image(wx, wy, 'sl_tilled', TILLED_FRAME)
                        .setDepth(2)
                        .setDisplaySize(this.tileSize, this.tileSize)
                        .setAlpha(0); // hidden until tilled
                    this._tileSprites[key] = tile;
                } else {
                    // Fallback
                    this.scene.add.rectangle(wx, wy, this.tileSize - 1, this.tileSize - 1, 0x5c8a3c).setDepth(1);
                }
            }
        }

        // No grid lines – Sprout Lands style doesn't use grid overlay
    }

    // ── Tile & Crop sprite updates ─────────────────────────

    _updateTileSprite(gx, gy, cell) {
        const sprite = this._tileSprites[this._key(gx, gy)];
        if (!sprite) return;

        if (cell.state === TileState.GRASS) {
            sprite.setAlpha(0);
            return;
        }

        sprite.setAlpha(1);
        sprite.setFrame(TILLED_FRAME);

        // Tint: blue if watered
        if (cell.state === TileState.WATERED) {
            sprite.setTint(TILLED_TINT_WATERED);
        } else {
            sprite.clearTint();
        }
    }

    /** Calculate sl_plants frame index from crop config + growth stage */
    _getCropFrame(cfg, growthStage) {
        const progress = growthStage / cfg.growDays;
        let stageIdx;
        if (growthStage === 0)      stageIdx = 0; // just planted (seed)
        else if (progress < 0.25)   stageIdx = 1; // tiny sprout
        else if (progress < 0.5)    stageIdx = 2; // small
        else if (progress < 0.75)   stageIdx = 3; // medium
        else if (progress < 1.0)    stageIdx = 4; // almost
        else                        stageIdx = 5; // fully grown / harvestable
        return cfg.frameStart + stageIdx;
    }

    _updateCropSprite(gx, gy, cell) {
        if (!cell.crop) return;
        const cfg = CROP_CONFIG[cell.crop.seedId];
        const { wx, wy } = this._gridToWorld(gx, gy);

        if (!cell._cropSprite) {
            if (this.scene.textures.exists('sl_plants')) {
                cell._cropSprite = this.scene.add.image(wx, wy, 'sl_plants', 0)
                    .setDepth(3)
                    .setDisplaySize(this.tileSize, this.tileSize);
            } else {
                cell._cropSprite = this.scene.add.circle(wx, wy, 4, 0x2ecc71).setDepth(3);
            }
            this.cropGroup.add(cell._cropSprite);

            // Plant shake animation
            this.scene.tweens.add({
                targets: cell._cropSprite,
                angle: { from: -6, to: 6 },
                duration: 120,
                yoyo: true, repeat: 2,
                ease: 'Sine.easeInOut',
            });
        }

        if (this.scene.textures.exists('sl_plants')) {
            const frame = this._getCropFrame(cfg, cell.crop.growthStage);
            cell._cropSprite.setFrame(frame);

            // Pulse when ready to harvest
            const isReady = cell.crop.growthStage >= cfg.growDays;
            if (isReady && !cell._readyGlow) {
                cell._readyGlow = true;
                this.scene.tweens.add({
                    targets: cell._cropSprite,
                    scaleX: 1.15, scaleY: 1.15,
                    duration: 500, yoyo: true, repeat: -1,
                    ease: 'Sine.easeInOut',
                });
            }
        }
    }

    // ── Public API ─────────────────────────────────────────

    /** Cuốc đất tại vị trí world */
    till(wx, wy) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        if (!this._isValid(gx, gy)) return false;
        const key = this._key(gx, gy);
        if (this.cells.has(key)) return false;

        const cell = { state: TileState.TILLED, crop: null, _cropSprite: null, _readyGlow: false };
        this.cells.set(key, cell);
        this._updateTileSprite(gx, gy, cell);

        // Bounce tween on tile appearance
        const sprite = this._tileSprites[key];
        if (sprite) {
            this.scene.tweens.add({
                targets: sprite,
                scaleY: 0.8, scaleX: 1.1,
                duration: 70, yoyo: true, ease: 'Power2',
            });
        }
        return true;
    }

    /** Tưới nước */
    water(wx, wy) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        const key  = this._key(gx, gy);
        const cell = this.cells.get(key);
        if (!cell || cell.state === TileState.GRASS) return false;

        cell.state = TileState.WATERED;
        this._updateTileSprite(gx, gy, cell);

        // Small water splash effect
        const { wx: spx, wy: spy } = this._gridToWorld(gx, gy);
        for (let i = 0; i < 3; i++) {
            const drop = this.scene.add.circle(
                spx + Phaser.Math.Between(-4, 4),
                spy,
                1.5, 0x3498db
            ).setDepth(5).setAlpha(0.9);
            this.scene.tweens.add({
                targets: drop,
                y: spy - Phaser.Math.Between(4, 10),
                alpha: 0,
                duration: 280 + i * 60,
                delay: i * 40,
                ease: 'Power2',
                onComplete: () => drop.destroy(),
            });
        }
        return true;
    }

    /** Trồng cây */
    plant(wx, wy, seedId) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        const key  = this._key(gx, gy);
        const cell = this.cells.get(key);
        if (!cell || cell.crop) return false;
        if (cell.state !== TileState.TILLED && cell.state !== TileState.WATERED) return false;
        if (!CROP_CONFIG[seedId]) return false;

        cell.state = TileState.PLANTED;
        cell.crop  = { seedId, growthStage: 0 };
        cell._readyGlow = false;
        this._updateTileSprite(gx, gy, cell);
        this._updateCropSprite(gx, gy, cell);
        return true;
    }

    /** Thu hoạch – trả về crop id hoặc null */
    harvest(wx, wy) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        const key  = this._key(gx, gy);
        const cell = this.cells.get(key);
        if (!cell || !cell.crop) return null;

        const cfg = CROP_CONFIG[cell.crop.seedId];
        if (cell.crop.growthStage < cfg.growDays) return null;

        const harvestedId = cfg.id;

        // Harvest pop animation
        if (cell._cropSprite) {
            this.scene.tweens.add({
                targets: cell._cropSprite,
                y:       cell._cropSprite.y - 14,
                alpha:   0,
                scaleX:  1.6, scaleY: 1.6,
                duration: 280,
                ease: 'Power2',
                onComplete: () => { cell._cropSprite?.destroy(); cell._cropSprite = null; },
            });
        }

        cell.state      = TileState.TILLED;
        cell.crop       = null;
        cell._readyGlow = false;
        this._updateTileSprite(gx, gy, cell);
        return harvestedId;
    }

    /** Ngày mới: tăng growth nếu được tưới / mưa */
    onDayPassed(weatherIsRainy = false) {
        for (const [key, cell] of this.cells) {
            if (!cell.crop) continue;
            if (cell.state === TileState.WATERED || weatherIsRainy) {
                cell.crop.growthStage++;
            }
            if (cell.state === TileState.WATERED) cell.state = TileState.PLANTED;

            const [gx, gy] = key.split(',').map(Number);
            this._updateTileSprite(gx, gy, cell);
            this._updateCropSprite(gx, gy, cell);
        }
    }

    getCellAt(wx, wy) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        if (!this._isValid(gx, gy)) return null;
        return this.cells.get(this._key(gx, gy)) ?? null;
    }

    isReadyToHarvest(wx, wy) {
        const { gx, gy } = this._worldToGrid(wx, wy);
        const cell = this.cells.get(this._key(gx, gy));
        if (!cell?.crop) return false;
        return cell.crop.growthStage >= CROP_CONFIG[cell.crop.seedId].growDays;
    }

    serialize() {
        const obj = {};
        for (const [key, cell] of this.cells) {
            obj[key] = { state: cell.state, crop: cell.crop };
        }
        return obj;
    }

    restore(data) {
        for (const [key, saved] of Object.entries(data)) {
            const [gx, gy] = key.split(',').map(Number);
            const cell = { state: saved.state, crop: saved.crop, _cropSprite: null, _readyGlow: false };
            this.cells.set(key, cell);
            this._updateTileSprite(gx, gy, cell);
            if (cell.crop) this._updateCropSprite(gx, gy, cell);
        }
    }
}
