const API_URL = "https://script.google.com/macros/s/AKfycbzb9LNa7_5dfr7lfFf_MCkHVamM3T5Sw7iByx58WKgWCGvvl6ysZZyIsEBWppuCL3A/exec";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    // KPIs
    document.getElementById("activeHolds").textContent = data.active;
    document.getElementById("evaluatedCount").textContent = data.evaluated;

    const coverage = data.total
      ? ((data.evaluated / data.total) * 100).toFixed(1) + "%"
      : "0%";
    document.getElementById("coveragePct").textContent = coverage;

    // FIX 1970 DATE ISSUE
    const updated = new Date(data.updatedAt);
    document.getElementById("lastUpdated").textContent =
      isNaN(updated.getTime())
        ? "—"
        : updated.toLocaleString();

    // REASONS
    const reasonBody = document.getElementById("reasonTable");
    reasonBody.innerHTML = "";

    const reasonTotal = Object.values(data.byReason || {}).reduce((a,b)=>a+b,0);

    Object.entries(data.byReason || {}).forEach(([reason, count]) => {
      const pct = reasonTotal
        ? ((count / reasonTotal) * 100).toFixed(1)
        : "0.0";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${reason}</td>
        <td>${count}</td>
        <td>${pct}%</td>
      `;
      reasonBody.appendChild(row);
    });

    // SENT BACK TO
    const sentBody = document.getElementById("sentBackTable");
    sentBody.innerHTML = "";

    Object.entries(data.bySentBack || {}).forEach(([dept, info]) => {
      const pct = data.evaluated
        ? ((info.count / data.evaluated) * 100).toFixed(1)
        : "0.0";

      const oldest = info.lastAddedDate
        ? new Date(info.lastAddedDate).toLocaleDateString()
        : "—";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dept}</td>
        <td>${info.count}</td>
        <td>${pct}%</td>
        <td>${oldest}</td>
      `;
      sentBody.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Tracker load failed:", err);
    document.getElementById("lastUpdated").textContent = "Load error";
  });