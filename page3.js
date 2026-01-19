const API_URL =
  "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec";

const REFRESH_INTERVAL = 60000; // 1 minute
let refreshTimer = null;

/* ==============================
   INIT
   ============================== */
loadInvestigation();
startAutoRefresh();
handleVisibility();

/* ==============================
   FLASH ANIMATION
   ============================== */
function flashRefresh(){
  const el = document.createElement("div");
  el.className = "refresh-flash";
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),400);
}

/* ==============================
   AUTO REFRESH
   ============================== */
function startAutoRefresh(){
  stopAutoRefresh();
  refreshTimer = setInterval(async ()=>{
    flashRefresh();
    await loadInvestigation();
  }, REFRESH_INTERVAL);
}

function stopAutoRefresh(){
  if(refreshTimer) clearInterval(refreshTimer);
}

function handleVisibility(){
  document.addEventListener("visibilitychange",()=>{
    document.hidden ? stopAutoRefresh() : startAutoRefresh();
  });
}

/* ==============================
   MAIN LOAD
   ============================== */
async function loadInvestigation(){
  try{
    const res = await fetch(API_URL,{cache:"no-store"});
    const data = await res.json();

    updateKPIs(data);

    renderReasons(normalizeReasons(data.byReason));
    renderSentBack(normalizeSentBack(data.bySentBack));

  }catch(err){
    console.error("Investigation load failed",err);
  }
}

/* ==============================
   KPI LOGIC
   ============================== */
function updateKPIs(data){
  const active = Number(data.active || 0);
  const evaluated = Number(data.evaluated || 0);
  const total = Number(data.total || 0);

  const coverage = total
    ? ((evaluated / total) * 100).toFixed(1)
    : "0.0";

  document.getElementById("activeHolds").textContent = active;
  document.getElementById("evaluatedCount").textContent = evaluated;
  document.getElementById("coveragePct").textContent = `${coverage}%`;

  document.getElementById("lastUpdated").textContent =
    `Last updated: ${new Date(data.updatedAt || Date.now()).toLocaleTimeString()}`;
}

/* ==============================
   NORMALIZERS
   ============================== */
function normalizeReasons(obj){
  if(!obj || typeof obj!=="object") return [];
  return Object.entries(obj).map(([reason,count])=>({
    reason,
    count:Number(count)
  }));
}

function normalizeSentBack(obj){
  if(!obj || typeof obj!=="object") return [];
  return Object.entries(obj).map(([dept,info])=>({
    department:dept,
    count:Number(info.count || 0),
    oldest: info.lastAddedDate
      ? new Date(info.lastAddedDate).toLocaleString()
      : "—"
  }));
}

/* ==============================
   RENDER: REASONS
   ============================== */
function renderReasons(rows){
  const el = document.getElementById("reasonTable");
  el.innerHTML = "";

  if(!rows.length){
    el.innerHTML = `<div class="empty">No reason data</div>`;
    return;
  }

  const total = rows.reduce((s,r)=>s+r.count,0);

  rows.sort((a,b)=>b.count-a.count).forEach(r=>{
    const pct=((r.count/total)*100).toFixed(1);
    el.insertAdjacentHTML("beforeend",`
      <div class="impact-row">
        <div class="impact-head">
          <strong>${r.reason}</strong>
          <span>${r.count} (${pct}%)</span>
        </div>
        <div class="impact-bar">
          <div class="impact-fill" style="--w:${pct}%"></div>
        </div>
      </div>
    `);
  });
}

/* ==============================
   RENDER: SENT BACK
   ============================== */
function renderSentBack(rows){
  const el = document.getElementById("sentBackTable");
  el.innerHTML = "";

  if(!rows.length){
    el.innerHTML = `<div class="empty">No data</div>`;
    return;
  }

  const total = rows.reduce((s,r)=>s+r.count,0);

  rows.sort((a,b)=>b.count-a.count).forEach(r=>{
    const pct=((r.count/total)*100).toFixed(1);
    el.insertAdjacentHTML("beforeend",`
      <div class="impact-row">
        <div class="impact-head">
          <strong>${r.department}</strong>
          <span>${r.count} (${pct}%)</span>
        </div>
        <div class="impact-bar">
          <div class="impact-fill" style="--w:${pct}%"></div>
        </div>
        <div class="impact-meta">Oldest: ${r.oldest}</div>
      </div>
    `);
  });
}
