const PHASES=[
"2 Sets of 3","1 Set of 3 + 1 Run of 4","1 Set of 4 + 1 Run of 4",
"1 Run of 7","1 Run of 8","1 Run of 9","2 Sets of 4",
"7 Cards of One Color","1 Set of 5 + 1 Set of 2","1 Set of 5 + 1 Set of 3"
];

const KEY="phase10-pwa-state-v1";
let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
  round:1,
  players:[1,2,3,4].map((n,i)=>({id:crypto.randomUUID(),name:`Player ${n}`,phase:1,total:0,rounds:[]}))
};

function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
  document.getElementById("roundNumber").textContent=state.round;
  document.getElementById("playersCount").textContent=`${state.players.length} ${state.players.length===1?"player":"players"}`;
  const board=document.getElementById("scoreboard");
  if(!state.players.length){
    board.innerHTML='<div class="empty"><div style="font-size:36px">👥</div><h3>Ready to play?</h3><div>Add your players to start the scoreboard.</div></div>';
    return;
  }
  board.innerHTML=state.players.map((p,i)=>`
    <button class="player-card ${i===0?"leader":""}" data-detail="${p.id}">
      <span class="rank">${i+1}</span>
      <span>
        <span class="player-name">${esc(p.name)}</span>
        <span class="phase-line"><b>PHASE ${p.phase}</b> • ${PHASES[p.phase-1]}</span>
        <span class="progress"><i style="width:${p.phase*10}%"></i></span>
      </span>
      <span class="points"><strong>${p.total}</strong><small>POINTS</small></span>
      <span class="chevron">›</span>
    </button>`).join("");
  board.querySelectorAll("[data-detail]").forEach(b=>b.onclick=()=>openDetail(b.dataset.detail));
}
function openSheet(id){
  document.getElementById("backdrop").classList.add("open");
  document.getElementById(id).classList.add("open");
  document.getElementById(id).setAttribute("aria-hidden","false");
}
function closeSheets(){
  document.querySelectorAll(".sheet.open").forEach(s=>{s.classList.remove("open");s.setAttribute("aria-hidden","true")});
  document.getElementById("backdrop").classList.remove("open");
}
function openScores(){
  document.getElementById("scoreRound").textContent=state.round;
  document.getElementById("scoreInputs").innerHTML=state.players.map(p=>`
    <div class="score-row">
      <div><div class="player">${esc(p.name)}</div><div class="phase">Phase ${p.phase}</div></div>
      <input class="score-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" data-player="${p.id}" placeholder="0">
    </div>`).join("");
  openSheet("scoreSheet");
}
function saveRound(){
  document.querySelectorAll(".score-input").forEach(input=>{
    const p=state.players.find(x=>x.id===input.dataset.player);
    const points=Math.max(0,parseInt(input.value||"0",10)||0);
    p.rounds.push(points); p.total+=points;
    if(points<50 && p.phase<10)p.phase++;
  });
  state.round++; save(); render(); closeSheets();
}
function openDetail(id){
  const p=state.players.find(x=>x.id===id); if(!p)return;
  document.getElementById("detailName").textContent=p.name;
  document.getElementById("detailContent").innerHTML=`
    <div class="detail-hero">
      <div class="detail-name">${esc(p.name)}</div>
      <div class="detail-phase">PHASE ${p.phase} • ${PHASES[p.phase-1]}</div>
    </div>
    <div class="stat-grid"><div class="stat"><strong>${p.total}</strong><small>TOTAL</small></div><div class="stat"><strong>${p.rounds.length}</strong><small>ROUNDS</small></div></div>
    ${p.rounds.length?`<div class="history">${p.rounds.map((v,i)=>`<div class="history-row"><span>Round ${i+1}</span><strong>${v}</strong></div>`).reverse().join("")}</div>`:`<div class="empty">No rounds recorded yet.</div>`}`;
  openSheet("detailSheet");
}
function addPlayer(){
  if(state.players.length>=12)return alert("Phase 10 supports up to 12 players.");
  const input=document.getElementById("newPlayerName");
  const name=input.value.trim()||`Player ${state.players.length+1}`;
  state.players.push({id:crypto.randomUUID(),name,phase:1,total:0,rounds:[]});
  input.value="";save();render();closeSheets();
}
document.getElementById("scoreButton").onclick=openScores;
document.getElementById("quickScoreBtn").onclick=openScores;
document.getElementById("saveRound").onclick=saveRound;
document.getElementById("addPlayerBtn").onclick=()=>openSheet("playerSheet");
document.getElementById("savePlayer").onclick=addPlayer;
document.getElementById("settingsBtn").onclick=()=>openSheet("settingsSheet");
document.getElementById("backdrop").onclick=closeSheets;
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeSheets);
document.getElementById("resetGame").onclick=()=>{
  if(confirm("Reset the game? Scores and phases will be cleared, but player names will stay.")){
    state.players=state.players.map(p=>({id:p.id,name:p.name,phase:1,total:0,rounds:[]}));
    state.round=1;save();render();closeSheets();
  }
};
document.getElementById("newPlayerName").addEventListener("keydown",e=>{if(e.key==="Enter")addPlayer()});
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
render();