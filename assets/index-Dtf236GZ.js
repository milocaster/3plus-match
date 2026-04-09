(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`);e.innerHTML=`
<div class="screen" id="intro-screen">
    <div class="stars-badge" id="intro-stars">⭐ 0</div>
    <div class="title">3Plus<br>Match Tile</div>
    <button class="btn-primary" id="btn-start">Stage Mode</button>
    <button class="btn-alt" id="btn-endless">Hardcore Mode (20 Min) 🔥</button>
    <button class="btn-secondary" id="btn-shop">Reward Shop 🎁</button>
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
        <p id="win-time" style="font-size: 1.2rem; color: #555;">Time: 00:00</p>
        <div id="win-stars" style="font-size:2rem; margin:10px 0;">⭐ ⭐ ⭐</div>
        <p id="gacha-drop" style="color:#ff3366; font-weight:bold; margin-bottom: 20px;"></p>
        <button class="btn-primary" id="btn-next">Next Stage</button>
        <button class="btn-secondary" id="btn-menu" style="width:100%; font-size:1.2rem; padding: 10px;">Main Menu</button>
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
`;var t=document.getElementById(`intro-screen`),n=document.getElementById(`game-screen`),r=document.getElementById(`summary-screen`),i=document.getElementById(`shop-screen`),a=document.getElementById(`alert-modal`),o=document.getElementById(`intro-stars`),s=document.getElementById(`shop-stars`),c=document.getElementById(`game-area`),l=document.getElementById(`tray`),u=document.getElementById(`stash-tray`),d=document.getElementById(`timer-info`),f=document.getElementById(`stage-info`),p=document.getElementById(`star-total`),m=document.getElementById(`audio-control`),h=28,g=parseInt(localStorage.getItem(`3p_stage`))||1,_=parseInt(localStorage.getItem(`3p_stars`))||0,v=JSON.parse(localStorage.getItem(`3p_items`))||{undo:2,shuffle:2,push:2},y=!1;function b(){localStorage.setItem(`3p_stage`,g.toString()),localStorage.setItem(`3p_stars`,_.toString()),localStorage.setItem(`3p_items`,JSON.stringify(v)),o.innerText=`⭐ ${_}`,s.innerText=`⭐ ${_}`}window.buyPrize=function(e,t,n){_>=t?(_-=t,b(),x(`Redemption Successful`,n)):x(`Insufficent Stars`,`You need ${t} ⭐ to redeem this prize.`)};function x(e,t){document.getElementById(`alert-title`).innerText=e,document.getElementById(`alert-desc`).innerText=t,a.classList.remove(`hidden`)}document.getElementById(`btn-close-alert`).onclick=()=>{a.classList.add(`hidden`)},b();var S=[`🐦`,`🐱`,`🐭`,`🐐`,`🐑`,`🐄`,`🐶`,`🐢`,`🐃`,`🦥`,`🦊`,`🐸`,`🐼`,`🐵`,`🦉`],C=[],w=[],T=[],E=0,D=1200,O=null,k=new Audio(`/matchpic.mp3`);k.loop=!0;var A=!1;m.onclick=()=>{A=!A,k.muted=A,m.innerText=A?`🔇`:`🔊`},document.getElementById(`btn-start`).onclick=()=>{y=!1,t.classList.add(`hidden`),n.classList.remove(`hidden`),k.play().catch(e=>console.log(`BGM wait`)),R()},document.getElementById(`btn-endless`).onclick=()=>{y=!0,t.classList.add(`hidden`),n.classList.remove(`hidden`),k.play().catch(e=>console.log(`BGM wait`)),R()},document.getElementById(`btn-shop`).onclick=()=>{t.classList.add(`hidden`),i.classList.remove(`hidden`)},document.getElementById(`btn-back-menu`).onclick=()=>{i.classList.add(`hidden`),t.classList.remove(`hidden`)},document.getElementById(`btn-next`).onclick=()=>{y||g++,b(),r.classList.add(`hidden`),R()},document.getElementById(`btn-menu`).onclick=()=>{r.classList.add(`hidden`),n.classList.add(`hidden`),t.classList.remove(`hidden`),clearInterval(O),b()};function j(){if(!A)try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`square`,t.frequency.setValueAtTime(400,e.currentTime),t.frequency.exponentialRampToValueAtTime(800,e.currentTime+.1),t.frequency.setValueAtTime(800,e.currentTime+.1),t.frequency.exponentialRampToValueAtTime(1200,e.currentTime+.3),n.gain.setValueAtTime(.3,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.4),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.4)}catch{}}function M(){if(!A)try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sawtooth`,t.frequency.setValueAtTime(300,e.currentTime),t.frequency.exponentialRampToValueAtTime(100,e.currentTime+.5),n.gain.setValueAtTime(.3,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.5),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.5)}catch{}}function N(){if(!A)try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(400,e.currentTime),t.frequency.exponentialRampToValueAtTime(800,e.currentTime+.1),n.gain.setValueAtTime(.3,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.1),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.1)}catch{}}function P(){if(!A)try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`triangle`,t.frequency.setValueAtTime(800,e.currentTime),t.frequency.exponentialRampToValueAtTime(1200,e.currentTime+.2),n.gain.setValueAtTime(.5,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.2),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.2)}catch{}}function F(e,t){let n=[`#ff3366`,`#ffed8d`,`#ffa530`,`#fff`];for(let r=0;r<15;r++){let r=document.createElement(`div`);r.className=`particle`,r.style.left=e+`px`,r.style.top=t+`px`,r.style.background=n[Math.floor(Math.random()*n.length)];let i=Math.random()*Math.PI*2,a=40+Math.random()*60;r.style.setProperty(`--tx`,Math.cos(i)*a+`px`),r.style.setProperty(`--ty`,Math.sin(i)*a+`px`),document.body.appendChild(r),setTimeout(()=>r.remove(),600)}}function I(e){let t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`);return t+`:`+n}function L(){document.getElementById(`count-undo`).innerText=v.undo,document.getElementById(`count-shuffle`).innerText=v.shuffle,document.getElementById(`count-push`).innerText=v.push,p.innerText=`⭐ `+_,y||(document.getElementById(`btn-start`).innerText=`Continue Stage `+g)}function R(){L(),C=[],w=[],T=[],c.innerHTML=``,f.innerText=y?`HARDCORE`:`Stage: `+g,l.innerHTML=``;for(let e=0;e<7;e++)l.innerHTML+=`<div class='tray-slot'></div>`;u.innerHTML=``;for(let e=0;e<3;e++)u.innerHTML+=`<div class='tray-slot'></div>`;clearInterval(O),y?(D=1200,d.innerText=I(D),O=setInterval(()=>{D--,d.innerText=I(D),D<=0&&(clearInterval(O),M(),x(`Time Out!`,`เวลาหมด 20 นาทีแล้ว! คุณไม่ได้รับดาว`),n.classList.add(`hidden`),t.classList.remove(`hidden`))},1e3)):(E=0,d.innerText=I(0),O=setInterval(()=>{E++,d.innerText=I(E)},1e3));let e=y?33:g,r=8+Math.floor((e-1)*2),i=r*3,a=Math.min(3+Math.floor(e-1),S.length),o=S.slice(0,a),s=[];for(let e=0;e<r;e++){let t=o[e%o.length];s.push(t,t,t)}s.sort(()=>Math.random()-.5);let p=Math.min(6,1+Math.floor(e/3)),m=[];for(let e=0;e<p;e++){let t=parseInt(e/2),n=8-parseInt(e/2),r=10-parseInt(e/2);n<t&&(n=t);for(let i=t;i<=n;i++)for(let n=t;n<=r;n++)m.push({x:i,y:n,z:e})}m.sort(()=>Math.random()-.5);let h=0;for(let e=0;e<i;e++){let t=m[e%m.length];C.push({id:h++,type:s.pop(),x:t.x,y:t.y,z:t.z,inTray:!1,inStash:!1})}K()}function z(){C.forEach(e=>{if(e.inTray||e.inStash||e.element===null)return;let t=!1;for(let n of C)if(!(n.inTray||n.inStash||n.element===null||e.id===n.id)&&(n.z>e.z||n.z===e.z&&n.id>e.id)){let r=e.x<n.x+1.9&&e.x+1.9>n.x,i=e.y<n.y+1.9&&e.y+1.9>n.y;if(r&&i){t=!0;break}}e.element&&(t?e.element.classList.add(`locked`):e.element.classList.remove(`locked`),e.element.style.zIndex=e.z.toString())})}function B(e){w.length>=7||(N(),e.inTray=!0,w.push(e),w.sort((e,t)=>e.type.localeCompare(t.type)),W(),z(),setTimeout(V,200))}function V(){let e={};w.forEach(t=>{e[t.type]||(e[t.type]=[]),e[t.type].push(t)});let r=null;for(let t in e)if(e[t].length>=3){r=t,P();let e=l.getBoundingClientRect();F(e.left+e.width/2,e.top+e.height/2);break}r?(w=w.filter(e=>e.type!==r),C.forEach(e=>{e.type===r&&(e.inTray||e.inStash)&&e.element&&(e.element.style.transition=`transform 0.15s`,e.element.style.transform=`scale(0)`,setTimeout(()=>{e.element&&e.element.remove(),e.element=null},150),e.inTray=!1,e.inStash=!1)}),setTimeout(W,150),setTimeout(H,250)):w.length===7?(clearInterval(O),setTimeout(()=>{M(),x(`Game Over!`,`ถาดเต็มแล้ว ลองใหม่อีกครั้งนะ!`),y?(n.classList.add(`hidden`),t.classList.remove(`hidden`)):R()},100)):H()}function H(){C.filter(e=>!e.inTray&&!e.inStash&&e.element!==null).length===0&&w.length===0&&T.length===0&&(clearInterval(O),j(),setTimeout(U,100))}function U(){document.getElementById(`btn-next`).innerText=y?`Play Again`:`Next Stage`;let e=0;y?(document.getElementById(`win-text`).innerText=`HARDCORE CLEAR!`,document.getElementById(`win-time`).innerText=`Time Left: `+I(D),e=D>=720?33:D>=240?28:13):(document.getElementById(`win-text`).innerText=`Stage Clear!`,document.getElementById(`win-time`).innerText=`Time: `+I(E),e=1,E<180&&e++,E<90&&e++),_+=e,document.getElementById(`win-stars`).innerText=`⭐ `.repeat(Math.min(10,e))+(e>10?` x${e}`:``);let t=[`undo`,`shuffle`,`push`],n={undo:`Undo (↩️)`,shuffle:`Shuffle (🌀)`,push:`Push Out (⬆️)`},i=t[Math.floor(Math.random()*3)];v[i]++,b(),L(),document.getElementById(`gacha-drop`).innerText=`🎁 Bonus Drop: +1 `+n[i],r.classList.remove(`hidden`)}function W(){let e=l.querySelectorAll(`.tray-slot`);e.forEach(e=>e.innerHTML=``),w.forEach((t,n)=>{let r=t.element;r&&(r.style.transition=`none`,r.style.position=`relative`,r.style.left=`0`,r.style.top=`0`,r.style.zIndex=`1`,r.style.boxShadow=`0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)`,r.style.transform=`translateY(-2px) scale(0.95)`,r.onclick=null,e[n].appendChild(r))})}function G(){let e=u.querySelectorAll(`.tray-slot`);e.forEach(e=>e.innerHTML=``),T.forEach((t,n)=>{let r=t.element;r&&(r.style.transition=`none`,r.style.position=`relative`,r.style.left=`0`,r.style.top=`0`,r.style.zIndex=`1`,r.style.boxShadow=`0 4px 0 #ccb096, 0 4px 6px rgba(0,0,0,0.1)`,r.style.transform=`translateY(-2px) scale(0.95)`,r.onclick=()=>{w.length>=7||(T=T.filter(e=>e.id!==t.id),t.inStash=!1,B(t),G())},e[n].appendChild(r))})}function K(){let e=(window.innerWidth-10*h)/2;e<10&&(e=10),C.forEach(t=>{let n=document.createElement(`div`);n.className=`tile`,n.innerText=t.type,n.style.zIndex=t.z.toString(),n.style.left=e+t.x*h+`px`,n.style.top=110+t.y*h+`px`,n.onclick=()=>{n.classList.contains(`locked`)||w.length>=7||B(t)},t.element=n,c.appendChild(n)}),z()}document.getElementById(`btn-push`).onclick=()=>{if(v.push<=0||w.length===0)return;let e=3-T.length;if(e<=0){x(`Stash is full!`,``);return}v.push--,L(),b();let t=Math.min(e,w.length,3);w.splice(0,t).forEach(e=>{e.inTray=!1,e.inStash=!0,T.push(e)}),W(),G(),z()},document.getElementById(`btn-undo`).onclick=()=>{if(v.undo<=0||w.length===0)return;v.undo--,L(),b();let e=w.pop();e.inTray=!1,e.element.style.position=`absolute`;let t=(window.innerWidth-10*h)/2;t<10&&(t=10),e.element.style.left=t+e.x*h+`px`,e.element.style.top=110+e.y*h+`px`,e.element.style.transform=`none`,c.appendChild(e.element),e.element.onclick=()=>{e.element.classList.contains(`locked`)||w.length>=7||B(e)},W(),z()},document.getElementById(`btn-shuffle`).onclick=()=>{let e=C.filter(e=>!e.inTray&&!e.inStash&&e.element!==null);if(v.shuffle<=0||e.length===0)return;v.shuffle--,L(),b();let t=e.map(e=>e.type);t.sort(()=>Math.random()-.5),e.forEach((e,n)=>{e.type=t[n],e.element.innerText=e.type,e.element.style.transform=`scale(0.8)`,setTimeout(()=>e.element.style.transform=`none`,150)})};