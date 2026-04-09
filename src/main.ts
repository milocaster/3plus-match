import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
<div class="screen" id="intro-screen">
    <div class="title">3Plus<br>Match Tile</div>
    <p style="margin-bottom: 2rem;">Match 3 tiles to clear the board!</p>
    <button class="btn-primary" id="btn-start">Start Game</button>
</div>

<div class="screen hidden" id="summary-screen">
    <div id="summary-content">
        <h1 id="win-text">Stage Clear!</h1>
        <p id="win-time">Time: 00:00</p>
        <div id="win-stars" style="font-size:2rem; margin:10px 0;">⭐ ⭐ ⭐</div>
        <p id="gacha-drop" style="color:#ff3366; font-weight:bold; margin-bottom: 20px;"></p>
        <button class="btn-primary" id="btn-next">Next Stage</button>
    </div>
</div>

<div id="game-screen" class="hidden">
    <header>
        <div id="audio-control" title="Toggle Sound">🔊</div>
        <div id="stage-info">Stage: 1</div>
        <div id="timer-info">00:00</div>
        <div id="star-total" style="color:#ff3366; font-weight:bold; text-shadow:0 0 4px #fff;">⭐ 0</div>
    </header>
    <div class="game-area" id="game-area"></div>
    <div class="boosters">
        <div class="booster-btn" id="btn-undo" title="Undo">↩️<div class="booster-count" id="count-undo">2</div></div>
        <div class="booster-btn" id="btn-shuffle" title="Shuffle">🌀<div class="booster-count" id="count-shuffle">2</div></div>
        <div class="booster-btn" id="btn-push" title="Push Out">⬆️<div class="booster-count" id="count-push">2</div></div>
    </div>
    <div class="stash-container" id="stash-tray">
        <div class="tray-slot"></div><div class="tray-slot"></div><div class="tray-slot"></div>
    </div>
    <div class="tray-container">
        <div class="tray" id="tray">
            <div class="tray-slot"></div><div class="tray-slot"></div><div class="tray-slot"></div>
            <div class="tray-slot"></div><div class="tray-slot"></div><div class="tray-slot"></div><div class="tray-slot"></div>
        </div>
    </div>
</div>
`;

const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const summaryScreen = document.getElementById('summary-screen');

const gameArea = document.getElementById('game-area');
const tray = document.getElementById('tray');
const stashTray = document.getElementById('stash-tray');
const timerInfo = document.getElementById('timer-info');
const stageInfo = document.getElementById('stage-info');
const starTotal = document.getElementById('star-total');
const audioControl = document.getElementById('audio-control');

const GRID_CELL = 28;

// Save Progress Logic
let currentStage = parseInt(localStorage.getItem('3p_stage')) || 1;
let stars = parseInt(localStorage.getItem('3p_stars')) || 0;
let items = JSON.parse(localStorage.getItem('3p_items')) || { undo: 2, shuffle: 2, push: 2 };

function saveProgress() {
    localStorage.setItem('3p_stage', currentStage.toString());
    localStorage.setItem('3p_stars', stars.toString());
    localStorage.setItem('3p_items', JSON.stringify(items));
}

let tiles = [];
let trayTiles = [];
let stashTiles = [];
let timeElapsed = 0;
let timerInterval = null;

// Progession Emojis
const emojiTypes = [
    "🐦", "🐱", "🐭", // Stage 1 it will use up to 3
    "🐐", "🐑", "🐄", // Medium stages
    "🐶", "🐢", "🐃", 
    "🦥", "🦊", "🐸", "🐼", "🐵", "🦉" // Hard stages
];

let bgm = new Audio('/matchpic.mp3');
bgm.loop = true;
let isMuted = false;

audioControl.onclick = () => {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    audioControl.innerText = isMuted ? '🔇' : '🔊';
};

document.getElementById('btn-start').onclick = () => {
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    bgm.play().catch(e => console.log('BGM missing'));
    initStage();
};

document.getElementById('btn-next').onclick = () => {
    currentStage++;
    saveProgress();
    summaryScreen.classList.add('hidden');
    initStage();
};

function playPop() {
    if(isMuted) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
}

function playClearHit() {
    if(isMuted) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return m + ":" + s;
}

function updateItemUI() {
    document.getElementById('count-undo').innerText = items.undo;
    document.getElementById('count-shuffle').innerText = items.shuffle;
    document.getElementById('count-push').innerText = items.push;
    starTotal.innerText = "⭐ " + stars;
}

function initStage() {
    updateItemUI();
    tiles = [];
    trayTiles = [];
    stashTiles = [];
    gameArea.innerHTML = '';
    
    stageInfo.innerText = 'Stage: ' + currentStage;
    
    tray.innerHTML = '';
    for(let i=0; i<7; i++) tray.innerHTML += "<div class='tray-slot'></div>";
    stashTray.innerHTML = '';
    for(let i=0; i<3; i++) stashTray.innerHTML += "<div class='tray-slot'></div>";
    
    timeElapsed = 0;
    timerInfo.innerText = formatTime(0);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerInfo.innerText = formatTime(timeElapsed);
    }, 1000);
    
    // Stage 1: 8 triples. Next stages + 2 triples per stage.
    let triplesCount = 8 + Math.floor((currentStage - 1) * 2);
    let totalTiles = triplesCount * 3;
    
    // Scale types: Stage 1 = 3 types. Stage 10+ = 15 types.
    let numTypes = Math.min(3 + Math.floor((currentStage-1)), emojiTypes.length);
    let activeTypes = emojiTypes.slice(0, numTypes);
    
    let typesPool = [];
    for(let i=0; i<triplesCount; i++) {
        let t = activeTypes[i % activeTypes.length];
        typesPool.push(t, t, t);
    }
    typesPool.sort(() => Math.random() - 0.5);
    
    // Build centered structure using random spots from a safe 3D grid
    let maxZ = Math.min(5, 1 + Math.floor(currentStage/3));
    let validSpaces = [];
    
    // Ensure all tiles spawn strictly inside x:[0,8] and y:[0,10] to prevent offscreen bugs
    for(let z=0; z<maxZ; z++) {
        // Higher layers have smaller footprints to form a pyramid naturally
        let smin = z; 
        let smax = 8 - z;
        if(smax < smin) smax = smin;
        for(let x=smin; x<=smax; x++) {
            for(let y=smin; y<=10-z; y++) {
                validSpaces.push({x, y, z});
            }
        }
    }
    
    validSpaces.sort(() => Math.random() - 0.5);
    
    let idCounter = 0;
    for(let i=0; i<totalTiles; i++) {
        let sp = validSpaces[i % validSpaces.length];
        tiles.push({ id: idCounter++, type: typesPool.pop(), x: sp.x, y: sp.y, z: sp.z, inTray: false, inStash: false });
    }

    renderBoard();
}

function checkOverlaps() {
    tiles.forEach(t1 => {
        if(t1.inTray || t1.inStash || t1.element === null) return;
        
        let isLocked = false;
        for(let t2 of tiles) {
            if(t2.inTray || t2.inStash || t2.element === null || t1.id === t2.id) continue;
            
            if(t2.z > t1.z) {
                // AABB check. Tile is 2x2 grid sizes. Add 1.9 to catch visual touch.
                let overlapX = (t1.x < t2.x + 1.9) && (t1.x + 1.9 > t2.x);
                let overlapY = (t1.y < t2.y + 1.9) && (t1.y + 1.9 > t2.y);
                if(overlapX && overlapY) {
                    isLocked = true;
                    break;
                }
            }
        }
        
        if(t1.element) {
            if(isLocked) t1.element.classList.add('locked');
            else t1.element.classList.remove('locked');
            t1.element.style.zIndex = t1.z.toString();
        }
    });
}

function moveToTray(tile) {
    if(trayTiles.length >= 7) return;
    
    playPop();
    tile.inTray = true;
    trayTiles.push(tile);
    trayTiles.sort((a,b) => a.type.localeCompare(b.type));
    
    updateTrayVisuals();
    checkOverlaps();
    
    setTimeout(checkMatches, 200);
}

function checkMatches() {
    const counts = {};
    trayTiles.forEach(t => {
        if(!counts[t.type]) counts[t.type] = [];
        counts[t.type].push(t);
    });
    
    let matchedType = null;
    for(let type in counts) {
        if(counts[type].length >= 3) {
            matchedType = type;
            playClearHit();
            break;
        }
    }
    
    if(matchedType) {
        trayTiles = trayTiles.filter(t => t.type !== matchedType);
        
        tiles.forEach(t => {
             if(t.type === matchedType && (t.inTray || t.inStash) && t.element) {
                 t.element.style.transition = 'transform 0.15s';
                 t.element.style.transform = 'scale(0)';
                 setTimeout(() => { if(t.element) t.element.remove(); t.element = null; }, 150);
                 t.inTray = false;
                 t.inStash = false;
             }
        });
        setTimeout(updateTrayVisuals, 150);
        setTimeout(checkWin, 250);
    } else if(trayTiles.length === 7) {
        clearInterval(timerInterval);
        setTimeout(() => { alert("Game Over! Tray is full.
Tip: Use Push Out to make space!
Try again!"); initStage(); }, 100);
    } else {
        checkWin();
    }
}

function checkWin() {
    const activeTiles = tiles.filter(t => !t.inTray && !t.inStash && t.element !== null);
    if(activeTiles.length === 0 && trayTiles.length === 0 && stashTiles.length === 0) {
        clearInterval(timerInterval);
        setTimeout(showSummary, 100);
    }
}

function showSummary() {
    document.getElementById('win-time').innerText = 'Time: ' + formatTime(timeElapsed);
    
    // Star Logic: Base 1, +1 if <3 min, +1 if <1.5 min
    let earned = 1;
    if(timeElapsed < 180) earned++;
    if(timeElapsed < 90) earned++;
    stars += earned;
    document.getElementById('win-stars').innerText = "⭐".repeat(earned);
    
    const dropTypes = ['undo', 'shuffle', 'push'];
    const names = {'undo':'Undo (↩️)', 'shuffle':'Shuffle (🌀)', 'push':'Push Out (⬆️)'};
    
    const drop = dropTypes[Math.floor(Math.random()*3)];
    items[drop]++;
    
    saveProgress();
    updateItemUI();
    
    document.getElementById('gacha-drop').innerText = "🎁 Bonus Drop: +1 " + names[drop];
    summaryScreen.classList.remove('hidden');
}

function updateTrayVisuals() {
    const slots = tray.querySelectorAll('.tray-slot');
    slots.forEach(s => s.innerHTML = '');
    
    trayTiles.forEach((tile, index) => {
        let el = tile.element;
        if(!el) return;
        el.style.transition = 'none';
        el.style.position = 'relative';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
        el.style.boxShadow = '0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)';
        el.style.transform = 'translateY(-2px) scale(0.95)';
        el.onclick = null;
        slots[index].appendChild(el);
    });
}

function updateStashVisuals() {
    const slots = stashTray.querySelectorAll('.tray-slot');
    slots.forEach(s => s.innerHTML = '');
    
    stashTiles.forEach((tile, index) => {
        let el = tile.element;
        if(!el) return;
        el.style.transition = 'none';
        el.style.position = 'relative';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
        el.style.boxShadow = '0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)';
        el.style.transform = 'translateY(-2px) scale(0.95)';
        
        el.onclick = () => {
            if(trayTiles.length >= 7) return;
            stashTiles = stashTiles.filter(s => s.id !== tile.id);
            tile.inStash = false;
            moveToTray(tile);
            updateStashVisuals();
        };
        slots[index].appendChild(el);
    });
}

function renderBoard() {
    // Dynamic centering calculation based on content width (9 grid units max span)
    let offsetX = (window.innerWidth - 10 * GRID_CELL) / 2;
    let offsetY = 110; // pushed down a bit to clear header safely
    if(offsetX < 10) offsetX = 10;
    
    tiles.forEach(tile => {
        const el = document.createElement('div');
        el.className = 'tile';
        el.innerText = tile.type;
        el.style.zIndex = tile.z.toString();
        el.style.left = (offsetX + tile.x * GRID_CELL) + 'px';
        el.style.top = (offsetY + tile.y * GRID_CELL) + 'px';
        
        el.onclick = () => {
            if(el.classList.contains('locked')) return;
            if(trayTiles.length >= 7) return;
            moveToTray(tile);
        };
        
        tile.element = el;
        gameArea.appendChild(el);
    });
    
    checkOverlaps();
}

// Boosters logic
document.getElementById('btn-push').onclick = () => {
    if(items.push <= 0 || trayTiles.length === 0) return;
    const spaceLeft = 3 - stashTiles.length;
    if(spaceLeft <= 0) { alert('Stash is full!'); return; }
    
    items.push--; updateItemUI(); saveProgress();
    
    const amountToMove = Math.min(spaceLeft, trayTiles.length, 3);
    const toMove = trayTiles.splice(0, amountToMove);
    
    toMove.forEach(t => { t.inTray = false; t.inStash = true; stashTiles.push(t); });
    updateTrayVisuals(); updateStashVisuals(); checkOverlaps();
};

document.getElementById('btn-undo').onclick = () => {
    if(items.undo <= 0 || trayTiles.length === 0) return;
    items.undo--; updateItemUI(); saveProgress();
    
    const t = trayTiles.pop();
    t.inTray = false;
    
    t.element.style.position = 'absolute';
    let offsetX = (window.innerWidth - 10 * GRID_CELL) / 2;
    if(offsetX < 10) offsetX = 10;
    t.element.style.left = (offsetX + t.x * GRID_CELL) + 'px';
    t.element.style.top = (110 + t.y * GRID_CELL) + 'px';
    t.element.style.transform = 'none';
    
    gameArea.appendChild(t.element);
    
    t.element.onclick = () => {
        if(t.element.classList.contains('locked')) return;
        if(trayTiles.length >= 7) return;
        moveToTray(t);
    };
    
    updateTrayVisuals(); checkOverlaps();
};

document.getElementById('btn-shuffle').onclick = () => {
    const activeTiles = tiles.filter(t => !t.inTray && !t.inStash && t.element !== null);
    if(items.shuffle <= 0 || activeTiles.length === 0) return;
    
    items.shuffle--; updateItemUI(); saveProgress();
    
    const types = activeTiles.map(t => t.type);
    types.sort(() => Math.random() - 0.5);
    
    activeTiles.forEach((t, i) => {
        t.type = types[i];
        t.element.innerText = t.type;
        t.element.style.transform = 'scale(0.8)';
        setTimeout(() => t.element.style.transform = 'none', 150);
    });
};
