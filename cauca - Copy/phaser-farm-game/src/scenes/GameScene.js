// src/scenes/GameScene.js
// Scene chính – Phase 3: World Builder, Weather System, Fishing System nâng cấp

import Player        from '../entities/Player.js';
import FarmGrid      from '../systems/FarmGrid.js';
import TimeManager, { Weather } from '../systems/TimeManager.js';
import { WorldBuilder, ZONES, WORLD_W, WORLD_H, TILE } from '../systems/WorldBuilder.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { FishingSystem } from '../systems/FishingSystem.js';
import { stateManager }  from '../utils/StateManager.js';
import { SaveManager }   from '../utils/SaveManager.js';
import { CROP_CONFIG }   from '../systems/FarmGrid.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this._selectedSeed = 'radish_seed';
        this._shopOpen     = false;
        this._invOpen      = false;
    }

    create() {
        // ── Vật lý thế giới ────────────────────────────────
        this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

        // ── Xây thế giới ───────────────────────────────────
        const builder = new WorldBuilder(this);
        const staticBodies = builder.build();

        // ── Hệ thống nông trại ─────────────────────────────
        this.farmGrid = new FarmGrid(
            this,
            ZONES.FARM.w,
            ZONES.FARM.h,
            TILE,
            ZONES.FARM.x,
            ZONES.FARM.y
        );

        // ── Hệ thống thời gian ─────────────────────────────
        this.timeManager = new TimeManager(this, 90000); // 1.5 phút = 1 ngày
        this.timeManager.start();

        // ── Hệ thống thời tiết ─────────────────────────────
        this.weatherSystem = new WeatherSystem(this, WORLD_W, WORLD_H);

        // ── Hệ thống câu cá ────────────────────────────────
        this.fishingSystem = new FishingSystem(this, ZONES.POND.x, ZONES.POND.y, ZONES.POND.r);

        // ── Nhân vật ───────────────────────────────────────
        // Spawn player in front of house
        this.player = new Player(this, ZONES.HOUSE.x + ZONES.HOUSE.w / 2, ZONES.HOUSE.y + ZONES.HOUSE.h + 24);

        // Collision với static bodies (cây, nhà, v.v.)
        this.physics.add.collider(this.player.sprite, staticBodies);

        // ── Camera ─────────────────────────────────────────
        this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
        this.cameras.main.roundPixels = true; // ⚠️ BẮT BUỘC pixel art
        this.cameras.main.startFollow(this.player.sprite, true, 0.10, 0.10);
        // Zoom được set ở main.js (2×)

        // ── Phím tắt ───────────────────────────────────────
        this._setupKeys();

        // ── UI Scene ───────────────────────────────────────
        this.scene.launch('UIScene');

        // ── Sự kiện ────────────────────────────────────────
        this.events.on('day_changed',     this._onDayChanged,     this);
        this.events.on('weather_changed', this._onWeatherChanged, this);
        this.events.on('seed_changed',    (id) => { this._selectedSeed = id; });

        // ── Load save ──────────────────────────────────────
        this._loadSave();

        // ── Auto-save khi đóng tab ─────────────────────────
        window.addEventListener('beforeunload', () => this._saveGame());

        // ── Intro message ──────────────────────────────────
        this.time.delayedCall(600, () => {
            this._showHint('🌾 Chào mừng đến Farm Valley! Nhấn E để cuốc đất.');
        });

        console.log('[GameScene] Phase 3 Created ✓');
    }

    // ══════════════════════════════════════════════════════
    //  INPUT
    // ══════════════════════════════════════════════════════
    _setupKeys() {
        const kb = this.input.keyboard;

        // E – Tương tác đa năng
        kb.on('keydown-E', () => this._interact());

        // F – Câu cá
        kb.on('keydown-F', () => this._startFishing());

        // I – Túi đồ
        kb.on('keydown-I', () => {
            this._invOpen = !this._invOpen;
            this.events.emit(this._invOpen ? 'show_inventory' : 'hide_inventory');
        });

        // B – Shop (cần gần hoặc nhấn B khi gần)
        kb.on('keydown-B', () => {
            this._shopOpen = !this._shopOpen;
            this.events.emit(this._shopOpen ? 'show_shop' : 'hide_shop');
        });

        // Q – Đổi hạt giống
        kb.on('keydown-Q', () => {
            this.scene.get('UIScene').cycleSeed();
        });

        // N – Ngủ qua ngày (chỉ gần nhà)
        kb.on('keydown-N', () => {
            const distToHouse = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                ZONES.HOUSE.x + ZONES.HOUSE.w / 2,
                ZONES.HOUSE.y + ZONES.HOUSE.h / 2
            );
            if (distToHouse < 60) {
                this._sleepToNextDay();
            } else {
                this._showHint('🏠 Về nhà để ngủ!');
            }
        });

        // ESC – Đóng mọi panel mở
        kb.on('keydown-ESC', () => {
            if (this._shopOpen) { this._shopOpen = false; this.events.emit('hide_shop'); }
            if (this._invOpen)  { this._invOpen  = false; this.events.emit('hide_inventory'); }
        });

        // R – Reset save (debug)
        kb.on('keydown-R', () => {
            if (!this.input.keyboard.checkDown(this.input.keyboard.addKey('SHIFT'))) return;
            SaveManager.clear();
            this.scene.restart();
        });
    }

    // ══════════════════════════════════════════════════════
    //  TƯƠNG TÁC (E)
    // ══════════════════════════════════════════════════════
    _interact() {
        // Không tương tác khi đang câu cá
        if (this.fishingSystem.isActive) return;

        const pos = this.player.getFacingPosition(14);

        // 1. Thu hoạch nếu cây đã chín
        const harvested = this.farmGrid.harvest(pos.x, pos.y);
        if (harvested) {
            stateManager.addItem(harvested, 1);
            this.player.playInteractAnim();
            this._spawnFloatText(pos.x, pos.y, `+1 ${harvested}`, '#2ecc71');
            this._showHint(`🌾 Thu hoạch ${harvested}!`);
            return;
        }

        const cell = this.farmGrid.getCellAt(pos.x, pos.y);

        // 2. Trồng hạt nếu tay có hạt (đất tilled không có cây)
        if (cell && cell.state === 'tilled' && !cell.crop) {
            if (stateManager.hasItem(this._selectedSeed)) {
                const planted = this.farmGrid.plant(pos.x, pos.y, this._selectedSeed);
                if (planted) {
                    stateManager.removeItem(this._selectedSeed, 1);
                    this.player.playInteractAnim();
                    this._showHint(`🌱 Đã trồng ${CROP_CONFIG[this._selectedSeed]?.name}!`);
                    return;
                }
            } else {
                this._showHint(`❌ Không có ${CROP_CONFIG[this._selectedSeed]?.name}! [B] để mua.`);
                return;
            }
        }

        // 3. Tưới nước (đất tilled hoặc có cây chưa đủ nước)
        if (cell && (cell.state === 'tilled' || cell.state === 'planted')) {
            this.farmGrid.water(pos.x, pos.y);
            this.player.playInteractAnim();
            this._spawnFloatText(pos.x, pos.y, '💧', '#3498db');
            this._showHint('💧 Đã tưới nước!');
            return;
        }

        // 4. Cuốc đất (cỏ)
        const tilled = this.farmGrid.till(pos.x, pos.y);
        if (tilled) {
            this.player.playInteractAnim();
            this._showHint('⛏️ Đã cuốc đất!');
        }
    }

    // ══════════════════════════════════════════════════════
    //  CÂU CÁ (F)
    // ══════════════════════════════════════════════════════
    _startFishing() {
        if (this.fishingSystem.isActive) return;

        const dist = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, ZONES.POND.x, ZONES.POND.y
        );
        if (dist > ZONES.POND.r + 28) {
            this._showHint('🎣 Lại gần ao cá hơn!');
            return;
        }

        this._showHint('🎣 Đang câu... Nhấn SPACE khi cần giật!');

        this.fishingSystem.start(this.player.x, this.player.y, {
            onCatch: (fish) => {
                stateManager.addItem(fish.id, 1);
                this._spawnFloatText(ZONES.POND.x, ZONES.POND.y - 20, `${fish.emoji} ${fish.name}!`, '#f1c40f');
                this._showHint(`${fish.emoji} Bắt được ${fish.name}! (+${fish.sellPrice}💰 nếu bán)`);
                // Rare fish = screen flash
                if (fish.rarity <= 0.07) {
                    this.cameras.main.flash(400, 255, 215, 0, true);
                }
                this.events.emit('fishing_end');
            },
            onFail: () => {
                this._showHint('😮 Cá trốn mất! Thử lại.');
                this.events.emit('fishing_end');
            }
        });

        this.events.emit('fishing_start', {});
    }

    // ══════════════════════════════════════════════════════
    //  SLEEP TO NEXT DAY
    // ══════════════════════════════════════════════════════
    _sleepToNextDay() {
        // Black fade out → next day → fade in
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this._saveGame();
            this.timeManager.skipToNextDay();
            this.cameras.main.fadeIn(600, 0, 0, 0);
            this._showHint(`💤 Ngày ${stateManager.day} bắt đầu!`);
        });
    }

    // ══════════════════════════════════════════════════════
    //  NGÀY MỚI
    // ══════════════════════════════════════════════════════
    _onDayChanged(day) {
        const isRainy = this.timeManager.isRainy();
        this.farmGrid.onDayPassed(isRainy);
        if (isRainy) this._showHint('🌧️ Trời mưa – Cây được tưới tự động!');
    }

    _onWeatherChanged(weather) {
        // Apply visual weather changes only – do NOT re-emit (would cause infinite loop)
        this.weatherSystem.setWeather(weather);
    }

    // ══════════════════════════════════════════════════════
    //  FLOATING TEXT (popup reward)
    // ══════════════════════════════════════════════════════
    _spawnFloatText(wx, wy, text, color = '#ffffff') {
        // Convert world to camera coords
        const cam = this.cameras.main;
        const t = this.add.text(wx, wy - 8, text, {
            fontSize: '7px',
            color,
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5).setDepth(30);

        this.tweens.add({
            targets: t,
            y: wy - 24,
            alpha: 0,
            duration: 900,
            ease: 'Power2',
            onComplete: () => t.destroy(),
        });
    }

    // ══════════════════════════════════════════════════════
    //  SAVE / LOAD
    // ══════════════════════════════════════════════════════
    _saveGame() {
        const gridData = this.farmGrid.serialize();
        SaveManager.save(gridData);
    }

    _loadSave() {
        const data = SaveManager.load();
        if (!data) return;
        stateManager.restore(data);
        if (data.farmGrid) this.farmGrid.restore(data.farmGrid);
        console.log('[GameScene] Save restored ✓');
    }

    // ══════════════════════════════════════════════════════
    //  HINT
    // ══════════════════════════════════════════════════════
    _showHint(text) {
        this.events.emit('show_hint', text);
        if (this._hintTimer) this._hintTimer.remove(false);
        this._hintTimer = this.time.delayedCall(2500, () => {
            this.events.emit('hide_hint');
        });
    }

    // ══════════════════════════════════════════════════════
    //  UPDATE
    // ══════════════════════════════════════════════════════
    update() {
        this.player.update();
    }

    shutdown() {
        this._saveGame();
        this.timeManager.destroy();
        this.weatherSystem.destroy();
        this.fishingSystem.stop();
        window.removeEventListener('beforeunload', () => this._saveGame());
    }
}
