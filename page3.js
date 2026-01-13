const API_URL =
  "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec";

function pct(v) {
  return `${v.toFixed(1)}%`;
}

/* KPIs */
function renderKPIs(d) {
  document.getElementById("activeHolds").textContent = d.active;
  document.getElementById("evaluatedCount").textContent = d.evaluated;

  const cov = d.total ? (d.evaluated / d.total) * 100 : 0;
  document.getElementById("coveragePct").textContent = pct(cov);

  document.getElementById("lastUpdated").textContent =
    `Last updated: ${new Date(d.updatedAt).toLocaleString()}`;
}

/* REASONS */
function renderReasons(map) {
  const tb = document.querySelector("#reasonTable tbody");
  tb.innerHTML = "";

  const rows = Object.entries(map || {});
  if (!rows.length) {
    tb.innerHTML =
      `<tr><td colspan="3" class="empty">No reason data available</td></tr>`;
    return;
  }

  const total = rows.reduce((s, [, c]) => s + c, 0);

  rows.sort((a, b) => b[1] - a[1]).forEach(([r, c]) => {
    tb.innerHTML += `
      <tr>
        <td>${r}</td>
        <td>${c}</td>
        <td>${pct((c / total) * 100)}</td>
      </tr>`;
  });
}

/* SENT BACK */
function renderSentBack(map) {
  const tb = document.querySelector("#sentBackTable tbody");
  tb.innerHTML = "";

  const rows = Object.entries(map || {});
  if (!rows.length) {
    tb.innerHTML =
      `<tr><td colspan="4" class="empty">No investigative data available</td></tr>`;
    return;
  }

  const total = rows.reduce((s, [, v]) => s + v.count, 0);

  rows.sort((a, b) => b[1].count - a[1].count)
    .forEach(([dept, v]) => {
      const date = v.lastAddedDate
        ? new Date(v.lastAddedDate).toLocaleDateString()
        : "—";

      tb.innerHTML += `
        <tr>
          <td>${dept}</td>
          <td>${v.count}</td>
          <td>${pct((v.count / total) * 100)}</td>
          <td>${date}</td>
        </tr>`;
    });
}

function load() {
  fetch(API_URL, { cache: "no-store" })
    .then(r => r.json())
    .then(d => {
      if (d.error) throw d.error;
      renderKPIs(d);
      renderReasons(d.byReason);
      renderSentBack(d.bySentBack);
    })
    .catch(e => console.error("Load failed:", e));
}

document.addEventListener("DOMContentLoaded", load);
