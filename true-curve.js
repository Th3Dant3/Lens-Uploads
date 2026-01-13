const API_URL = "https://script.google.com/macros/s/AKfycbzuUpwsa2VTGjxeSP3wVV-x2Z4yMkGH_eYS86VpFH0CzC2Ii5S5U2ag-S5d89RZ8oHJ/exec";

let allRows = [];
let view = "production";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnProd").onclick = () => switchView("production");
  document.getElementById("btnTest").onclick = () => switchView("test");
  loadData();
});

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();
  allRows = data.rows || [];
  updateKPIs();
  render();
}

/* ---------------- KPIs ---------------- */

function updateKPIs() {
  set("kpiTotal", allRows.length);
  set("kpiTest", allRows.filter(r => r.status === "TEST").length);
  set("kpiCancel", allRows.filter(r => r.status === "Cancel").length);
  set("kpiAdjusted", allRows.filter(hasAdj).length);
  set("kpiActive", allRows.filter(r =>
    r.status !== "Shipped" &&
    r.status !== "TEST" &&
    r.status !== "Cancel"
  ).length);
  set("kpiEscalated", allRows.filter(isEsc).length);
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ---------------- RENDER ---------------- */

function render() {
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  const rows = view === "production"
    ? allRows.filter(r => r.status !== "TEST" && r.status !== "Cancel")
    : allRows.filter(r => r.status === "TEST" || r.status === "Cancel");

  const groups = {};
  rows.forEach(r => {
    const key = r.material || "Unknown";
    groups[key] ??= [];
    groups[key].push(r);
  });

  Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([material, list]) => {
      const gid = "g_" + material.replace(/[^a-z0-9]/gi, "_");

      // GROUP HEADER
      body.insertAdjacentHTML("beforeend", `
        <tr class="group-row" data-group="${gid}">
          <td colspan="6">
            <span class="arrow">▶</span> ${material} (${list.length})
          </td>
        </tr>
      `);

      // CHILD ROWS
      list.forEach(r => {
        body.insertAdjacentHTML("beforeend", `
          <tr class="child-row ${gid}" data-parent="${gid}" style="display:none">
            <td>${r.rx}</td>
            <td>${r.sku}</td>
            <td>${r.material}</td>
            <td>${r.status}</td>
            <td>${r.breakage ?? ""}</td>
            <td>${formatAdj(r)}</td>
          </tr>
        `);
      });
    });
}

/* ---------------- CLICK TO EXPAND ---------------- */

document.addEventListener("click", (e) => {
  const header = e.target.closest("tr.group-row");
  if (!header) return;

  const gid = header.dataset.group;
  const children = document.querySelectorAll(`tr.child-row[data-parent="${gid}"]`);
  const arrow = header.querySelector(".arrow");

  const isOpen = children[0]?.style.display === "table-row";

  children.forEach(r => {
    r.style.display = isOpen ? "none" : "table-row";
  });

  if (arrow) arrow.textContent = isOpen ? "▶" : "▼";
});

/* ---------------- VIEW SWITCH ---------------- */

function switchView(v) {
  view = v;
  document.getElementById("btnProd").classList.toggle("active", v === "production");
  document.getElementById("btnTest").classList.toggle("active", v === "test");
  render();
}

/* ---------------- HELPERS ---------------- */

function formatAdj(r) {
  return [r.adj1, r.adj2, r.adj3, r.adj4].filter(Boolean).join(" → ") || "No Change";
}

function hasAdj(r) {
  return r.adj1 || r.adj2 || r.adj3 || r.adj4;
}

function isEsc(r) {
  return formatAdj(r).toLowerCase().includes("send");
}
