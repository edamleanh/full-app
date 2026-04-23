---
name: phaser-pixel-art
description: Professional 2D pixel art game development with Phaser.js. Includes best practices for crisp rendering, perfect camera setup, tilemap integration, and animation workflows. Use when creating or optimizing a pixel art game in Phaser.js to ensure retro aesthetics are maintained throughout the pipeline.
---

# Phaser Pixel Art Skill

This skill provides specialized guidance for creating high-quality pixel art games using Phaser.js.

## Core Configuration

To ensure crisp pixels and avoid blurring, the following configuration is mandatory:

```javascript
const config = {
    type: Phaser.AUTO,
    pixelArt: true, // This is the single most important setting
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true // Helps avoid jitter during movement
    },
    // ...
};
```

## Resolution and Scaling

Pixel art games are typically designed at small resolutions and scaled up.

- **Design at Native Resolution**: If your sprite is 16x16, your game world should treat it as 16x16.
- **Scaling**: Use the `ScaleManager` or a global `zoom` factor.
- **Presets**: See [config.md](references/config.md) for GameBoy, NES, and Modern Widescreen resolution presets.

## Camera Best Practices

Camera movement in pixel art can cause "pixel bleeding" or jitter if not handled correctly.

- **Round Pixels on Camera**: Ensure the camera also rounds positions.
  ```javascript
  this.cameras.main.roundPixels = true;
  ```
- **Lerp Settings**: Use low lerp values for smooth follow, but ensure `roundPixels` is active.
- **Scaling the Camera**: If you need to zoom in/out, do so in integer steps (1x, 2x, 3x) whenever possible to maintain pixel consistency.

## Tilemaps & Tiled

Tilemaps often suffer from "seams" (tiny gaps between tiles).

- **Extrude Tiles**: Use tools like `tile-extruder` to add a 1px border around tiles to prevent bleeding.
- **Tiled Export**: Export as JSON. In Phaser, load using `this.load.tilemapTiledJSON`.
- **Reference**: Detailed workflow in [tilemaps.md](references/tilemaps.md).

## Asset Loading & Filtering

If you load textures dynamically and they appear blurry:

```javascript
// Force nearest neighbor filtering on a specific texture
this.textures.get('my-key').setFilter(Phaser.Textures.FilterMode.NEAREST);
```

## Scaffolding a New Project

Use the provided script to quickly set up a pixel-perfect project structure:
`scripts/scaffold.py`
