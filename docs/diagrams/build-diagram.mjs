/**
 * Generates architecture.excalidraw.
 *
 * Run from the repo root:
 *   bun docs/diagrams/build-diagram.mjs
 *
 * The diagram is intentionally hand-drawn: open the generated file at
 * https://excalidraw.com to edit it. The checked-in architecture.png and
 * architecture.svg are exports of this scene; re-export them after edits.
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const els = [];

function box(id, x, y, w, h, fill, stroke) {
  els.push({
    type: "rectangle",
    id,
    x,
    y,
    width: w,
    height: h,
    roundness: { type: 3 },
    backgroundColor: fill,
    fillStyle: "solid",
    strokeColor: stroke,
    strokeWidth: 2,
  });
}

function txt(id, x, y, text, fontSize, color) {
  els.push({ type: "text", id, x, y, text, fontSize, strokeColor: color });
}

function badge(id, cx, cy, n) {
  els.push({
    type: "ellipse",
    id: `${id}e`,
    x: cx - 12,
    y: cy - 12,
    width: 24,
    height: 24,
    backgroundColor: "#84cc16",
    fillStyle: "solid",
    strokeColor: "#84cc16",
    strokeWidth: 1,
  });
  els.push({
    type: "text",
    id: `${id}t`,
    x: cx - 4,
    y: cy - 8,
    text: String(n),
    fontSize: 14,
    strokeColor: "#1e1e2e",
  });
}

function arrow(id, x1, y1, x2, y2, color, opts = {}) {
  els.push({
    type: "arrow",
    id,
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    points: [
      [0, 0],
      [x2 - x1, y2 - y1],
    ],
    strokeColor: color,
    strokeWidth: 2,
    endArrowhead: opts.endArrowhead || "arrow",
    startArrowhead: opts.startArrowhead || null,
    strokeStyle: opts.strokeStyle || "solid",
  });
}

// Canvas
els.push({
  type: "rectangle",
  id: "bg",
  x: -20,
  y: -20,
  width: 1240,
  height: 940,
  backgroundColor: "#12141a",
  fillStyle: "solid",
  strokeColor: "transparent",
  strokeWidth: 0,
});
els.push({ type: "cameraUpdate", width: 1200, height: 900, x: 0, y: 0 });

// Heading
txt("title", 50, 30, "knot. — request flow", 32, "#f5f5f5");
txt(
  "subtitle",
  52,
  76,
  "From a pasted URL to a counted click, then back to the dashboard.",
  18,
  "#a0a0a0",
);

// Browser
box("browser", 50, 170, 250, 240, "#1e3a5f", "#4a9eed");
txt("browserTitle", 133, 190, "Browser", 24, "#e5e5e5");
txt(
  "browserBody",
  75,
  245,
  "Landing + auth\nDashboard\nQR codes\n/:shortCode",
  18,
  "#c9d9f0",
);

// API
box("api", 430, 170, 300, 240, "#2d1b69", "#8b5cf6");
txt("apiTitle", 514, 190, "Express API", 24, "#e5e5e5");
txt("apiSub", 520, 225, "Bun · Zod · JWT", 16, "#cbbcf5");
box("chip1", 460, 260, 240, 38, "#3b2a7a", "#8b5cf6");
txt("chip1t", 528, 270, "POST /api/urls", 16, "#e5e5e5");
box("chip2", 460, 306, 240, 38, "#3b2a7a", "#8b5cf6");
txt("chip2t", 540, 316, "GET /:code", 16, "#e5e5e5");

// Cache
box("redis", 870, 140, 280, 120, "#1a4d4d", "#06b6d4");
txt("redisTitle", 932, 160, "Upstash Redis", 24, "#e5e5e5");
txt("redisSub", 921, 205, "cache-aside · 24h TTL", 17, "#a9e8e2");
txt("redisHit", 890, 232, "hit → 302", 15, "#22c55e");

// Database
box("postgres", 870, 320, 280, 150, "#1a4d2e", "#22c55e");
txt("pgTitle", 950, 340, "PostgreSQL", 24, "#e5e5e5");
txt("pgSub", 921, 385, "users · urls · clicks", 17, "#a9e3b8");
txt("pgNote", 946, 413, "unique short_code", 15, "#9fe3b0");

// Event log
box("kafka", 430, 580, 240, 100, "#5c3d1a", "#f59e0b");
txt("kafkaTitle", 520, 595, "Kafka", 24, "#e5e5e5");
txt("kafkaSub", 458, 635, "url.clicks · 3 parts", 16, "#f5d3a1");

// Consumer
box("consumer", 740, 580, 260, 100, "#2d1b69", "#8b5cf6");
txt("consumerTitle", 786, 595, "Click consumer", 24, "#e5e5e5");
txt("consumerSub", 794, 635, "same process today", 17, "#cbbcf5");

// Flow arrows + numbered badges
arrow("a1", 300, 230, 430, 230, "#4a9eed");
badge("n1", 365, 230, 1);
arrow("a7", 430, 340, 300, 340, "#4a9eed");
badge("n7", 365, 340, 7);
arrow("a3", 730, 200, 870, 200, "#06b6d4");
badge("n3", 800, 200, 3);
arrow("a2", 730, 300, 870, 360, "#22c55e", { startArrowhead: "arrow" });
badge("n2", 800, 330, 2);
arrow("a4", 1010, 260, 1010, 320, "#22c55e", { strokeStyle: "dashed" });
badge("n4", 1010, 290, 4);
arrow("a5", 580, 410, 550, 580, "#f59e0b");
badge("n5", 565, 495, 5);
arrow("a6", 1000, 580, 1000, 470, "#ec4899");
badge("n6", 1000, 525, 6);
arrow("aKC", 670, 630, 740, 630, "#f59e0b");

// Legend
txt("flowTitle", 50, 720, "Flow", 20, "#f5f5f5");
const legend = [
  [1, "Browser calls the API (create or open)"],
  [2, "API reads / writes Postgres"],
  [3, "Redirect checks Redis first"],
  [4, "Miss → Postgres, then cache"],
  [5, "Redirect publishes a click event"],
  [6, "Consumer increments the counter"],
  [7, "Dashboard reads the new totals"],
];

legend.forEach(([n, text], i) => {
  const col = i < 4 ? 0 : 1;
  const row = i < 4 ? i : i - 4;
  const bx = col === 0 ? 50 : 620;
  const tx = col === 0 ? 85 : 655;
  const y = 760 + row * 35;
  badge(`L${n}`, bx + 12, y + 12, n);
  txt(`Lt${n}`, tx, y, text, 18, "#d0d0d0");
});

// Excalidraw needs explicit text bounds to render imported text reliably.
const elements = els
  .filter((element) => element.type !== "cameraUpdate")
  .map((element, index) => {
    if (element.type !== "text") return element;

    const lines = element.text.split("\n");
    const maxLine = Math.max(...lines.map((line) => line.length));

    return {
      ...element,
      originalText: element.text,
      fontFamily: 1,
      textAlign: "left",
      verticalAlign: "top",
      lineHeight: 1.25,
      width: Math.ceil(maxLine * element.fontSize * 0.55),
      height: Math.ceil(lines.length * element.fontSize * 1.25),
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 1,
      opacity: 100,
      angle: 0,
      seed: 1000 + index,
      version: 1,
      versionNonce: 1,
      isDeleted: false,
      groupIds: [],
      boundElements: null,
      updated: 1,
      link: null,
      locked: false,
    };
  });

const scene = {
  type: "excalidraw",
  version: 2,
  source: "https://excalidraw.com",
  elements,
  appState: {
    viewBackgroundColor: "#12141a",
    theme: "dark",
    gridSize: 20,
  },
  files: {},
};

const out = join(import.meta.dir, "architecture.excalidraw");
await writeFile(out, JSON.stringify(scene, null, 2) + "\n");
console.log(`Wrote ${out} (${elements.length} elements)`);
