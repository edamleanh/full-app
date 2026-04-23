# Tilemaps in Phaser Pixel Art

Integrating tilemaps from Tiled efficiently while avoiding common pitfalls.

## Tiled Map Editor Settings

### Map Properties
- **Orientation**: Orthogonal
- **Tile Layer Format**: Base64 (uncompressed) or CSV recommended for compatibility.
- **Render Order**: Right Down

### Tileset Selection
- Use a single texture for your tileset whenever possible to minimize draw calls.
- **Margin & Spacing**: If you experience "bleeding" (colors from adjacent tiles appearing at the edges), add padding to your tileset using [tile-extruder](https://github.com/nkholski/tile-extruder).
  - Use `margin: 1` and `spacing: 2` in Tiled *after* extruding your tilesheet.

## Loading in Phaser

```javascript
function preload() {
    this.load.image('tiles', 'assets/tiled/tilesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tiled/level1.json');
}

function create() {
    const map = this.make.tilemap({ key: 'map' });
    
    // The first parameter is the name of the tileset in Tiled
    // The second parameter is the key of the image in Phaser
    const tileset = map.addTilesetImage('my_tileset_name', 'tiles');

    // Create layers
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0);

    // Collision
    worldLayer.setCollisionByProperty({ collides: true });
}
```

## Handling Seams and Bleeding

If you see thin lines between tiles:
1. **Extrude your tileset**: This is the most robust fix.
2. **Round Pixels**: Ensure `render: { roundPixels: true }` in your config.
3. **Internal Scale**: Avoid scaling tiles individually. Scale the game resolution or the camera instead.

## Optimization Tips
- **Static vs. Dynamic Layers**: Use `TilemapLayer` (the default) for static geometry. For high-density maps with many layers, consider pre-rendering or using fewer layers.
- **Tile Culling**: Phaser automatically culls tiles outside the camera view. To optimize, avoid creating extremely wide/tall thin layers; keep maps reasonably square or chunked.
