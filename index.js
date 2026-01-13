const REFRESH_INTERVAL = 120000; // 2 minutes

/* =========================================
   SYSTEM DEFINITIONS
   ========================================= */

const systems = [
  {
    name: "Investigations",
    cardId: "investigation-card",
    statusId: "investigation-status",
    endpoint: "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec",
    warnAfterMin: 10,
    errAfterMin: 30
  },
  {
    name: "Power Tracker",
    cardId: "power-card",
    statusId: "power-status",
    endpoint: "https://script.google.com/macros/s/AKfycbzuUpwsa2VTGjxeSP3wVV-x2Z4yMkGH_eYS86VpFH0CzC2Ii5S5U2ag-S5d89RZ8oHJ/exec",
    warnAfterMin: 10,
    errAfterMin: 30
  }
];

/* =========================================
   UI HELPERS
   ========================================= */

function setStatus(sys, state, message) {
  const statusEl = document.getElementById(sys.statusId);
  const cardEl   = document.getElementById(sys.cardId);

  const dot  = statusEl.querySelector(".dot");
  const text = statusEl.querySelector(".status-text");

  dot.className = "dot";
  cardEl.classList.remove("attention", "warning");

  if (state === "ok") dot.classList.add("ok");
  if (state === "warn") {
    dot.classList.add("warn");
    cardEl.classList.add("warning");
  }
  if (state === "err") {
    dot.classList.add("err");
    cardEl.classList.add("attention");
  }

  text.textContent = message;
}

/* =========================================
   LAST UPDATED STORAGE
   ========================================= */

function storeLastUpdated(sys, timestamp) {
  localStorage.setItem(`lastUpdated_${sys.name}`, String(timestamp));
}

function getLastUpdated(sys) {
  const val = localStorage.getItem(`lastUpdated_${sys.name}`);
  return val ? Number(val) : null;
}

/* =========================================
   AGING LOGIC (USED ON FAILURE)
   ========================================= */

function ageSystem(sys) {
  const lastUpdated = getLastUpdated(sys);

  if (!lastUpdated) {
    setStatus(sys, "err", "No update history");
    return;
  }

  const ageMin = (Date.now() - lastUpdated) / 60000;

  if (ageMin >= sys.errAfterMin) {
    setStatus(sys, "err", `Stale (${Math.floor(ageMin)} min)`);
  } else if (ageMin >= sys.warnAfterMin) {
    setStatus(sys, "warn", `Updated ${Math.floor(ageMin)} min ago`);
  } else {
    setStatus(sys, "ok", `Updated ${Math.floor(ageMin)} min ago`);
  }
}

/* =========================================
   SYSTEM CHECK
   ========================================= */

async function checkSystem(sys) {
  try {
    const res = await fetch(sys.endpoint, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    // Prefer true data freshness
    const updatedAt = data.updatedAt
      ? new Date(data.updatedAt).getTime()
      : Date.now(); // fallback = heartbeat only

    storeLastUpdated(sys, updatedAt);

    const ageMin = (Date.now() - updatedAt) / 60000;

    if (ageMin >= sys.errAfterMin) {
      setStatus(sys, "err", `Stale (${Math.floor(ageMin)} min)`);
    } else if (ageMin >= sys.warnAfterMin) {
      setStatus(sys, "warn", `Updated ${Math.floor(ageMin)} min ago`);
    } else {
      setStatus(sys, "ok", `Updated ${Math.floor(ageMin)} min ago`);
    }

  } catch (err) {
    // API failed → fall back to last known freshness
    ageSystem(sys);
  }
}

/* =========================================
   REFRESH LOOP
   ========================================= */

function refreshIndex() {
  document.getElementById("last-refresh").textContent =
    `Last refresh: ${new Date().toLocaleTimeString()}`;

  systems.forEach(sys => checkSystem(sys));
}

// Initial load
refreshIndex();
setInterval(refreshIndex, REFRESH_INTERVAL);
