const googleColors = {
  "#f44336": "Red",
  "#e91e63": "Pink",
  "#9c27b0": "Purple",
  "#673ab7": "Deep Purple",
  "#3f51b5": "Indigo",
  "#2196f3": "Blue",
  "#03a9f4": "Light Blue",
  "#00bcd4": "Cyan",
  "#009688": "Teal",
  "#4caf50": "Green",
  "#8bc34a": "Light Green",
  "#cddc39": "Lime",
  "#ffeb3b": "Yellow",
  "#ffc107": "Amber",
  "#ff9800": "Orange",
  "#ff5722": "Deep Orange",
  "#795548": "Brown",
  "#9e9e9e": "Grey",
  "#607d8b": "Blue Grey"
};

let colorHistory = [];

function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

function getClosestColor(hex) {
  const [r1, g1, b1] = hexToRgb(hex);
  let closest = "";
  let minDist = Infinity;
  for (const [code, name] of Object.entries(googleColors)) {
    const [r2, g2, b2] = hexToRgb(code);
    const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = name;
    }
  }
  return closest;
}

function generateColor() {
  const base = document.getElementById("baseColor").value || "#ffffff";
  const baseRGB = hexToRgb(base);
  const randomRGB = Array(3).fill(0).map(() => Math.random() * 255);
  const ratio = Math.random();
  const finalRGB = baseRGB.map((v, i) => Math.round(v * ratio + randomRGB[i] * (1 - ratio)));
  const hex = rgbToHex(...finalRGB);
  updateUI(hex, ratio);
}

function updateUI(hex, ratio) {
  document.getElementById("colorBox").style.backgroundColor = hex;
  document.getElementById("colorName").textContent = getClosestColor(hex);
  document.getElementById("composition").textContent =
    `${Math.round(ratio * 100)}% Base + ${Math.round((1 - ratio) * 100)}% Random`;
  document.getElementById("hexValue").textContent = hex;

  colorHistory.push(hex);
  updateHistory();
}

function updateHistory() {
  const container = document.getElementById("history");
  container.innerHTML = "";
  colorHistory.slice(-10).forEach(hex => {
    const box = document.createElement("div");
    box.className = "history-box";
    box.style.backgroundColor = hex;
    box.title = hex;
    box.onclick = () => updateUI(hex, 1);
    container.appendChild(box);
  });
}

function searchColor() {
  const input = document.getElementById("colorSearch").value.toLowerCase();
  const found = Object.entries(googleColors).find(([hex, name]) =>
    name.toLowerCase().includes(input)
  );
  if (found) {
    updateUI(found[0], 1);
  } else {
    alert("No matching color found.");
  }
}

function copyHex() {
  const hex = document.getElementById("hexValue").textContent;
  navigator.clipboard.writeText(hex);
  alert("Copied Hex: " + hex);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function downloadColors() {
  const blob = new Blob([JSON.stringify(colorHistory, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "color-history.json";
  a.click();
  URL.revokeObjectURL(url);
}

function clearHistory() {
  colorHistory = [];
  updateHistory();
}

function randomBaseColor() {
  const keys = Object.keys(googleColors);
  const randomHex = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById("baseColor").value = randomHex;
}
