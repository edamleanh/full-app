// ============================================================
// js/features/pokemon_parade.js  v3 — Real Sprite Images
// Sử dụng PokeAPI sprites PNG thực tế
// ============================================================

(function () {
    const STORAGE_KEY = 'acs_pokemon_parade_enabled';

    const POKEMON_LIST = [
        // dur: tốc độ (giây) — 7 con thì dùng 7s để mỗi con cách nhau đúng 1s
        // delay: khoảng cách — cách đều = dur / số_con = 7 / 7 = 1 giây
        { img: 'img/pokemon/pikachu.png',   name: 'Pikachu',                 glow: '#FFD700', dur: 7, delay: 0, size: 50 },
        { img: 'img/pokemon/cubone.png',    name: 'Cubone (Karakara)',       glow: '#C4A35A', dur: 7, delay: 1, size: 60 },
        { img: 'img/pokemon/corgi.png',     name: 'Corgi',                   glow: '#FFA000', dur: 7, delay: 2, size: 30 },
        { img: 'img/pokemon/pichu.png',     name: 'Pichu',                   glow: '#FFE066', dur: 7, delay: 3, size: 65 },
        { img: 'img/pokemon/raichu.png',    name: 'Raichu',                  glow: '#FF9800', dur: 7, delay: 4, size: 45 },
        { img: 'img/pokemon/bulbasaur.png', name: 'Bulbasaur (Fushigidane)', glow: '#81C784', dur: 7, delay: 5, size: 60 },
        { img: 'img/pokemon/squirtle.png',  name: 'Squirtle',                glow: '#4FC3F7', dur: 7, delay: 6, size: 55 },
    ];

    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';
    let parade;

    // --- Inject keyframes CSS một lần duy nhất ---
    function injectStyles() {
        if (document.getElementById('pk-styles')) return;
        const style = document.createElement('style');
        style.id = 'pk-styles';
        style.textContent = `
            @keyframes pk-run {
                0%   { left: calc(100% + 60px); }
                100% { left: -60px; }
            }
            @keyframes pk-bob {
                0%, 100% { transform: translateY(-50%) scaleX(1); }
                50%       { transform: translateY(calc(-50% - 5px)) scaleX(1); }
            }
            @keyframes pk-spin {
                from { transform: translate(-50%, -55%) rotate(0deg); }
                to   { transform: translate(-50%, -55%) rotate(360deg); }
            }
            @keyframes pk-trail {
                0%   { opacity: 0.6; transform: scaleX(1); }
                100% { opacity: 0;   transform: scaleX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Tạo runner cho 1 Pokémon ---
    function createRunner(p) {
        const wrap = document.createElement('div');
        wrap.style.cssText = `
            position: absolute;
            top: 65%;
            left: 100%;
            width: 80px;
            height: 80px;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pk-run ${p.dur}s linear infinite;
            animation-delay: -${p.delay}s;
        `;

        // Hào quang vệt sáng phía sau
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: absolute;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 4px;
            background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
            border-radius: 2px;
            filter: blur(1.5px);
            pointer-events: none;
        `;

        // Ảnh Pokémon
        const img = document.createElement('img');
        img.src   = p.img;
        img.title = p.name;
        img.style.cssText = `
            width: ${p.size}px;
            height: ${p.size}px;
            image-rendering: pixelated;
            object-fit: contain;
            filter: drop-shadow(0 0 1.5px rgba(0,0,0,0.5)) drop-shadow(0 0 0.5px rgba(0,0,0,0.3));
        `;

        wrap.appendChild(trail);
        wrap.appendChild(img);
        return wrap;
    }

    // --- Tạo Poké Ball trung tâm ---
    function createPokeball() {
        const ball = document.createElement('div');
        ball.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -55%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(180deg, #e53935 50%, #fff 50%);
            border: 2px solid #222;
            box-shadow: 0 0 8px rgba(229,57,53,0.5);
            animation: pk-spin 4s linear infinite;
            z-index: 1;
            pointer-events: none;
        `;

        // Đường kẻ ngang
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: #222;
            transform: translateY(-50%);
        `;

        // Nút giữa
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #fff;
            border: 1.5px solid #222;
        `;

        ball.appendChild(line);
        ball.appendChild(dot);
        return ball;
    }

    // --- Bật ---
    function startParade() {
        isEnabled = true;
        localStorage.setItem(STORAGE_KEY, 'true');
        if (!parade) return;

        parade.innerHTML = '';
        injectStyles();
        POKEMON_LIST.forEach(p => parade.appendChild(createRunner(p)));
    }

    // --- Tắt ---
    function stopParade() {
        isEnabled = false;
        localStorage.setItem(STORAGE_KEY, 'false');
        if (parade) parade.innerHTML = '';
    }

    function init() {
        parade = document.getElementById('pokemon-parade');
        if (!parade) return;

        // Xóa canvas cũ nếu còn
        const old = document.getElementById('pokemon-canvas');
        if (old) old.remove();

        if (isEnabled) startParade();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 150);
    }
})();
