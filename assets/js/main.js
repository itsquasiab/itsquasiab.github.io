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

/* color mode */

function applyColor(color) {
    document.documentElement.setAttribute("data-color", color);
    localStorage.setItem("color", color);

    // update active button
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.color === color);
    });
}

(function initColor() {
    const savedColor = localStorage.getItem("color") || "light_blue";
    applyColor(savedColor);
})();

document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        applyColor(btn.dataset.color);
    });
});

/* dom content loader */

document.addEventListener("DOMContentLoaded", () => {
    const lightBtn  = document.getElementById("light-btn");
    const darkBtn   = document.getElementById("dark-btn");
    const systemBtn = document.getElementById("system-btn");

    const allThemeButtons = [lightBtn, darkBtn, systemBtn];

    function updateActiveThemeButton(theme) {
        allThemeButtons.forEach(btn => btn.classList.remove("active"));

        if (theme === "light")    lightBtn.classList.add("active");
        if (theme === "dark")     darkBtn.classList.add("active");
        if (theme === "system")   systemBtn.classList.add("active");
    }

    // apply active state on load
    const saved = localStorage.getItem("theme") || "system";
    updateActiveThemeButton(saved);

    if (lightBtn) lightBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "light");
        applyTheme("light");
        updateActiveThemeButton("light");
    });

    if (darkBtn) darkBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
        updateActiveThemeButton("dark");
    });

    if (systemBtn) systemBtn.addEventListener("click", () => {
        localStorage.setItem("theme", "system");
        applyTheme("system");
        updateActiveThemeButton("system");
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

// Flip bits every 1 seconds
setInterval(flipBits, 1000);

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

const mainBtn = document.getElementById("main-btn");
const clockBtn = document.getElementById("clock-btn");
const settingsBtn = document.getElementById("settings-btn");

const mainContent = document.getElementById("main-content");
const clockContent = document.getElementById("clock-content");
const settingsContent = document.getElementById("settings-content");

function showContent(target) {
    mainContent.classList.add("hidden");
    clockContent.classList.add("hidden");
    settingsContent.classList.add("hidden");

    // remove active class from all
    mainBtn.classList.remove("active");
    clockBtn.classList.remove("active");
    settingsBtn.classList.remove("active");

    // show selected
    document.getElementById(target + "-content").classList.remove("hidden");

    // highlight active button
    document.getElementById(target + "-btn").classList.add("active");
}

mainBtn.addEventListener("click", () => showContent("main"));
clockBtn.addEventListener("click", () => showContent("clock"));
settingsBtn.addEventListener("click", () => showContent("settings"));

// default: show main
showContent("main");