const ASSET_BASE = "https://raw.githubusercontent.com/b-1-o/wqnui/main/assets";

const IMAGES = [
  "more.jpg",
  "blfr.jpg",
  "assa.jpg",
  "luja.jpg",
  "chhc.jpg",
  "snow.jpg",
  "alal.jpg",
  "anhy.jpg",
  "provo.jpg",
  "pixi.jpg",
];

// Start downloading every visual asset immediately so Telegram WebView never
// has to fetch a background at the exact moment it becomes visible.
for (const file of IMAGES) {
  const img = new Image();
  img.decoding = "async";
  img.src = `${ASSET_BASE}/${file}`;
  void img.decode?.().catch(() => {});
}
