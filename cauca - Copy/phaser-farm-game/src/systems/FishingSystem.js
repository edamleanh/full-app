// src/systems/FishingSystem.js
// Hệ thống câu cá nâng cấp: có nhiều loại cá, skill check, animations

export const FISH_TABLE = [
    { id: 'goldfish',  name: 'Cá Vàng',   sellPrice: 30,  rarity: 0.45, emoji: '🐟', color: 0xf39c12 },
    { id: 'bluefish',  name: 'Cá Xanh',   sellPrice: 55,  rarity: 0.3,  emoji: '🐠', color: 0x2e86c1 },
    { id: 'catfish',   name: 'Cá Trê',    sellPrice: 80,  rarity: 0.15, emoji: '🎣', color: 0x707b7c },
    { id: 'salmon',    name: 'Cá Hồi',    sellPrice: 150, rarity: 0.07, emoji: '🍣', color: 0xe67e22 },
    { id: 'legendary', name: 'Cá Huyền Thoại', sellPrice: 500, rarity: 0.03, emoji: '✨', color: 0xf1c40f },
];

function rollFish() {
    const roll = Math.random();
    let cumulative = 0;
    for (const fish of FISH_TABLE) {
        cumulative += fish.rarity;
        if (roll <= cumulative) return fish;
    }
    return FISH_TABLE[0];
}

export class FishingSystem {
    constructor(scene, pondX, pondY, pondR) {
        this.scene  = scene;
        this.pondX  = pondX;
        this.pondY  = pondY;
        this.pondR  = pondR;

        this._active   = false;
        this._bobber   = null;
        this._line     = null;
        this._nibbleTimer = null;
        this._reelWindow  = null;
    }

    get isActive() { return this._active; }

    /**
     * Bắt đầu câu cá.
     * @param {number} playerX
     * @param {number} playerY
     * @param {{ onCatch, onFail }} callbacks
     */
    start(playerX, playerY, { onCatch, onFail }) {
        if (this._active) return;
        this._active   = true;
        this._callbacks = { onCatch, onFail };

        // Cast bobber animation (arc tween)
        const targetX = this.pondX + Phaser.Math.Between(-10, 10);
        const targetY = this.pondY + Phaser.Math.Between(-8, 8);

        this._line   = this.scene.add.graphics().setDepth(6);
        this._bobberX = playerX;
        this._bobberY = playerY;

        if (this.scene.textures.exists('bobber')) {
            this._bobber = this.scene.add.sprite(playerX, playerY, 'bobber', 0)
                .setDepth(7).setDisplaySize(8, 8);
        } else {
            this._bobber = this.scene.add.circle(playerX, playerY, 3, 0xe74c3c).setDepth(7);
        }

        // Arc cast
        this.scene.tweens.add({
            targets: this._bobber,
            x: targetX,
            y: targetY,
            ease: 'Power2',
            duration: 500,
            onUpdate: () => this._drawLine(playerX, playerY),
            onComplete: () => {
                this._bobberX = targetX;
                this._bobberY = targetY;
                if (this._bobber.play) this._bobber.play('bobber_float');
                this._waitForNibble();
            }
        });

        // Fishing "splash" on land
        this.scene.cameras.main.shake(80, 0.002);
    }

    _drawLine(playerX, playerY) {
        if (!this._line || !this._bobber) return;
        this._line.clear();
        this._line.lineStyle(1, 0xffffff, 0.6);
        this._line.lineBetween(playerX, playerY, this._bobber.x, this._bobber.y);
    }

    _waitForNibble() {
        // Random wait 2–6 seconds before fish nibbles
        const delay = Phaser.Math.Between(2000, 6000);
        this._nibbleTimer = this.scene.time.delayedCall(delay, () => {
            if (!this._active) return;
            this._nibble();
        });
    }

    _nibble() {
        if (!this._active || !this._bobber) return;

        // Bobber dips 3 times
        let dips = 0;
        const dip = () => {
            if (!this._active) return;
            if (this._bobber?.setFrame) this._bobber.setFrame(1);
            this.scene.cameras.main.shake(40, 0.001);
            this.scene.time.delayedCall(300, () => {
                if (this._bobber?.setFrame) this._bobber.setFrame(0);
                dips++;
                if (dips < 3) {
                    this.scene.time.delayedCall(Phaser.Math.Between(200, 500), dip);
                } else {
                    // Open reel window – player has 1.5s to press SPACE
                    this._openReelWindow();
                }
            });
        };
        dip();
    }

    _openReelWindow() {
        if (!this._active) return;
        const W = this.scene.cameras.main.width;
        const H = this.scene.cameras.main.height;

        // Flash exclamation
        const excl = this.scene.add.text(W/2, H/2 - 40, '❗ GIẬT CẦN!', {
            fontSize: '10px', color: '#e74c3c', fontFamily: 'Courier New',
            backgroundColor: '#ffffffcc', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.scene.tweens.add({
            targets: excl,
            scaleX: 1.3, scaleY: 1.3,
            duration: 150, yoyo: true, repeat: 2,
        });

        // Accept SPACE within window
        const spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const caught = { done: false };

        const onSpace = () => {
            if (caught.done) return;
            caught.done = true;
            excl.destroy();
            timeout.remove(false);
            spaceKey.removeAllListeners();
            this._reel(true);
        };

        spaceKey.once('down', onSpace);

        const timeout = this.scene.time.delayedCall(1500, () => {
            if (caught.done) return;
            caught.done = true;
            excl.destroy();
            spaceKey.removeAllListeners();
            this._reel(false);
        });
    }

    _reel(success) {
        this._cleanup();
        this.scene.time.delayedCall(100, () => {
            if (success) {
                const fish = rollFish();
                this._callbacks.onCatch(fish);
            } else {
                this._callbacks.onFail();
            }
        });
    }

    _cleanup() {
        this._active = false;
        if (this._nibbleTimer) { this._nibbleTimer.remove(false); this._nibbleTimer = null; }
        if (this._bobber) { this._bobber.destroy(); this._bobber = null; }
        if (this._line)   { this._line.destroy();   this._line = null; }
    }

    stop() {
        this._cleanup();
    }
}
