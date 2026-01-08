// ===============================
// Investigative Hold Tracker
// ===============================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec";

const REFRESH_MS = 15000;

async function loadHoldData() {
  const activeEl    = document.getElementById("activeCount");
  const evaluatedEl = document.getElementById("evaluatedCount");
  const tableEl     = document.getElementById("holdTable");
  const timeEl      = document.getElementById("lastUpdated");

  // ⛔ Guard: DOM must exist
  if (!activeEl || !evaluatedEl || !tableEl) {
    console.error("Missing DOM elements");
    return;
  }

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const text = await res.text();

    // ⛔ Guard: empty response
    if (!text) throw new Error("Empty response");

    const data = JSON.parse(text);

    // -----------------------
    // Counters (SAFE)
    // -----------------------
    const active    = Number(data.active ?? 0);
    const evaluated = Number(data.evaluated ?? 0);

    activeEl.textContent    = active;
    evaluatedEl.textContent = evaluated;

    // -----------------------
    // Timestamp
    // -----------------------
    if (data.updatedAt) {
      timeEl.textContent =
        "Last updated: " +
        new Date(data.updatedAt).toLocaleString();
    } else {
      timeEl.textContent = "";
    }

    // -----------------------
    // Breakdown Table
    // -----------------------
    tableEl.innerHTML = "";

    const sentBack = data.bySentBack || {};
    const entries = Object.entries(sentBack);

    if (entries.length === 0) {
      tableEl.innerHTML =
        `<tr><td colspan="2">No evaluated investigative holds</td></tr>`;
      return;
    }

    entries.forEach(([dest, count]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dest}</td>
        <td>${count}</td>
      `;
      tableEl.appendChild(tr);
    });

  } catch (err) {
    console.error("Investigative Hold Tracker Error:", err);

    // ❗ NEVER leave UI stuck
    activeEl.textContent    = "0";
    evaluatedEl.textContent = "0";

    tableEl.innerHTML =
      `<tr><td colspan="2">Data unavailable</td></tr>`;
  }
}

// Initial load
loadHoldData();

// Auto refresh
setInterval(loadHoldData, REFRESH_MS);
