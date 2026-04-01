/* binary grid */

const canvas = document.getElementById("binary-grid");
const ctx = canvas.getContext("2d");

function getCSSColor(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName).trim();
}

const cellSize = 24;
let grid = [];
let offsetX = 0;
let offsetY = 0;

function resizeCanvas() {
    const dpr = (window.devicePixelRatio || 1) * 1.5;

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    // Set canvas CSS size
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    // Set REAL pixel size for sharp rendering
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    // Scale the drawing operations
    ctx.scale(dpr, dpr);
}

function generateGrid() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    offsetX = (width - cols * cellSize) / 2;
    offsetY = (height - rows * cellSize) / 2;

    grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Math.random() < 0.5 ? 0 : 1
        )
    );
}

function drawGrid() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    ctx.font = "16px Space Grotesk";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const color0 = getCSSColor("--accent");
    const color1 = getCSSColor("--primary");

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            ctx.fillStyle = grid[y][x] === 0 ? color0 : color1;
            const posX = offsetX + (x * cellSize) + (cellSize / 2);
            const posY = offsetY + (y * cellSize) + (cellSize / 2);
            ctx.fillText(grid[y][x], posX, posY);
        }
    }
}

function flipBitsAndDraw() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            grid[y][x] = Math.random() < 0.5 ? 0 : 1;
        }
    }
    drawGrid();
}

(async () => {
    // Ensure fonts + CSS variables are loaded
    await document.fonts.ready;

    // Next frame ensures all layout/CSS is stable
    requestAnimationFrame(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // safety reset
        resizeCanvas();
        generateGrid();
        drawGrid();
    });
})();

window.addEventListener("resize", () => {
    // Reset transform before resizing again to avoid stacking scales
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    resizeCanvas();
    generateGrid();
    drawGrid();
});

/* clock */

let lastSecond = -1; // Tracks seconds for the binary flip
let lastDateString = ""; // **Tracks the formatted date for the daily update**

function updateClock() {
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = now.getSeconds();
    const formattedSeconds = String(seconds).padStart(2, "0");

    // Fix: Only update if the element exists on the current page
    if (timeEl) {
        timeEl.textContent = `${hours}:${minutes}:${formattedSeconds}`;
    }

    // Binary flip logic (This runs even if the clock text is hidden!)
    if (seconds !== lastSecond) {
        flipBitsAndDraw();
        lastSecond = seconds;
    }

    // Date logic
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDateString = `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`;

    // Fix: Only update if the element exists AND the date changed
    if (dateEl && currentDateString !== lastDateString) {
        dateEl.textContent = currentDateString;
        lastDateString = currentDateString;
    }
}

// Use a single, fast interval for high-accuracy synchronization
setInterval(updateClock, 50);

// Initialize immediately
updateClock();