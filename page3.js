const API_URL = "YOUR_API_URL_HERE";

fetch(API_URL)
  .then(r => r.json())
  .then(d => {
    activeHolds.textContent = d.active;
    evaluatedCount.textContent = d.evaluated;
    coveragePct.textContent =
      d.total ? ((d.evaluated / d.total) * 100).toFixed(1) + "%" : "0%";
    lastUpdated.textContent = new Date(d.updatedAt).toLocaleString();

    // Reasons Bars
    const total = Object.values(d.byReason || {}).reduce((a,b)=>a+b,0);
    const container = document.getElementById("reasonBars");
    container.innerHTML = "";

    Object.entries(d.byReason || {}).forEach(([reason,count])=>{
      const pct = ((count/total)*100).toFixed(1);
      container.innerHTML += `
        <div class="bar">
          <div class="bar-head">
            <span>${reason}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <div class="track">
            <div class="fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    });

    // Sent Back
    const sb = document.getElementById("sentBackTable");
    sb.innerHTML = "";
    Object.entries(d.bySentBack || {}).forEach(([k,v])=>{
      sb.innerHTML += `
        <tr>
          <td>${k}</td>
          <td>${v.count}</td>
          <td>${((v.count/d.evaluated)*100).toFixed(1)}%</td>
          <td>${v.lastAddedDate ? new Date(v.lastAddedDate).toLocaleDateString() : "—"}</td>
        </tr>`;
    });
  });