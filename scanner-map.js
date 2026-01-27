/* ===============================
   SCANNER MAP – FINAL CLEAN BUILD
   =============================== */

const app = document.getElementById("app");

/* ===============================
   DATA (CLEAN – NO EXCEL CHARS)
   =============================== */

const data = {
  surface: [
    { name: "Surface 1", iface: "MI", port: 43 },
    { name: "Surface 2", iface: "MI", port: 45 }
  ],

  finish: {
    "Line A": {
      mounting: [
        { name: "Station 1", iface: "MI", port: 16 },
        { name: "Station 2", iface: "MI", port: 8 },
        { name: "Station 3", iface: "MI", port: 11 },
        { name: "Station 4", iface: "MI", port: 10 },
        { name: "Station 5", iface: "MI", port: 15 },
        { name: "Station 6", iface: "MI", port: 9 },
        { name: "Station 7", iface: "MI", port: 14 },
        { name: "Station 8", iface: "MI", port: 12 },
        { name: "Station 9", iface: "MI", port: 17 },
        { name: "Station 10", iface: "MI", port: 13 }
      ],
      handstone: [
        { name: "Handstone 1", iface: "MI", port: 44 }
      ],
      finishUnbox: [
        { name: "Finish 1", iface: "MI", port: 41 },
        { name: "Finish 2", iface: "MI", port: 47 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "MI", port: 3 },
        { name: "Station 2", iface: "MI", port: 7 },
        { name: "Station 3", iface: "MI", port: 5 }
      ]
    },

    "Line B": {
      mounting: [
        { name: "Station 1", iface: "SI2", port: 5 },
        { name: "Station 2", iface: "SI2", port: 6 },
        { name: "Station 3", iface: "SI2", port: 15 },
        { name: "Station 4", iface: "SI2", port: 16 },
        { name: "Station 5", iface: "SI2", port: 10 },
        { name: "Station 6", iface: "SI2", port: 9 },
        { name: "Station 7", iface: "SI2", port: 12 },
        { name: "Station 8", iface: "SI2", port: 11 },
        { name: "Station 9", iface: "SI2", port: 14 },
        { name: "Station 10", iface: "SI2", port: 13 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "SI2", port: 7 },
        { name: "Station 2", iface: "SI2", port: 8 },
        { name: "Station 3", iface: "SI2", port: 3 }
      ]
    },

    "Line C": {
      mounting: [
        { name: "Station 1", iface: "SI3", port: 13 },
        { name: "Station 2", iface: "SI3", port: 5 },
        { name: "Station 3", iface: "SI3", port: 14 },
        { name: "Station 4", iface: "SI3", port: 6 },
        { name: "Station 5", iface: "SI3", port: 15 },
        { name: "Station 6", iface: "SI3", port: 9 },
        { name: "Station 7", iface: "SI3", port: 16 },
        { name: "Station 8", iface: "SI3", port: 8 },
        { name: "Station 9", iface: "SI3", port: 17 },
        { name: "Station 10", iface: "SI3", port: 7 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "SI3", port: 11 },
        { name: "Station 2", iface: "SI3", port: 3 },
        { name: "Station 3", iface: "SI3", port: 12 }
      ]
    }
  },

  arInside: [
    { name: "Sectoring 2", iface: "MI", port: 24 },
    { name: "Oven", iface: "MI", port: 23 },
    { name: "De-Ring", iface: "MI", port: 28 },
    { name: "Sectoring 1", iface: "MI", port: 25 },
    { name: "Sectoring 3", iface: "MI", port: 26 },
    { name: "Inside Lab", iface: "MI", port: 31 },
    { name: "Inside Lab", iface: "MI", port: 32 }
  ],

  arOutside: [
    { name: "Basket 1", iface: "SI1", port: 6 },
    { name: "Basket 2", iface: "SI1", port: 3 },
    { name: "Basket 3", iface: "SI1", port: 5 },
    { name: "Basket 4", iface: "SI1", port: 4 }
  ]
};

/* ===============================
   HELPERS
   =============================== */

function toggle(el) {
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function buildCard(item) {
  const c = document.createElement("div");
  c.className = `card ${item.iface.toLowerCase()}`;
  c.innerHTML = `
    <div class="card-title">${item.name}</div>
    <div class="card-interface">Interface ${item.iface}</div>
    <div class="card-port">Port ${item.port}</div>
  `;
  return c;
}

function buildGrid(items) {
  const g = document.createElement("div");
  g.className = "grid";
  items.forEach(i => g.appendChild(buildCard(i)));
  return g;
}

function buildSection(title, items) {
  const section = document.createElement("section");
  section.className = "section";

  const header = document.createElement("div");
  header.className = "section-header";
  header.textContent = `▼ ${title}`;

  const content = document.createElement("div");
  content.className = "section-content";
  content.style.display = "block";
  content.appendChild(buildGrid(items));

  header.onclick = () => {
    toggle(content);
    header.textContent =
      content.style.display === "block"
        ? `▼ ${title}`
        : `▶ ${title}`;
  };

  section.appendChild(header);
  section.appendChild(content);
  return section;
}

/* ===============================
   RENDER
   =============================== */

app.appendChild(buildSection("Surface", data.surface));

const finishSection = document.createElement("section");
finishSection.className = "section";

const finishHeader = document.createElement("div");
finishHeader.className = "section-header";
finishHeader.textContent = "▼ Finish Department";

const finishContent = document.createElement("div");
finishContent.className = "section-content";
finishContent.style.display = "block";

finishHeader.onclick = () => {
  toggle(finishContent);
  finishHeader.textContent =
    finishContent.style.display === "block"
      ? "▼ Finish Department"
      : "▶ Finish Department";
};

Object.entries(data.finish).forEach(([lineName, groups]) => {
  const lineHeader = document.createElement("div");
  lineHeader.className = "line-header";
  lineHeader.textContent = `▼ ${lineName}`;

  const lineContent = document.createElement("div");
  lineContent.className = "line-content";
  lineContent.style.display = "block";

  Object.entries(groups).forEach(([groupName, stations]) => {
    const sub = document.createElement("div");
    sub.className = "line-header";
    sub.textContent = groupName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, c => c.toUpperCase());

    lineContent.appendChild(sub);
    lineContent.appendChild(buildGrid(stations));
  });

  lineHeader.onclick = () => {
    toggle(lineContent);
    lineHeader.textContent =
      lineContent.style.display === "block"
        ? `▼ ${lineName}`
        : `▶ ${lineName}`;
  };

  finishContent.appendChild(lineHeader);
  finishContent.appendChild(lineContent);
});

finishSection.appendChild(finishHeader);
finishSection.appendChild(finishContent);
app.appendChild(finishSection);

app.appendChild(buildSection("AR Inside", data.arInside));
app.appendChild(buildSection("AR Outside", data.arOutside));
