// src/systems/WeatherSystem.js
// Hệ thống thời tiết với particle rain, cloud overlay, lighting effects

import { Weather } from './TimeManager.js';

export class WeatherSystem {
    constructor(scene, worldW, worldH) {
        this.scene  = scene;
        this.worldW = worldW;
        this.worldH = worldH;

        this._current  = Weather.SUNNY;
        this._overlay  = null;
        this._emitter  = null;
        this._lightOverlay = null;

        this._buildRainTexture();
        this._buildLightOverlay();
    }

    // ── Private ────────────────────────────────────────────

    _buildRainTexture() {
        if (this.scene.textures.exists('raindrop')) return;
        const canvas = document.createElement('canvas');
        canvas.width = 2; canvas.height = 6;
        const ctx = canvas.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 0, 6);
        g.addColorStop(0, 'rgba(174,214,241,0)');
        g.addColorStop(1, 'rgba(174,214,241,0.85)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 2, 6);
        this.scene.textures.addCanvas('raindrop', canvas);
    }

    _buildLightOverlay() {
        // Overlay lầy lờ giả light/dark (fixed to camera)
        this._lightOverlay = this.scene.add
            .rectangle(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height,
                0x000000, 0)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(50);
    }

    _createRainEmitter() {
        if (this._emitter) return;

        const particles = this.scene.add.particles(0, 0, 'raindrop', {
            x: { min: -20, max: this.worldW + 20 },
            y: { min: -10, max: 0 },
            speedX:  { min: 15, max: 25 },
            speedY:  { min: 120, max: 180 },
            lifespan: 1200,
            quantity: 3,
            frequency: 30,
            alpha: { start: 0.8, end: 0 },
            scaleX: 0.8,
            scaleY: { min: 0.8, max: 1.2 },
            angle: 0,
            gravityY: 0,
            blendMode: 'ADD',
            depth: 9,
        });
        this._emitter = particles;
    }

    _destroyRainEmitter() {
        if (this._emitter) {
            this._emitter.destroy();
            this._emitter = null;
        }
    }

    // ── Public ─────────────────────────────────────────────

    setWeather(weather) {
        if (this._current === weather) return;
        this._current = weather;

        // Weather overlay (camera-fixed)
        if (this._overlay) { this._overlay.destroy(); this._overlay = null; }

        const overlayConfigs = {
            [Weather.RAINY]:  { color: 0x2c80b8, alpha: 0.15 },
            [Weather.CLOUDY]: { color: 0x7f8c8d, alpha: 0.08 },
            [Weather.SUNNY]:  { color: 0xffd04b, alpha: 0 },
        };
        const cfg = overlayConfigs[weather] || overlayConfigs[Weather.SUNNY];

        if (cfg.alpha > 0) {
            this._overlay = this.scene.add
                .rectangle(0, 0, this.worldW, this.worldH, cfg.color, cfg.alpha)
                .setOrigin(0)
                .setDepth(8)
                .setScrollFactor(1);
        }

        // Light tween
        const lightAlpha = { [Weather.RAINY]: 0.12, [Weather.CLOUDY]: 0.06, [Weather.SUNNY]: 0 };
        this.scene.tweens.add({
            targets: this._lightOverlay,
            alpha: lightAlpha[weather] ?? 0,
            duration: 800,
            ease: 'Sine.easeInOut',
        });

        // Rain particles
        if (weather === Weather.RAINY) {
            this._createRainEmitter();
            // Shake camera slightly during rain transition
            this.scene.cameras.main.shake(300, 0.003);
        } else {
            this._destroyRainEmitter();
        }

        // Sun rays for sunny weather
        if (weather === Weather.SUNNY && this._lastWeather === Weather.RAINY) {
            this._flashBright();
        }
        this._lastWeather = weather;
    }

    _flashBright() {
        const flash = this.scene.add
            .rectangle(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height,
                0xffffff, 0.3)
            .setOrigin(0).setScrollFactor(0).setDepth(60);
        this.scene.tweens.add({
            targets: flash, alpha: 0, duration: 600,
            onComplete: () => flash.destroy()
        });
    }

    destroy() {
        this._destroyRainEmitter();
        if (this._overlay) this._overlay.destroy();
        if (this._lightOverlay) this._lightOverlay.destroy();
    }
}
