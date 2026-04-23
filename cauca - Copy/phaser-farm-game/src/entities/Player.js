// src/entities/Player.js
// Nhân vật người chơi – dùng Sprout Lands spritesheet (48×48 per frame)

const SPEED = 70;

export default class Player {
    constructor(scene, x, y) {
        this.scene     = scene;
        this._facing   = 'down';
        this._speed    = SPEED;

        // ── Sprite ──────────────────────────────────────────
        this.sprite = scene.physics.add.sprite(x, y, 'sl_player', 0)
            .setDepth(10)
            .setOrigin(0.5, 1)        // feet pivot (bottom-center)
            .setScale(0.85);          // slightly scaled down to fit world

        // Hitbox: nhỏ hơn sprite (feet area)
        this.sprite.body.setSize(12, 10);
        this.sprite.body.setOffset(18, 36); // 48-wide, offset to feet area
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.setMaxVelocity(SPEED, SPEED);

        // ── Shadow (simple ellipse under feet) ─────────────
        this._shadow = scene.add.ellipse(x, y + 2, 16, 6, 0x000000, 0.3).setDepth(9);

        // ── Input ───────────────────────────────────────────
        this._cursors = scene.input.keyboard.createCursorKeys();
        this._wasd    = scene.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Start idle
        this.sprite.play('idle_down');
    }

    // ── Public getters ────────────────────────────────────

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }

    /** Trả về vị trí phía trước mặt nhân vật */
    getFacingPosition(dist = 16) {
        const offsets = {
            down:  { x: 0,     y: dist  },
            up:    { x: 0,     y: -dist },
            left:  { x: -dist, y: 0     },
            right: { x: dist,  y: 0     },
        };
        const o = offsets[this._facing];
        // Dùng feet anchor (sprite.y là đáy)
        return { x: this.sprite.x + o.x, y: this.sprite.y - 4 + o.y };
    }

    // ── Update ────────────────────────────────────────────

    update() {
        const vx = (this._cursors.left.isDown  || this._wasd.left.isDown  ? -1 : 0) +
                   (this._cursors.right.isDown || this._wasd.right.isDown ? 1 : 0);
        const vy = (this._cursors.up.isDown    || this._wasd.up.isDown    ? -1 : 0) +
                   (this._cursors.down.isDown  || this._wasd.down.isDown  ? 1 : 0);

        const moving = vx !== 0 || vy !== 0;

        this.sprite.setVelocity(vx * SPEED, vy * SPEED);

        if (moving) {
            // Set facing + play animation
            if      (vx < 0)  { this._facing = 'left';  }
            else if (vx > 0)  { this._facing = 'right'; }
            else if (vy < 0)  { this._facing = 'up';    }
            else if (vy > 0)  { this._facing = 'down';  }

            const walkAnim = `walk_${this._facing}`;
            if (this.sprite.anims.currentAnim?.key !== walkAnim) {
                this.sprite.play(walkAnim);
            }
        } else {
            // Idle
            const idleAnim = `idle_${this._facing}`;
            if (this.sprite.anims.currentAnim?.key !== idleAnim) {
                this.sprite.play(idleAnim);
            }
        }

        // Move shadow
        this._shadow.setPosition(this.sprite.x, this.sprite.y + 1);

        // Depth by Y (objects lower on screen = drawn on top)
        this.sprite.setDepth(10 + this.sprite.y * 0.01);
    }

    /** Chơi animation cuốc/trồng rồi quay về idle */
    playInteractAnim() {
        const action = `action_${this._facing}`;
        this.sprite.play(action);
        this.sprite.once('animationcomplete', () => {
            this.sprite.play(`idle_${this._facing}`);
        });
    }
}
