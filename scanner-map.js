/* ===============================
   SCANNER MAP – FINAL LOCKED BUILD
   =============================== */

const app = document.getElementById("app");

/* ===============================
   DATA (iface = CSS | ifaceLabel = TEXT)
   =============================== */

const data = {
  surface: [
    { name: "Surface 1", iface: "mi", ifaceLabel: "MI 1", port: 43 },
    { name: "Surface 2", iface: "mi", ifaceLabel: "MI 1", port: 45 }
  ],

  finish: {
    "Line A": {
      mounting: [
        { name: "Station 1", iface: "mi", ifaceLabel: "MI 1", port: 16 },
        { name: "Station 2", iface: "mi", ifaceLabel: "MI 1", port: 8 },
        { name: "Station 3", iface: "mi", ifaceLabel: "MI 1", port: 11 },
        { name: "Station 4", iface: "mi", ifaceLabel: "MI 1", port: 10 },
        { name: "Station 5", iface: "mi", ifaceLabel: "MI 1", port: 15 },
        { name: "Station 6", iface: "mi", ifaceLabel: "MI 1", port: 9 },
        { name: "Station 7", iface: "mi", ifaceLabel: "MI 1", port: 14 },
        { name: "Station 8", iface: "mi", ifaceLabel: "MI 1", port: 12 },
        { name: "Station 9", iface: "mi", ifaceLabel: "MI 1", port: 17 },
        { name: "Station 10", iface: "mi", ifaceLabel: "MI 1", port: 13 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "mi", ifaceLabel: "MI 1", port: 3 },
        { name: "Station 2", iface: "mi", ifaceLabel: "MI 1", port: 7 },
        { name: "Station 3", iface: "mi", ifaceLabel: "MI 1", port: 5 }
      ],
      finishUnbox: [
        { name: "Finish 1", iface: "mi", ifaceLabel: "MI 1", port: 41 },
        { name: "Finish 2", iface: "mi", ifaceLabel: "MI 1", port: 47 }
      ],
      handstone: [
        { name: "Handstone 1", iface: "mi", ifaceLabel: "MI 1", port: 44 }
      ]
    },

    "Line B": {
      mounting: [
        { name: "Station 1", iface: "si2", ifaceLabel: "SI 2", port: 5 },
        { name: "Station 2", iface: "si2", ifaceLabel: "SI 2", port: 6 },
        { name: "Station 3", iface: "si2", ifaceLabel: "SI 2", port: 15 },
        { name: "Station 4", iface: "si2", ifaceLabel: "SI 2", port: 16 },
        { name: "Station 5", iface: "si2", ifaceLabel: "SI 2", port: 10 },
        { name: "Station 6", iface: "si2", ifaceLabel: "SI 2", port: 9 },
        { name: "Station 7", iface: "si2", ifaceLabel: "SI 2", port: 12 },
        { name: "Station 8", iface: "si2", ifaceLabel: "SI 2", port: 11 },
        { name: "Station 9", iface: "si2", ifaceLabel: "SI 2", port: 14 },
        { name: "Station 10", iface: "si2", ifaceLabel: "SI 2", port: 13 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "si2", ifaceLabel: "SI 2", port: 7 },
        { name: "Station 2", iface: "si2", ifaceLabel: "SI 2", port: 8 },
        { name: "Station 3", iface: "si2", ifaceLabel: "SI 2", port: 3 }
      ]
    },

    "Line C": {
      mounting: [
        { name: "Station 1", iface: "si3", ifaceLabel: "SI 3", port: 13 },
        { name: "Station 2", iface: "si3", ifaceLabel: "SI 3", port: 5 },
        { name: "Station 3", iface: "si3", ifaceLabel: "SI 3", port: 14 },
        { name: "Station 4", iface: "si3", ifaceLabel: "SI 3", port: 6 },
        { name: "Station 5", iface: "si3", ifaceLabel: "SI 3", port: 15 },
        { name: "Station 6", iface: "si3", ifaceLabel: "SI 3", port: 9 },
        { name: "Station 7", iface: "si3", ifaceLabel: "SI 3", port: 16 },
        { name: "Station 8", iface: "si3", ifaceLabel: "SI 3", port: 8 },
        { name: "Station 9", iface: "si3", ifaceLabel: "SI 3", port: 17 },
        { name: "Station 10", iface: "si3", ifaceLabel: "SI 3", port: 7 }
      ],
      finalInspection: [
        { name: "Station 1", iface: "si3", ifaceLabel: "SI 3", port: 11 },
        { name: "Station 2", iface: "si3", ifaceLabel: "SI 3", port: 3 },
        { name: "Station 3", iface: "si3", ifaceLabel: "SI 3", port: 12 }
      ]
    }
  },

  arInside: [
    { name: "Sectoring 1", iface: "mi", ifaceLabel: "MI 1", port: 25 },
    { name: "Sectoring 2", iface: "mi", ifaceLabel: "MI 1", port: 24 },
    { name: "Sectoring 3", iface: "mi", ifaceLabel: "MI 1", port: 26 },
    { name: "Oven", iface: "mi", ifaceLabel: "MI 1", port: 23 },
    { name: "De-Ring", iface: "mi", ifaceLabel: "MI 1", port: 28 },
    { name: "Inside Lab", iface: "mi", ifaceLabel: "MI 1", port: 31 },
    { name: "Inside Lab 2", iface: "mi", ifaceLabel: "MI 1", port: 32 }
  ],

  arOutside: {
    groupA: [
      { name: "Basket 1", iface: "si1", ifaceLabel: "SI 1", port: 6 },
      { name: "Basket 2", iface: "si1", ifaceLabel: "SI 1", port: 3 },
      { name: "Basket 3", iface: "si1", ifaceLabel: "SI 1", port: 5 },
      { name: "Basket 4", iface: "si1", ifaceLabel: "SI 1", port: 4 }
    ],
    groupB: [
      { name: "Basket 5", iface: "si1", ifaceLabel: "SI 1", port: 9 },
      { name: "Basket 6", iface: "si1", ifaceLabel: "SI 1", port: 7 },
      { name: "Basket 7", iface: "si1", ifaceLabel: "SI 1", port: 8 },
      { name: "Basket 8", iface: "si1", ifaceLabel: "SI 1", port: 10 }
    ]
  }
};

/* ===============================
   HELPERS
   =============================== */

function card(item) {
  const d = document.createElement("div");
  d.className = `card ${item.iface}`;

  d.innerHTML = `
    <div class="card-title">${item.name}</div>
    <div class="card-interface">Interface ${item.ifaceLabel}</div>
    <div class="card-port">Port ${item.port}</div>
  `;
  return d;
}

function evenOddGrid(items) {
  const even = items.filter(i => +i.name.replace(/\D/g, "") % 2 === 0);
  const odd = items.filter(i => +i.name.replace(/\D/g, "") % 2 === 1);

  const wrap = document.createElement("div");
  wrap.className = "two-row-grid";

  const top = document.createElement("div");
  top.className = "row";
  even.forEach(i => top.appendChild(card(i)));

  const bottom = document.createElement("div");
  bottom.className = "row";
  odd.forEach(i => bottom.appendChild(card(i)));

  wrap.append(top, bottom);
  return wrap;
}

function simpleGrid(items) {
  const g = document.createElement("div");
  g.className = "grid";
  items.forEach(i => g.appendChild(card(i)));
  return g;
}

function section(title) {
  const s = document.createElement("section");
  s.className = "section";

  const h = document.createElement("div");
  h.className = "section-header";
  h.textContent = `▼ ${title}`;

  const c = document.createElement("div");
  c.className = "section-content";

  h.onclick = () => {
    const open = c.style.display !== "none";
    c.style.display = open ? "none" : "block";
    h.textContent = open ? `▶ ${title}` : `▼ ${title}`;
  };

  s.append(h, c);
  return { s, c };
}

/* ===============================
   RENDER
   =============================== */

const surface = section("Surface Unbox");
surface.c.appendChild(simpleGrid(data.surface));
app.appendChild(surface.s);

const finish = section("Finish Department");

Object.entries(data.finish).forEach(([line, g]) => {
  const lh = document.createElement("div");
  lh.className = "line-header";
  lh.textContent = `▼ ${line}`;

  const lc = document.createElement("div");
  lc.className = "line-content";

  lc.append("Mounting", evenOddGrid(g.mounting));
  lc.append("Final Inspection", evenOddGrid(g.finalInspection));

  if (g.finishUnbox) lc.append("Finish Unbox", simpleGrid(g.finishUnbox));
  if (g.handstone) lc.append("Handstone", simpleGrid(g.handstone));

  lh.onclick = () => {
    lc.style.display = lc.style.display === "none" ? "block" : "none";
  };

  finish.c.append(lh, lc);
});

app.appendChild(finish.s);

const arIn = section("AR Inside");
arIn.c.appendChild(simpleGrid(data.arInside));
app.appendChild(arIn.s);

const arOut = section("AR Outside");
["groupA", "groupB"].forEach((g, i) => {
  const h = document.createElement("div");
  h.className = "sub-header";
  h.textContent = i === 0 ? "Basket Group A" : "Basket Group B";
  arOut.c.append(h, simpleGrid(data.arOutside[g]));
});
app.appendChild(arOut.s);

/* ===============================
   BACK BUTTON
   =============================== */

const backBtn = document.createElement("button");
backBtn.className = "back-btn";
backBtn.textContent = "← Back";
backBtn.onclick = () => window.location.href = "index.html";
app.appendChild(backBtn);
