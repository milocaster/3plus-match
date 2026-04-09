// @ts-nocheck
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
<div class="screen" id="intro-screen">
    <div class="stars-badge" id="intro-stars">⭐ 0</div>
    <div class="title">3Plus<br>Match Tile</div>
    <button class="btn-primary" id="btn-start">Stage Mode</button>
    <button class="btn-alt" style="margin-bottom: 20px;" id="btn-endless">Endless Mode 🔥</button>
    <button class="btn-black" id="btn-impossible">Impossible Mode 💀</button>
    <button class="btn-secondary" id="btn-shop">Reward Shop 🎁</button>
    <button class="btn-secondary" style="background:#888; box-shadow: 0 4px 0 #555; font-size:1rem; padding: 10px 20px; text-shadow:none; margin-top: 15px;" id="btn-reset">Reset Data</button>
</div>

<div class="screen hidden" id="shop-screen">
    <div class="title" style="margin-bottom: 10px;">Rewards Shop</div>
    <div class="stars-badge" id="shop-stars">⭐ 0</div>
    <div class="shop-grid">
        <div class="prize-card">
            <div class="prize-info">
                <h3>SSR STAR CARD</h3>
                <p>Exclusive celebrity photo with signature</p>
            </div>
            <div class="prize-cost" onclick="buyPrize('SSR STAR CARD', 199, '⭐ YOU WON AN SSR STAR CARD! ⭐')">199 ⭐</div>
        </div>
        <div class="prize-card">
            <div class="prize-info">
                <h3>3Plus Premium</h3>
                <p>30 Days Subscription Refcode</p>
            </div>
            <div class="prize-cost" onclick="buyPrize('3Plus Premium', 100, 'YOUR REFCODE: 3PLUS-PREM-XYZ99')">100 ⭐</div>
        </div>
        <div class="prize-card">
            <div class="prize-info">
                <h3>3Plus Points</h3>
                <p>100 Spinner Tickets / Points</p>
            </div>
            <div class="prize-cost" onclick="buyPrize('3Plus Points', 50, '+100 3Plus Points added to your account!')">50 ⭐</div>
        </div>
    </div>
    <button class="btn-primary" style="margin-top:20px;" id="btn-back-menu">Back to Menu</button>
</div>

<div class="screen hidden" id="alert-modal" style="z-index: 200; background: rgba(0,0,0,0.7);">
    <div id="alert-modal-content">
        <h2 id="alert-title" style="color: #ff3366; margin-top:0;">Alert</h2>
        <p id="alert-desc" style="font-size: 1.2rem; margin-bottom: 20px;">Message goes here</p>
        <button class="btn-primary" id="btn-close-alert" style="width:100%;">OK</button>
    </div>
</div>

<div class="screen hidden" id="summary-screen">
    <div class="modal-content">
        <h1 id="win-text">Stage Clear!</h1>
        <p id="win-time" style="font-size: 1.2rem; color: #555;">Time Left: 00:00</p>
        <div id="win-stars" style="font-size:2rem; margin:10px 0;">⭐ ⭐ ⭐</div>
        <p id="gacha-drop" style="color:#ff3366; font-weight:bold; margin-bottom: 20px;"></p>
        <button class="btn-primary" id="btn-next">Next Stage</button>
        <button class="btn-secondary" id="btn-menu" style="width:100%; font-size:1.2rem; padding: 10px;">Main Menu</button>
    </div>
</div>

<div id="game-screen" class="hidden">
    <div id="progress-bar-container"><div id="progress-bar"></div></div>
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
const shopScreen = document.getElementById('shop-screen');
const alertModal = document.getElementById('alert-modal');

const introStars = document.getElementById('intro-stars');
const shopStars = document.getElementById('shop-stars');
const gameArea = document.getElementById('game-area');
const tray = document.getElementById('tray');
const stashTray = document.getElementById('stash-tray');
const timerInfo = document.getElementById('timer-info');
const progressBar = document.getElementById('progress-bar');
const stageInfo = document.getElementById('stage-info');
const starTotal = document.getElementById('star-total');
const audioControl = document.getElementById('audio-control');

const GRID_CELL = 23;

let currentStage = parseInt(localStorage.getItem('3p_stage')) || 1;
let stars = parseInt(localStorage.getItem('3p_stars')) || 0;
let items = JSON.parse(localStorage.getItem('3p_items')) || { undo: 2, shuffle: 2, push: 2 };
let gameMode = 'normal'; 

function saveProgress() {
    localStorage.setItem('3p_stage', currentStage.toString());
    localStorage.setItem('3p_stars', stars.toString());
    localStorage.setItem('3p_items', JSON.stringify(items));
    introStars.innerText = `⭐ ${stars}`;
    shopStars.innerText = `⭐ ${stars}`;
}

window.buyPrize = function(name, cost, message) {
    if(stars >= cost) {
        stars -= cost;
        saveProgress();
        showAlert('Redemption Successful', message);
    } else {
        showAlert('Insufficent Stars', `You need ${cost} ⭐ to redeem this prize.`);
    }
}

function showAlert(title, desc) {
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-desc').innerText = desc;
    alertModal.classList.remove('hidden');
}

document.getElementById('btn-close-alert').onclick = () => {
    alertModal.classList.add('hidden');
}

saveProgress();
const emojis = ["🐦","🐱","🐭","🐐","🐑","🐄","🐶","🐢","🐃","🦥","🦊","🐸","🐼","🐵","🦉"];

let tiles = [], trayTiles = [], stashTiles = [];
let timeRemaining = 1200; 
let timerInterval = null;

let bgmNormalList = [
    new Audio(import.meta.env.BASE_URL + 'matchpic.mp3'),
    new Audio(import.meta.env.BASE_URL + 'matchpic4.mp3'),
    new Audio(import.meta.env.BASE_URL + 'matchpic5.mp3'),
    new Audio(import.meta.env.BASE_URL + 'matchpic6.mp3'),
    new Audio(import.meta.env.BASE_URL + 'matchpic7.mp3')
];
let bgmEndless = new Audio(import.meta.env.BASE_URL + 'matchpic2.mp3');
let bgmImpossible = new Audio(import.meta.env.BASE_URL + 'matchpic3.mp3');

[...bgmNormalList, bgmEndless, bgmImpossible].forEach(a => { a.loop = true; });

let activeBgm = bgmNormalList[0];
let isMuted = false;

function playAudio() {
    [...bgmNormalList, bgmEndless, bgmImpossible].forEach(a => { a.pause(); a.currentTime = 0; });
    if(gameMode === 'endless') activeBgm = bgmEndless;
    else if(gameMode === 'impossible') activeBgm = bgmImpossible;
    else {
        let bgmIndex = (currentStage - 1) % bgmNormalList.length;
        activeBgm = bgmNormalList[bgmIndex];
    }
    
    activeBgm.muted = isMuted;
    const playPromise = activeBgm.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log('Autoplay prevented'));
    }
}

audioControl.onclick = () => {
    isMuted = !isMuted;
    [...bgmNormalList, bgmEndless, bgmImpossible].forEach(a => a.muted = isMuted);
    audioControl.innerText = isMuted ? '🔇' : '🔊';
};

document.getElementById('btn-start').onclick = () => {
    gameMode = 'normal';
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playAudio();
    initStage();
};

document.getElementById('btn-endless').onclick = () => {
    gameMode = 'endless';
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playAudio();
    initStage();
};

document.getElementById('btn-impossible').onclick = () => {
    gameMode = 'impossible';
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playAudio();
    initStage();
};

document.getElementById('btn-shop').onclick = () => {
    introScreen.classList.add('hidden');
    shopScreen.classList.remove('hidden');
};
document.getElementById('btn-back-menu').onclick = () => {
    shopScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
};

document.getElementById('btn-next').onclick = () => {
    saveProgress();
    summaryScreen.classList.add('hidden');
    if (gameMode === 'normal' && currentStage > 11) {
        gameScreen.classList.add('hidden');
        introScreen.classList.remove('hidden');
        clearInterval(timerInterval);
        activeBgm.pause();
    } else {
        initStage();
        playAudio();
    }
};

document.getElementById('btn-menu').onclick = () => {
    summaryScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
    clearInterval(timerInterval);
    activeBgm.pause();
    updateItemUI(); 
};

document.getElementById('btn-reset').onclick = () => {
    if(confirm('Are you sure you want to completely erase all stars, items, and start back at Stage 1?')) {
        localStorage.clear();
        currentStage = 1; stars = 0; items = { undo: 2, shuffle: 2, push: 2 };
        saveProgress();
        updateItemUI();
    }
};


// Audio & Visuals
function playWin() {
    if(isMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(400, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        o.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
        o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.4);
    } catch(e){}
}
function playFail() {
    if(isMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(300, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.5);
    } catch(e){}
}
function playPop() {
    if(isMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(400, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1);
    } catch(e){}
}
function playClearHit() {
    if(isMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(800, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.2);
    } catch(e){}
}
function createParticles(x, y) {
    const colors = ['#ff3366', '#ffed8d', '#ffa530', '#fff'];
    for(let i=0; i<15; i++) {
        let p = document.createElement('div'); p.className = 'particle';
        p.style.left = x + 'px'; p.style.top = y + 'px';
        p.style.background = colors[Math.floor(Math.random()*colors.length)];
        let angle = Math.random() * Math.PI * 2; let dist = 40 + Math.random() * 60;
        p.style.setProperty('--tx', Math.cos(angle)*dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle)*dist + 'px');
        document.body.appendChild(p); setTimeout(() => p.remove(), 600);
    }
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
    
    if (gameMode === 'normal') {
        if (currentStage > 11) {
            document.getElementById('btn-start').innerText = "Game Cleared!";
        } else {
            document.getElementById('btn-start').innerText = "Continue Stage " + currentStage;
        }
    }
}

function initStage() {
    updateItemUI();
    tiles = []; trayTiles = []; stashTiles = [];
    gameArea.innerHTML = '';
    
    if(gameMode === 'impossible') stageInfo.innerText = 'IMPOSSIBLE';
    else if(gameMode === 'endless') stageInfo.innerText = 'ENDLESS';
    else stageInfo.innerText = 'Stage: ' + currentStage;
    
    tray.innerHTML = '';
    for(let i=0; i<7; i++) tray.innerHTML += "<div class='tray-slot'></div>";
    stashTray.innerHTML = '';
    for(let i=0; i<3; i++) stashTray.innerHTML += "<div class='tray-slot'></div>";
    
    clearInterval(timerInterval);
    timeRemaining = 1200; 
    timerInfo.innerText = formatTime(timeRemaining);
    progressBar.style.width = '100%';
    progressBar.style.background = '#4facfe'; 
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerInfo.innerText = formatTime(timeRemaining);
        
        let pct = (timeRemaining / 1200) * 100;
        progressBar.style.width = pct + '%';
        if(timeRemaining < 240) progressBar.style.background = '#ff0000'; 
        else if(timeRemaining < 720) progressBar.style.background = '#ffb347'; 
        
        if(timeRemaining <= 0) {
            clearInterval(timerInterval);
            playFail();
            activeBgm.pause();
            showAlert('Time Out!', 'เวลาหมด 20 นาทีแล้ว! คุณไม่ได้รับดาว');
            if(gameMode !== 'normal') { gameScreen.classList.add('hidden'); introScreen.classList.remove('hidden'); }
            else { initStage(); playAudio(); } 
        }
    }, 1000);
    
    let simulatedStage = currentStage;
    if(gameMode === 'endless') simulatedStage = 12;
    if(gameMode === 'impossible') simulatedStage = 33;
    
    let triplesCount = 8 + Math.floor((simulatedStage - 1) * 2);
    let totalTiles = triplesCount * 3;
    
    let numTypes = Math.min(3 + Math.floor((simulatedStage-1)), emojis.length);
    let activeTypes = emojis.slice(0, numTypes);
    
    let typesPool = [];
    for(let i=0; i<triplesCount; i++) {
        let t = activeTypes[i % activeTypes.length];
        typesPool.push(t, t, t);
    }
    typesPool.sort(() => Math.random() - 0.5);
    
    let maxZ = Math.min(6, 1 + Math.floor(simulatedStage/3));
    let validSpaces = [];
    
    for(let z=0; z<maxZ; z++) {
        let smin = parseInt(z/2); 
        let smaxX = 8 - parseInt(z/2);
        let smaxY = 10 - parseInt(z/2);
        if(smaxX < smin) smaxX = smin;
        for(let x=smin; x<=smaxX; x++) {
            for(let y=smin; y<=smaxY; y++) {
                validSpaces.push({x, y, z});
            }
        }
    }
    validSpaces.sort(() => Math.random() - 0.5);
    
    let idCounter = 0;
    for(let i=0; i<totalTiles; i++) {
        let sp = validSpaces[i % validSpaces.length];
        tiles.push({ id: idCounter++, type: typesPool.pop(), x: sp.x, y: sp.y, z: sp.z, inTray: false, inStash: false, isDead: false });
    }

    renderBoard();
}

function checkOverlaps() {
    tiles.forEach(t1 => {
        if(t1.inTray || t1.inStash || t1.isDead || t1.element === null) return;
        
        let isLocked = false;
        for(let t2 of tiles) {
            if(t2.inTray || t2.inStash || t2.isDead || t2.element === null || t1.id === t2.id) continue;
            
            if(t2.z > t1.z || (t2.z === t1.z && t2.id > t1.id)) {
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
    playPop();  tile.inTray = true;
    trayTiles.push(tile); trayTiles.sort((a,b) => a.type.localeCompare(b.type));
    updateTrayVisuals(); checkOverlaps();
    setTimeout(checkMatches, 200);
}

function checkMatches() {
    const counts = {};
    trayTiles.forEach(t => { if(!counts[t.type]) counts[t.type] = []; counts[t.type].push(t); });
    
    let matchedType = null;
    for(let type in counts) {
        if(counts[type].length >= 3) {
            matchedType = type; playClearHit();
            let rect = tray.getBoundingClientRect();
            createParticles(rect.left + rect.width/2, rect.top + rect.height/2);
            break;
        }
    }
    
    if(matchedType) {
        trayTiles = trayTiles.filter(t => t.type !== matchedType);
        tiles.forEach(t => {
             if(t.type === matchedType && (t.inTray || t.inStash) && t.element) {
                 t.isDead = true; 
                 t.element.style.transition = 'transform 0.15s'; t.element.style.transform = 'scale(0)';
                 setTimeout(() => { if(t.element) t.element.remove(); t.element = null; }, 150);
                 t.inTray = false; t.inStash = false;
             }
        });
        setTimeout(() => { updateTrayVisuals(); checkOverlaps(); }, 150); 
        setTimeout(checkWin, 250);
    } else if(trayTiles.length === 7) {
        clearInterval(timerInterval);
        activeBgm.pause();
        setTimeout(() => { 
            playFail(); showAlert('Game Over!', 'ถาดเต็มแล้ว ลองใหม่อีกครั้งนะ!'); 
            if(gameMode !== 'normal') { gameScreen.classList.add('hidden'); introScreen.classList.remove('hidden'); }
            else { initStage(); playAudio(); } 
        }, 100);
    } else {
        checkWin();
    }
}

function checkWin() {
    const activeTiles = tiles.filter(t => !t.inTray && !t.inStash && !t.isDead && t.element !== null);
    if(activeTiles.length === 0 && trayTiles.length === 0 && stashTiles.length === 0) {
        clearInterval(timerInterval);
        activeBgm.pause();
        playWin();
        if(gameMode === 'normal' && currentStage < 11) currentStage++; 
        saveProgress();
        setTimeout(showSummary, 100);
    }
}

function showSummary() {
    if(gameMode === 'normal') {
        if(currentStage > 11) document.getElementById('btn-next').innerText = "Finish";
        else document.getElementById('btn-next').innerText = "Next Stage";
    } else {
        document.getElementById('btn-next').innerText = "Play Again";
    }
    
    let earned = 0;
    document.getElementById('win-time').innerText = 'Time Left: ' + formatTime(timeRemaining);
    
    if(gameMode === 'impossible') {
        document.getElementById('win-text').innerText = "IMPOSSIBLE CLEAR!";
        if(timeRemaining >= 720) earned = 33;
        else if(timeRemaining >= 240) earned = 28;
        else earned = 13;
    } else if(gameMode === 'endless') {
        document.getElementById('win-text').innerText = "ENDLESS CLEAR!";
        if(timeRemaining >= 720) earned = 33;
        else if(timeRemaining >= 240) earned = 28;
        else earned = 13;
    } else {
        document.getElementById('win-text').innerText = currentStage > 11 ? "ALL NORMAL STAGES CLEARED!" : "Stage Clear!";
        if(timeRemaining >= 720) earned = 3;
        else if(timeRemaining >= 240) earned = 2;
        else earned = 1;
    }
    
    stars += earned;
    document.getElementById('win-stars').innerText = "⭐ ".repeat(Math.min(10, earned)) + (earned > 10 ? ` x\${earned}` : '');
    
    const dropTypes = ['undo', 'shuffle', 'push'];
    const names = {'undo':'Undo (↩️)', 'shuffle':'Shuffle (🌀)', 'push':'Push Out (⬆️)'};
    const drop = dropTypes[Math.floor(Math.random()*3)];
    items[drop]++;
    
    saveProgress(); updateItemUI();
    
    document.getElementById('gacha-drop').innerText = "🎁 Bonus Drop: +1 " + names[drop];
    summaryScreen.classList.remove('hidden');
}

function updateTrayVisuals() {
    const slots = tray.querySelectorAll('.tray-slot');
    slots.forEach(s => s.innerHTML = '');
    
    trayTiles.forEach((tile, index) => {
        let el = tile.element; if(!el) return;
        el.style.transition = 'none'; el.style.position = 'relative'; el.style.left = '0'; el.style.top = '0';
        el.style.zIndex = '1'; el.style.boxShadow = '0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)';
        el.style.transform = 'translateY(-2px) scale(0.95)'; el.onclick = null;
        slots[index].appendChild(el);
    });
}
function updateStashVisuals() {
    const slots = stashTray.querySelectorAll('.tray-slot');
    slots.forEach(s => s.innerHTML = '');
    
    stashTiles.forEach((tile, index) => {
        let el = tile.element; if(!el) return;
        el.style.transition = 'none'; el.style.position = 'relative'; el.style.left = '0'; el.style.top = '0';
        el.style.zIndex = '1'; el.style.boxShadow = '0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)';
        el.style.transform = 'translateY(-2px) scale(0.95)';
        el.onclick = () => {
            if(trayTiles.length >= 7) return;
            stashTiles = stashTiles.filter(s => s.id !== tile.id); tile.inStash = false;
            moveToTray(tile); updateStashVisuals();
        };
        slots[index].appendChild(el);
    });
}
function renderBoard() {
    let offsetX = (window.innerWidth - 10 * GRID_CELL) / 2; let offsetY = 110;
    if(offsetX < 10) offsetX = 10;
    
    tiles.forEach(tile => {
        const el = document.createElement('div'); el.className = 'tile';
        el.innerText = tile.type; el.style.zIndex = tile.z.toString();
        el.style.left = (offsetX + tile.x * GRID_CELL) + 'px'; el.style.top = (offsetY + tile.y * GRID_CELL) + 'px';
        
        el.onclick = () => { if(el.classList.contains('locked')) return; if(trayTiles.length >= 7) return; moveToTray(tile); };
        tile.element = el; gameArea.appendChild(el);
    });
    checkOverlaps();
}

document.getElementById('btn-push').onclick = () => {
    if(items.push <= 0 || trayTiles.length === 0) return;
    const spaceLeft = 3 - stashTiles.length; if(spaceLeft <= 0) { showAlert('Stash is full!', ''); return; }
    items.push--; updateItemUI(); saveProgress();
    const amountToMove = Math.min(spaceLeft, trayTiles.length, 3);
    const toMove = trayTiles.splice(0, amountToMove);
    toMove.forEach(t => { t.inTray = false; t.inStash = true; stashTiles.push(t); });
    updateTrayVisuals(); updateStashVisuals(); checkOverlaps();
};
document.getElementById('btn-undo').onclick = () => {
    if(items.undo <= 0 || trayTiles.length === 0) return;
    items.undo--; updateItemUI(); saveProgress();
    const t = trayTiles.pop(); t.inTray = false;
    t.element.style.position = 'absolute';
    let offsetX = (window.innerWidth - 10 * GRID_CELL) / 2; if(offsetX < 10) offsetX = 10;
    t.element.style.left = (offsetX + t.x * GRID_CELL) + 'px'; t.element.style.top = (110 + t.y * GRID_CELL) + 'px';
    t.element.style.transform = 'none'; gameArea.appendChild(t.element);
    t.element.onclick = () => { if(t.element.classList.contains('locked')) return; if(trayTiles.length >= 7) return; moveToTray(t); };
    updateTrayVisuals(); checkOverlaps();
};
document.getElementById('btn-shuffle').onclick = () => {
    const activeTiles = tiles.filter(t => !t.inTray && !t.inStash && !t.isDead && t.element !== null);
    if(items.shuffle <= 0 || activeTiles.length === 0) return;
    items.shuffle--; updateItemUI(); saveProgress();
    const types = activeTiles.map(t => t.type); types.sort(() => Math.random() - 0.5);
    activeTiles.forEach((t, i) => {
        t.type = types[i]; t.element.innerText = t.type; t.element.style.transform = 'scale(0.8)';
        setTimeout(() => t.element.style.transform = 'none', 150);
    });
};
