const API_URL =
  "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec";

const REFRESH_MS = 15000;
let lastActive = null;

async function loadHoldData() {
  const activeEl = document.getElementById("activeCount");
  const evalEl   = document.getElementById("evaluatedCount");
  const pctEl    = document.getElementById("completionPct");
  const tableEl  = document.getElementById("holdTable");
  const banner   = document.getElementById("stateBanner");
  const header   = document.getElementById("stateHeader");
  const timeEl   = document.getElementById("lastUpdated");

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();

    const active = Number(data.active || 0);
    const evaluated = Number(data.evaluated || 0);
    const total = active + evaluated;

    /* ===== COMPLETION (BULLETPROOF) ===== */
    let pct;
    if (total === 0) {
      pct = 100;
    } else if (active > 0) {
      pct = Math.min(99, Math.floor((evaluated / total) * 100));
    } else {
      pct = 100;
    }

    pctEl.textContent = `${pct}%`;
    activeEl.textContent = active;
    evalEl.textContent = evaluated;

    /* ===== STATE ===== */
    let stateClass, bannerText;

    if (active === 0) {
      stateClass = "state-green";
      bannerText = "ALL CLEAR";
      header.classList.remove("attention-pulse");
    } else {
      stateClass = "state-yellow";
      bannerText = "ATTENTION";
      header.classList.add("attention-pulse");
    }

    header.className = `header ${stateClass}`;
    banner.innerHTML = `${bannerText} <span class="badge">${active} Active</span>`;

    /* ===== TIME ===== */
    if (data.updatedAt) {
      timeEl.textContent =
        "Last updated: " +
        new Date(data.updatedAt).toLocaleString();
    }

    /* ===== BREAKDOWN ===== */
    tableEl.innerHTML = "";

    const entries = Object.entries(data.bySentBack || {})
      .sort((a,b) => b[1] - a[1]);

    entries.forEach(([dest, count], idx) => {
      const tr = document.createElement("tr");
      if (idx === 0 && active > 0) tr.classList.add("breakdown-hot");

      tr.innerHTML = `
        <td>${dest}</td>
        <td>${count}</td>
      `;
      tableEl.appendChild(tr);
    });

    lastActive = active;

  } catch (err) {
    console.error(err);
    pctEl.textContent = "—";
    activeEl.textContent = "0";
    evalEl.textContent = "0";
    tableEl.innerHTML = `<tr><td colspan="2">Data unavailable</td></tr>`;
  }
}

loadHoldData();
setInterval(loadHoldData, REFRESH_MS);