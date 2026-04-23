// src/scenes/UIScene.js
// HUD overlay – Phase 3: Fish entries, weather icons, enhanced shop, notifications

import { stateManager } from '../utils/StateManager.js';
import { CROP_CONFIG }  from '../systems/FarmGrid.js';
import { Weather }      from '../systems/TimeManager.js';

// ── Shop catalog ──────────────────────────────────────
const SHOP_ITEMS = [
    { id: 'radish_seed', name: 'Hạt Củ Cải', buyPrice: 20,  desc: '4 ngày → 60💰',   emoji: '🥬' },
    { id: 'carrot_seed', name: 'Hạt Cà Rốt', buyPrice: 40,  desc: '7 ngày → 130💰',  emoji: '🥕' },
];

// Sell prices (crops + fish)
const SELL_TABLE = {
    radish:    60,   carrot:  130,
    goldfish:  30,   bluefish: 55,   catfish: 80,   salmon: 150,   legendary: 500,
};

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        this._W = W;
        this._H = H;

        this._buildHUD(W, H);
        this._buildInventory(W, H);
        this._buildShop(W, H);
        this._buildHelp(W, H);
        this._buildNotification(W, H);
        this._buildMiniMap(W, H);

        // ── Listen to GameScene events ────────────────────
        const gs = this.scene.get('GameScene');
        gs.events.on('day_changed',      this._onDayChanged,    this);
        gs.events.on('weather_changed',  this._onWeatherChanged, this);
        gs.events.on('time_progress',    this._onTimeProgress,  this);
        gs.events.on('show_inventory',   this._showInventory,   this);
        gs.events.on('hide_inventory',   this._hideInventory,   this);
        gs.events.on('show_shop',        this._showShop,        this);
        gs.events.on('hide_shop',        this._hideShop,        this);
        gs.events.on('fishing_start',    this._onFishingStart,  this);
        gs.events.on('fishing_end',      this._onFishingEnd,    this);
        gs.events.on('show_hint',        this._showHint,        this);
        gs.events.on('hide_hint',        this._hideHint,        this);

        stateManager.events.on('money_changed',     this._onMoneyChanged,     this);
        stateManager.events.on('inventory_changed', this._onInventoryChanged, this);

        this._selectedSeedIndex = 0;
        this._refreshSeedSelector();
    }

    // ══════════════════════════════════════════════════════
    //  BUILD HUD
    // ══════════════════════════════════════════════════════
    _buildHUD(W, H) {
        // ── Status panel (top-left) ────────────────────────
        this._hudPanel = this.add.container(0, 0).setDepth(10);

        const panelBg = this.add.rectangle(2, 2, 118, 54, 0x1a1a2e, 0.82)
            .setOrigin(0).setStrokeStyle(1, 0x2c3e50);

        this._moneyText = this.add.text(8, 6, `💰 ${stateManager.money}`, {
            fontSize: '8px', color: '#f1c40f', fontFamily: 'Courier New'
        });

        this._dayText = this.add.text(8, 18, `📅 Ngày ${stateManager.day}`, {
            fontSize: '8px', color: '#ecf0f1', fontFamily: 'Courier New'
        });

        this._weatherText = this.add.text(8, 30, '☀️ Nắng', {
            fontSize: '7px', color: '#f39c12', fontFamily: 'Courier New'
        });

        this._seedText = this.add.text(8, 41, '', {
            fontSize: '6px', color: '#2ecc71', fontFamily: 'Courier New'
        });

        this._hudPanel.add([panelBg, this._moneyText, this._dayText, this._weatherText, this._seedText]);

        // ── Day progress bar (bottom) ───────────────────────
        this._progressBg  = this.add.rectangle(0, H, W, 4, 0x1a1a2e, 0.7).setOrigin(0, 1).setDepth(10);
        this._progressBar = this.add.rectangle(0, H, 0, 4, 0xf6d860, 1).setOrigin(0, 1).setDepth(11);
        this._progressLabel = this.add.text(2, H - 6, '⏰ Ngày kế', {
            fontSize: '5px', color: '#888', fontFamily: 'Courier New'
        }).setDepth(11);
    }

    // ══════════════════════════════════════════════════════
    //  BUILD INVENTORY
    // ══════════════════════════════════════════════════════
    _buildInventory(W, H) {
        const PW = 180, PH = 140;
        const PX = W / 2 - PW / 2, PY = H / 2 - PH / 2;

        this._invPanel = this.add.container(PX, PY).setDepth(20).setVisible(false);

        const bg = this.add.rectangle(0, 0, PW, PH, 0x1a252f, 0.97)
            .setOrigin(0).setStrokeStyle(1, 0x2c3e50);
        const title = this.add.text(PW/2, 8, '🎒 Túi Đồ', {
            fontSize: '9px', color: '#ecf0f1', fontFamily: 'Courier New'
        }).setOrigin(0.5, 0);

        // Divider
        const div = this.add.rectangle(0, 22, PW, 1, 0x2c3e50).setOrigin(0);

        this._invText = this.add.text(10, 28, '', {
            fontSize: '7px', color: '#bdc3c7', fontFamily: 'Courier New',
            lineSpacing: 3,
            wordWrap: { width: PW - 20 }
        });

        const closeBtn = this.add.text(PW - 8, 4, '✕', {
            fontSize: '9px', color: '#e74c3c', fontFamily: 'Courier New'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this._hideInventory());
        closeBtn.on('pointerover',  () => closeBtn.setAlpha(0.7));
        closeBtn.on('pointerout',   () => closeBtn.setAlpha(1));

        this._invPanel.add([bg, title, div, this._invText, closeBtn]);

        // Seed selector (bottom of screen)
        this._seedLabel = this.add.text(W / 2, H - 20, '', {
            fontSize: '7px', color: '#2ecc71', fontFamily: 'Courier New',
            backgroundColor: '#00000099',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5, 1).setDepth(12);
        this._refreshSeedSelector();
    }

    // ══════════════════════════════════════════════════════
    //  BUILD SHOP
    // ══════════════════════════════════════════════════════
    _buildShop(W, H) {
        const PW = 190, PH = 170;
        const PX = W / 2 - PW / 2, PY = H / 2 - PH / 2;

        this._shopPanel = this.add.container(PX, PY).setDepth(20).setVisible(false);

        const bg = this.add.rectangle(0, 0, PW, PH, 0x1c1b33, 0.98)
            .setOrigin(0).setStrokeStyle(1, 0xf1c40f);

        const title = this.add.text(PW/2, 7, '🏪 Cửa Hàng', {
            fontSize: '9px', color: '#f1c40f', fontFamily: 'Courier New'
        }).setOrigin(0.5, 0);

        const divBuy  = this.add.text(8, 22, '── 🛒 MUA ──────────────────', {
            fontSize: '6px', color: '#7f8c8d', fontFamily: 'Courier New'
        });

        // Buy items
        this._shopBuyItems = [];
        SHOP_ITEMS.forEach((item, i) => {
            const y = 32 + i * 30;
            const nameT = this.add.text(10, y,     `${item.emoji} ${item.name}`, { fontSize: '7px', color: '#ecf0f1', fontFamily: 'Courier New' });
            const descT = this.add.text(10, y + 9, item.desc, { fontSize: '6px', color: '#95a5a6', fontFamily: 'Courier New' });
            const btn   = this.add.text(PW - 10, y + 4, `${item.buyPrice}💰 Mua`, {
                fontSize: '7px', color: '#2ecc71', fontFamily: 'Courier New',
                backgroundColor: '#1a5e2f88', padding: { x: 3, y: 2 }
            }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => this._buyItem(item));
            btn.on('pointerover',  () => btn.setStyle({ backgroundColor: '#27ae6088' }));
            btn.on('pointerout',   () => btn.setStyle({ backgroundColor: '#1a5e2f88' }));
            this._shopPanel.add([nameT, descT, btn]);
        });

        // Sell section
        const divSell = this.add.text(8, 96, '── 💰 BÁN ──────────────────', {
            fontSize: '6px', color: '#7f8c8d', fontFamily: 'Courier New'
        });

        this._sellBtn = this.add.text(10, 108, '📦 Bán tất cả (+0💰)', {
            fontSize: '7px', color: '#e67e22', fontFamily: 'Courier New',
            backgroundColor: '#7d370044', padding: { x: 4, y: 3 }
        }).setInteractive({ useHandCursor: true });
        this._sellBtn.on('pointerdown', () => this._sellAll());
        this._sellBtn.on('pointerover',  () => this._sellBtn.setAlpha(0.8));
        this._sellBtn.on('pointerout',   () => this._sellBtn.setAlpha(1));

        // Sell breakdown text
        this._sellBreakdown = this.add.text(10, 124, '', {
            fontSize: '5px', color: '#888', fontFamily: 'Courier New', lineSpacing: 2
        });

        const closeBtn = this.add.text(PW - 8, 4, '✕', {
            fontSize: '9px', color: '#e74c3c', fontFamily: 'Courier New'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this._hideShop());
        closeBtn.on('pointerover',  () => closeBtn.setAlpha(0.7));
        closeBtn.on('pointerout',   () => closeBtn.setAlpha(1));

        this._shopPanel.add([bg, title, divBuy, divSell, this._sellBtn, this._sellBreakdown, closeBtn]);
        this._updateSellButton();
    }

    // ══════════════════════════════════════════════════════
    //  BUILD HELP
    // ══════════════════════════════════════════════════════
    _buildHelp(W, H) {
        const helpLines = [
            'WASD / ↑↓←→  Di chuyển',
            'E  Cuốc/Trồng/Tưới/Thu',
            'F  Câu cá (gần ao)',
            'SPACE  Giật cần khi cá cắn',
            'Q  Đổi giống     I  Túi đồ',
            'B  Shop          N  Ngủ (gần nhà)',
            'ESC  Đóng panel',
        ];

        const lineH = 8;
        const totalH = helpLines.length * lineH + 10;
        this.add.rectangle(W - 2, 2, 120, totalH, 0x000000, 0.55)
            .setOrigin(1, 0).setDepth(10);

        this.add.text(W - 6, 6, helpLines.join('\n'), {
            fontSize: '5.5px', color: '#bdc3c7', fontFamily: 'Courier New',
            align: 'right', lineSpacing: 2
        }).setOrigin(1, 0).setDepth(11);
    }

    // ══════════════════════════════════════════════════════
    //  BUILD NOTIFICATION (hint)
    // ══════════════════════════════════════════════════════
    _buildNotification(W, H) {
        this._hintText = this.add.text(W / 2, H - 28, '', {
            fontSize: '7px', color: '#ffffff', fontFamily: 'Courier New',
            backgroundColor: '#00000099', padding: { x: 8, y: 4 },
            stroke: '#000', strokeThickness: 1,
        }).setOrigin(0.5, 1).setDepth(15).setVisible(false);
    }

    // ══════════════════════════════════════════════════════
    //  MINI MAP
    // ══════════════════════════════════════════════════════
    _buildMiniMap(W, H) {
        const MW = 56, MH = 42;
        const MX = W - MW - 4, MY = H - MH - 8;
        const SCALE_X = MW / 512, SCALE_Y = MH / 384;

        this._mapContainer = this.add.container(MX, MY).setDepth(12);

        const mapBg = this.add.rectangle(0, 0, MW, MH, 0x1a252f, 0.85)
            .setOrigin(0).setStrokeStyle(1, 0x2c3e50);

        // Map zones (miniature)
        const farmDot = this.add.rectangle(80 * SCALE_X, 64 * SCALE_Y, 8 * 16 * SCALE_X, 6 * 16 * SCALE_Y, 0x8B5E3C, 0.8).setOrigin(0);
        const pondDot = this.add.circle(360 * SCALE_X, 72 * SCALE_Y, 8, 0x2980b9, 0.8);
        const shopDot = this.add.rectangle(440 * SCALE_X - 3, 260 * SCALE_Y - 3, 6, 6, 0x8e44ad).setOrigin(0);
        const houseDot= this.add.rectangle(14 * SCALE_X, 64 * SCALE_Y, 5, 5, 0x8d6e4a).setOrigin(0);

        // Player dot (updated in update loop)
        this._mapPlayerDot = this.add.circle(0, 0, 2, 0x3498db).setDepth(1);

        this._mapContainer.add([mapBg, farmDot, pondDot, shopDot, houseDot]);
        this._mapContainer.add(this._mapPlayerDot);

        this._mapScaleX = SCALE_X;
        this._mapScaleY = SCALE_Y;
        this._mapOffsetX = MX;
        this._mapOffsetY = MY;
    }

    // ══════════════════════════════════════════════════════
    //  EVENT HANDLERS
    // ══════════════════════════════════════════════════════

    _onMoneyChanged(val) {
        this._moneyText.setText(`💰 ${val}`);
        this._updateSellButton();
    }

    _onInventoryChanged() {
        this._refreshInventoryText();
        this._updateSellButton();
    }

    _onDayChanged(day) {
        this._dayText.setText(`📅 Ngày ${day}`);
    }

    _onWeatherChanged(weather) {
        const labels = {
            [Weather.SUNNY]:  '☀️ Nắng',
            [Weather.RAINY]:  '🌧️ Mưa',
            [Weather.CLOUDY]: '⛅ Mây',
        };
        const colors = {
            [Weather.SUNNY]:  '#f39c12',
            [Weather.RAINY]:  '#3498db',
            [Weather.CLOUDY]: '#95a5a6',
        };
        this._weatherText.setText(labels[weather] ?? '');
        this._weatherText.setColor(colors[weather] ?? '#fff');
    }

    _onTimeProgress(progress) {
        this._progressBar.width = this._W * progress;
    }

    _showInventory() { this._invPanel.setVisible(true); this._refreshInventoryText(); }
    _hideInventory() { this._invPanel.setVisible(false); }

    _showShop() { this._shopPanel.setVisible(true); this._updateSellButton(); }
    _hideShop() { this._shopPanel.setVisible(false); }

    _showHint(text) { this._hintText.setText(text).setVisible(true); }
    _hideHint()     { this._hintText.setVisible(false); }

    _onFishingStart() {
        // Show minimal "fishing…" indicator
        this._hintText.setText('🎣 Đang chờ cá...').setVisible(true);
    }

    _onFishingEnd() {
        this._hintText.setVisible(false);
    }

    // ══════════════════════════════════════════════════════
    //  SHOP LOGIC
    // ══════════════════════════════════════════════════════

    _buyItem(item) {
        if (stateManager.spendMoney(item.buyPrice)) {
            stateManager.addItem(item.id, 1);
            this._showToast(`✅ Đã mua ${item.emoji} ${item.name}!`, 0x2ecc71);
        } else {
            this._showToast('❌ Không đủ tiền!', 0xe74c3c);
        }
    }

    _sellAll() {
        let total = 0;
        const sold = [];
        for (const [id, price] of Object.entries(SELL_TABLE)) {
            const qty = stateManager.inventory[id] || 0;
            if (qty > 0) {
                total += qty * price;
                sold.push(`${id}×${qty}`);
                stateManager.removeItem(id, qty);
            }
        }
        if (total > 0) {
            stateManager.addMoney(total);
            this._showToast(`+${total}💰 đã bán!`, 0xf1c40f);
        } else {
            this._showToast('Không có gì để bán!', 0x95a5a6);
        }
    }

    _updateSellButton() {
        if (!this._sellBtn) return;

        let total = 0;
        const lines = [];
        for (const [id, price] of Object.entries(SELL_TABLE)) {
            const qty = stateManager.inventory[id] || 0;
            if (qty > 0) {
                const sub = qty * price;
                total += sub;
                lines.push(`  ${id}×${qty} = ${sub}💰`);
            }
        }
        this._sellBtn.setText(`📦 Bán tất cả (+${total}💰)`);
        this._sellBreakdown?.setText(lines.slice(0, 5).join('\n'));
    }

    // ══════════════════════════════════════════════════════
    //  INVENTORY TEXT
    // ══════════════════════════════════════════════════════

    _refreshInventoryText() {
        const inv = stateManager.inventory;
        if (!Object.keys(inv).length) {
            this._invText.setText('(Túi rỗng)');
            return;
        }

        const ICONS = {
            radish_seed: '🥬', carrot_seed: '🥕',
            radish: '🫚', carrot: '🥕',
            goldfish: '🐟', bluefish: '🐠', catfish: '🎣',
            salmon: '🍣', legendary: '✨',
        };

        const lines = Object.entries(inv).map(([id, qty]) => {
            const icon = ICONS[id] || '•';
            return `${icon} ${id}: ${qty}`;
        });
        this._invText.setText(lines.join('\n'));
    }

    // ══════════════════════════════════════════════════════
    //  SEED SELECTOR
    // ══════════════════════════════════════════════════════

    _refreshSeedSelector() {
        const seeds = Object.keys(CROP_CONFIG);
        const current = seeds[this._selectedSeedIndex % seeds.length];
        const cfg = CROP_CONFIG[current];
        const qty = stateManager.inventory[current] || 0;
        this._seedLabel?.setText(`[Q] ${cfg?.name || current} (${qty})`);
        this._seedText?.setText(`🌱 ${cfg?.name || current}`);
        this.scene.get('GameScene')?.events.emit('seed_changed', current);
    }

    cycleSeed() {
        const count = Object.keys(CROP_CONFIG).length;
        this._selectedSeedIndex = (this._selectedSeedIndex + 1) % count;
        this._refreshSeedSelector();
    }

    // ══════════════════════════════════════════════════════
    //  TOAST NOTIFICATION
    // ══════════════════════════════════════════════════════

    _showToast(msg, color = 0xffffff) {
        const W = this._W, H = this._H;
        const hexStr = '#' + color.toString(16).padStart(6, '0');
        const t = this.add.text(W / 2, H / 2 - 30, msg, {
            fontSize: '9px', color: hexStr,
            fontFamily: 'Courier New', backgroundColor: '#000000cc',
            padding: { x: 8, y: 4 }, stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(40);

        this.tweens.add({
            targets: t,
            y: H / 2 - 55,
            alpha: 0,
            duration: 1400,
            ease: 'Cubic.Out',
            onComplete: () => t.destroy()
        });
    }

    // ══════════════════════════════════════════════════════
    //  UPDATE – mini map player dot
    // ══════════════════════════════════════════════════════

    update() {
        const gs = this.scene.get('GameScene');
        if (!gs?.player || !this._mapPlayerDot) return;
        this._mapPlayerDot.setPosition(
            gs.player.x * this._mapScaleX,
            gs.player.y * this._mapScaleY
        );
    }
}
