# Phaser Pixel Art Configuration Presets

Use these configuration sets to quickly target specific console aesthetics or modern retro styles.

## 1. Low-Res Retro (GameBoy Style)
Targeting the 4-color, low-resolution aesthetic.

- **Resolution**: 160 x 144
- **Aspect Ratio**: 10:9
- **Config**:
```javascript
const config = {
    width: 160,
    height: 144,
    zoom: 4, // Scales to 640x576
    pixelArt: true,
    render: { roundPixels: true }
};
```

## 2. Classic Arcade / 8-Bit (NES/SNES Style)
Standard definition for classic console gaming.

- **Resolution**: 256 x 240 (NES) or 320 x 240 (SNES/Arcade)
- **Aspect Ratio**: 4:3
- **Config**:
```javascript
const config = {
    width: 320,
    height: 240,
    zoom: 3, // Scales to 960x720
    pixelArt: true,
    render: { roundPixels: true }
};
```

## 3. Modern Widescreen Pixel (16:9)
Ideal for modern desktop and web deployment.

- **Resolution**: 640 x 360 or 480 x 270
- **Aspect Ratio**: 16:9
- **Config**:
```javascript
const config = {
    width: 640,
    height: 360,
    zoom: 2, // Scales to 1280x720
    pixelArt: true,
    render: { roundPixels: true }
};
```

---

## Scaling Best Practices

### Scaling Modes
Phaser 3 offers several scale modes in the `config.scale` object:
- `Phaser.Scale.FIT`: Scales the game to fill the container while maintaining aspect ratio.
- `Phaser.Scale.ENVELOP`: Fills the container, potentially cropping some of the game.

### Example Scale Config
```javascript
scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
}
```
