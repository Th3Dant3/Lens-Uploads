const API_URL =
  "https://script.google.com/a/macros/zennioptical.com/s/AKfycbzbQBjzoEEBpvukFkR-XMw8kG_gzCIuxZrTLodZZ_EnwqYAujOBqSzYslx-x9XTw7_UUA/exec";

document.addEventListener("DOMContentLoaded", loadDashboard);

function loadDashboard() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("active").textContent =
        data.active ?? "0";

      document.getElementById("completed").textContent =
        data.completed ?? "0";

      document.getElementById("coverage").textContent =
        Math.round((data.coverage || 0) * 100) + "%";
    })
    .catch(err => {
      console.error("Dashboard load failed", err);
      showError();
    });
}

function showError() {
  document.getElementById("active").textContent = "ERR";
  document.getElementById("completed").textContent = "ERR";
  document.getElementById("coverage").textContent = "ERR";
}

function openPage(page) {
  window.location.href = page;
}
