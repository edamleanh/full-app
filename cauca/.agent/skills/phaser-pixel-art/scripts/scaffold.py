import os
import sys
import argparse

def create_structure(base_path):
    directories = [
        "assets/sprites",
        "assets/tiled",
        "assets/audio",
        "src/scenes",
        "src/objects"
    ]
    for directory in directories:
        os.makedirs(os.path.join(base_path, directory), exist_ok=True)
        print(f"Created directory: {directory}")

def create_index_html(base_path):
    content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phaser Pixel Art Game</title>
    <style>
        body { margin: 0; background: #000; overflow: hidden; }
        canvas { display: block; margin: 0 auto; image-rendering: pixelated; }
    </style>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
    <script src="src/main.js" type="module"></script>
</body>
</html>
"""
    with open(os.path.join(base_path, "index.html"), "w") as f:
        f.write(content)
    print("Created index.html")

def create_main_js(base_path, width, height, zoom):
    content = f"""import {{ BootScene }} from './scenes/BootScene.js';
import {{ MainScene }} from './scenes/MainScene.js';

const config = {{
    type: Phaser.AUTO,
    width: {width},
    height: {height},
    zoom: {zoom},
    pixelArt: true,
    roundPixels: true,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {{
        default: 'arcade',
        arcade: {{
            gravity: {{ y: 0 }},
            debug: false
        }}
    }},
    scene: [BootScene, MainScene]
}};

const game = new Phaser.Game(config);
"""
    with open(os.path.join(base_path, "src", "main.js"), "w") as f:
        f.write(content)
    print("Created src/main.js")

def create_scenes(base_path):
    boot_content = """export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load loading bar or splash screen assets here
        console.log('BootScene Preload');
    }

    create() {
        this.scene.start('MainScene');
    }
}
"""
    main_content = """export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // Load game assets here
        console.log('MainScene Preload');
    }

    create() {
        this.add.text(10, 10, 'Hello Pixel Art!', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#ffffff'
        });
        
        console.log('MainScene Created');
    }

    update() {
        // Core game loop
    }
}
"""
    with open(os.path.join(base_path, "src", "scenes", "BootScene.js"), "w") as f:
        f.write(boot_content)
    with open(os.path.join(base_path, "src", "scenes", "MainScene.js"), "w") as f:
        f.write(main_content)
    print("Created BootScene.js and MainScene.js")

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new Phaser Pixel Art project.")
    parser.add_argument("--path", default=".", help="Target directory for the project.")
    parser.add_argument("--width", type=int, default=320, help="Game design width.")
    parser.add_argument("--height", type=int, default=240, help="Game design height.")
    parser.add_argument("--zoom", type=int, default=3, help="Default scale zoom.")

    args = parser.parse_args()
    
    base_path = os.path.abspath(args.path)
    print(f"Scaffolding project in: {base_path}")
    
    create_structure(base_path)
    create_index_html(base_path)
    create_main_js(base_path, args.width, args.height, args.zoom)
    create_scenes(base_path)
    
    print("\\n[OK] Phaser Pixel Art project successfully scaffolded!")
    print("To start, run a local web server in the project directory.")

if __name__ == "__main__":
    main()
