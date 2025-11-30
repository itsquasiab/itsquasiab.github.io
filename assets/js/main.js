/* dark light mode */
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
    if (theme === "system") {
        const systemTheme = prefersDark.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

// Load theme on every page
(function initTheme() {
    const saved = localStorage.getItem("theme") || "system";
    applyTheme(saved);
})();

// Listen for system changes if using system theme
prefersDark.addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
    }
});

// Optional: attach to buttons if they exist on this page
document.addEventListener("DOMContentLoaded", () => {
    const lightBtn = document.getElementById("light-btn");
    const darkBtn = document.getElementById("dark-btn");
    const systemBtn = document.getElementById("system-btn");

    if (lightBtn) lightBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "light");
        applyTheme("light");
    });

    if (darkBtn) darkBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
    });

    if (systemBtn) systemBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "system");
        applyTheme("system");
    });
});

/* binary grid */

const canvas = document.getElementById("binary-canvas");
const ctx = canvas.getContext("2d");

function getCSSColor(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();

window.addEventListener("resize", () => {
    resize();
    generateGrid();
});

const cellSize = 24;
let grid = [];

// Offsets to center the grid on the screen
let offsetX = 0;
let offsetY = 0;

function generateGrid() {
    // Math.ceil ensures the grid covers the whole screen
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);

    // Calculate the starting position to ensure the grid is perfectly centered
    // (This creates equal margins or equal overflow on both sides)
    offsetX = (canvas.width - cols * cellSize) / 2;
    offsetY = (canvas.height - rows * cellSize) / 2;

    grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Math.random() < 0.5 ? 0 : 1
        )
    );
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Space Grotesk";

    // --- FIX STARTS HERE ---
    // 1. Set alignment to the true center of the text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const color0 = getCSSColor("--primary-foreground") || "#333"; // Fallback color if var missing
    const color1 = getCSSColor("--primary") || "#0f0"; // Fallback color

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const bit = grid[y][x];
            ctx.fillStyle = bit === 0 ? color0 : color1;

            // 2. Calculate the center of the specific cell
            // Start at offset + (x * size) + (half the size to reach the middle)
            const posX = offsetX + (x * cellSize) + (cellSize / 2);
            const posY = offsetY + (y * cellSize) + (cellSize / 2);

            ctx.fillText(bit, posX, posY);
        }
    }
    // --- FIX ENDS HERE ---
}

function flipBits() {
    // Only flip existing bits, don't regenerate the array (performance)
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            grid[y][x] = Math.random() < 0.5 ? 0 : 1;
        }
    }
    drawGrid();
}

// Initialize
generateGrid();
drawGrid();

// Flip bits every 0.5 seconds
setInterval(flipBits, 500);

/* clock */

function updateClock() {
    const clock = document.getElementById("clock");
    const dateEl = document.getElementById("date");
    const now = new Date();

    // Format time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;

    // Format date as Day / Date / MonthName / Year
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const dayName = days[now.getDay()];
    const date = String(now.getDate()).padStart(2, "0");
    const monthName = months[now.getMonth()]; // 0-indexed
    const year = now.getFullYear();

    dateEl.textContent = `${dayName}, ${date} ${monthName} ${year}`;
}

// Update every second
setInterval(updateClock, 1000);

// Initialize immediately
updateClock();

/* switch button */

const switchBtn = document.getElementById("switch-btn");
const content1 = document.getElementById("clock-content");
const content2 = document.getElementById("main-content");

// Initialize button text
switchBtn.textContent = "clock";

switchBtn.addEventListener("click", () => {
    content1.classList.toggle("hidden");
    content2.classList.toggle("hidden");

    // Update button text based on which content is visible
    if (!content1.classList.contains("hidden")) {
        switchBtn.textContent = "main";
    } else {
        switchBtn.textContent = "clock";
    }
});