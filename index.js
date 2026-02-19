/* =====================================================
   INDEX DASHBOARD – FINAL, STABLE, USERNAME-BASED
   ===================================================== */

/* 🔗 DATA API (dashboard metrics) */
const API_URL =
  "https://script.google.com/a/macros/zennioptical.com/s/AKfycbzbQBjzoEEBpvukFkR-XMw8kG_gzCIuxZrTLodZZ_EnwqYAujOBqSzYslx-x9XTw7_UUA/exec";

/* 🔐 AUTH / VISIBILITY API (USERNAME-BASED) */
const AUTH_API =
  "https://script.google.com/macros/s/AKfycbzESjnpNzOyDP76Gm6atwBgh5txV5N2AI225kxz5Q8w7jXgVTIqZrDtIIpQigEE6250/exec";

/* ===============================
   AUTH GATE (HARD BLOCK)
   =============================== */
(function authGate() {
  if (sessionStorage.getItem("lms_logged_in") !== "true") {
    window.location.replace("login.html");
  }
})();

/* ===============================
   SCANNER STORAGE
   =============================== */
const SCANNER_STORAGE_KEY = "lms_scanner_attention";

/* ===============================
   PAGE LOAD
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  updateScannerFromStorage();
  applyVisibility(); // 🔐 username-based gating
});

/* ===============================
   DASHBOARD DATA (FINAL)
   =============================== */
function loadDashboard() {
  fetch(API_URL + "?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
      const active = Number(data.active ?? 0);
      const completed = Number(data.completed ?? 0);

      /* -----------------------------
         COVERAGE (TRUTHFUL)
         ----------------------------- */
      let coverageRaw = Number(data.coverage ?? 0);
      let coveragePct =
        coverageRaw <= 1
          ? Math.floor(coverageRaw * 1000) / 10
          : Math.floor(coverageRaw * 10) / 10;

      coveragePct = Math.max(0, Math.min(100, coveragePct));

      /* -----------------------------
         LAST JOB COMPLETED (BACKEND)
         ----------------------------- */
      const lastCompletedStr = data.lastCompletedAt || "N/A";
      setText("lastUpdate", lastCompletedStr);

      /* -----------------------------
         TIME SINCE LAST COMPLETION
         ----------------------------- */
      const sinceEl = document.getElementById("lastSince");
      const lastValEl = document.getElementById("lastUpdate");

      lastValEl.classList.remove("ok", "warn", "bad");

      if (lastCompletedStr !== "N/A") {
        // Rebuild Date from today + time string (safe for same-day ops)
        const now = new Date();
        const parsed = new Date(
          now.toDateString() + " " + lastCompletedStr
        );

        if (!isNaN(parsed)) {
          const diffMs = now - parsed;
          const diffMin = Math.floor(diffMs / 60000);

          sinceEl.textContent =
            diffMin < 1 ? "just now" : `${diffMin} min ago`;

          // STALE COLOR LOGIC
          if (diffMin < 5) {
            lastValEl.classList.add("ok");
          } else if (diffMin < 15) {
            lastValEl.classList.add("warn");
          } else {
            lastValEl.classList.add("bad");
          }
        } else {
          sinceEl.textContent = "—";
        }
      } else {
        sinceEl.textContent = "No completions yet";
        lastValEl.classList.add("warn");
      }

      /* -----------------------------
         CORE METRICS
         ----------------------------- */
      setText("active", active);
      setText("activeHolds", active);
      setText("completed", completed);
      setText("coverage", coveragePct + "%");
      setText("coverageDetail", coveragePct + "%");

      updateLabStatus(active, coveragePct);
    })
    .catch(err => {
      console.error("Dashboard data failed", err);
      showErrorState();
    });
}

/* ===============================
   🔐 VISIBILITY (USERNAME-BASED)
   =============================== */
function applyVisibility() {
  const username = sessionStorage.getItem("lms_user");

  if (!username) {
    console.warn("No username in session");
    unlockPage();
    return;
  }

  fetch(
    `${AUTH_API}?action=visibility&username=${encodeURIComponent(username)}`
  )
    .then(res => res.json())
    .then(data => {
      if (data.status !== "SUCCESS") {
        console.warn("Visibility denied", data);
        return;
      }

      applyVisibilityRules(data.visibility);
    })
    .catch(err => {
      console.error("Visibility fetch failed", err);
    })
    .finally(() => {
      unlockPage(); // 🚫 NO FLICKER
    });
}

/* ===============================
   APPLY VISIBILITY RULES
   =============================== */
function applyVisibilityRules(visibility) {
  const map = {
    "Scanner Map": "#scanner-card",
    "Investigation Hold": "#investigation-card",
    "True Curve": "#truecurve-card",
    "Tools": "#tools-card",
    "Coating": "#coating-card",   // 🔥 ADD THIS
    "Admin": ".admin-only"
  };

  Object.keys(map).forEach(feature => {
    if (visibility[feature] === true) {
      document.querySelectorAll(map[feature]).forEach(el => {
        el.style.display = "flex";
      });
    }
  });
}

/* ===============================
   UNLOCK PAGE (NO FLICKER)
   =============================== */
function unlockPage() {
  document.body.classList.remove("lms-hidden");
}

/* ===============================
   SCANNER MAP STATUS
   =============================== */
function updateScannerFromStorage() {
  let scanners = [];
  try {
    scanners = JSON.parse(localStorage.getItem(SCANNER_STORAGE_KEY)) || [];
  } catch {}

  const health = document.getElementById("scannerHealth");
  const detail = document.getElementById("scannerDetail");

  if (!health || !detail) return;

  if (!scanners.length) {
    health.textContent = "Online";
    health.className = "value ok";
    detail.innerHTML = "<p class='sub'>No scanners currently flagged</p>";
    return;
  }

  health.textContent = "Attention";
  health.className = "value warn";
  detail.innerHTML = `
    <strong>Scanner Attention:</strong>
    <ul>${scanners.map(s => `<li>${s}</li>`).join("")}</ul>
  `;
}

/* ===============================
   STATUS LOGIC
   =============================== */
function updateLabStatus(active, coverage) {
  const el = document.getElementById("labStatus");
  if (!el) return;

  el.classList.remove("ok", "warn", "bad");

  if (active === 0 && coverage >= 98) {
    el.textContent = "Normal";
    el.classList.add("ok");
  } else if (active <= 3) {
    el.textContent = "Attention";
    el.classList.add("warn");
  } else {
    el.textContent = "Issue";
    el.classList.add("bad");
  }
}

/* ===============================
   ERROR STATE
   =============================== */
function showErrorState() {
  [
    "active",
    "coverage",
    "activeHolds",
    "completed",
    "coverageDetail",
    "scannerHealth",
    "lastUpdate",
    "lastSince"
  ].forEach(id => setText(id, "ERR"));

  const el = document.getElementById("labStatus");
  if (el) {
    el.textContent = "Offline";
    el.className = "value bad";
  }
}

/* ===============================
   LOGOUT
   =============================== */
function logout() {
  sessionStorage.clear();
  localStorage.removeItem(SCANNER_STORAGE_KEY);
  window.location.href = "login.html";
}

/* ===============================
   HELPERS
   =============================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function openPage(page) {
  window.location.href = page;
}
