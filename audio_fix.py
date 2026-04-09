import re

with open('src/main.ts', 'r') as f:
    ts = f.read()

old_code = """let bgmNormal = new Audio(import.meta.env.BASE_URL + 'matchpic.mp3');
let bgmEndless = new Audio(import.meta.env.BASE_URL + 'matchpic2.mp3');
let bgmImpossible = new Audio(import.meta.env.BASE_URL + 'matchpic3.mp3');
[bgmNormal, bgmEndless, bgmImpossible].forEach(a => a.loop = true);

let activeBgm = bgmNormal;
let isMuted = false;

function playAudio() {
    [bgmNormal, bgmEndless, bgmImpossible].forEach(a => { a.pause(); a.currentTime = 0; });
    if(gameMode === 'endless') activeBgm = bgmEndless;
    else if(gameMode === 'impossible') activeBgm = bgmImpossible;
    else activeBgm = bgmNormal;
    
    activeBgm.muted = isMuted;
    const playPromise = activeBgm.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log('Autoplay prevented'));
    }
}

audioControl.onclick = () => {
    isMuted = !isMuted;
    [bgmNormal, bgmEndless, bgmImpossible].forEach(a => a.muted = isMuted);
    audioControl.innerText = isMuted ? '🔇' : '🔊';
};"""

new_code = """let bgmNormalList = [
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
};"""

if old_code in ts:
    ts = ts.replace(old_code, new_code)
    with open('src/main.ts', 'w') as f:
        f.write(ts)
    print("SUCCESS")
else:
    print("OLD CODE NOT FOUND")
