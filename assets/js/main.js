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

// Load theme on page load
(function initTheme() {
    const saved = localStorage.getItem("theme") || "system";
    applyTheme(saved);
})();

// Auto update if system changes
prefersDark.addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const lightBtn = document.getElementById("light-btn");
    const darkBtn = document.getElementById("dark-btn");
    const systemBtn = document.getElementById("system-btn");

    const themeButtons = [lightBtn, darkBtn, systemBtn];

    function updateActiveThemeButton(theme) {
        themeButtons.forEach(btn => btn?.classList.remove("active"));

        if (theme === "light") lightBtn?.classList.add("active");
        if (theme === "dark") darkBtn?.classList.add("active");
        if (theme === "system") systemBtn?.classList.add("active");
    }

    // Restore active button
    updateActiveThemeButton(localStorage.getItem("theme") || "system");

    lightBtn?.addEventListener("click", () => {
        localStorage.setItem("theme", "light");
        applyTheme("light");
        updateActiveThemeButton("light");
    });

    darkBtn?.addEventListener("click", () => {
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
        updateActiveThemeButton("dark");
    });

    systemBtn?.addEventListener("click", () => {
        localStorage.setItem("theme", "system");
        applyTheme("system");
        updateActiveThemeButton("system");
    });

    function applyColor(color) {
        document.documentElement.setAttribute("data-color", color);
        localStorage.setItem("color", color);

        document.querySelectorAll(".color-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.color === color);
        });
    }

    // Load saved color
    applyColor(localStorage.getItem("color") || "light_blue");

    // Attach event
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            applyColor(btn.dataset.color);
        });
    });

});

/* switch button */

const homeBtn = document.getElementById("home-btn");
const clockBtn = document.getElementById("clock-btn");
const settingsBtn = document.getElementById("settings-btn");

const homeContent = document.getElementById("home-content");
const clockContent = document.getElementById("clock-content");
const settingsContent = document.getElementById("settings-content");

function showContent(target) {
    homeContent.classList.add("hidden");
    clockContent.classList.add("hidden");
    settingsContent.classList.add("hidden");

    // remove active class from all
    homeBtn.classList.remove("active");
    clockBtn.classList.remove("active");
    settingsBtn.classList.remove("active");

    // show selected
    document.getElementById(target + "-content").classList.remove("hidden");

    // highlight active button
    document.getElementById(target + "-btn").classList.add("active");
}

homeBtn.addEventListener("click", () => showContent("home"));
clockBtn.addEventListener("click", () => showContent("clock"));
settingsBtn.addEventListener("click", () => showContent("settings"));

// default: show main
showContent("home");

/* settings content switcher */

const appearanceBtn = document.getElementById("appearance-btn");
const aboutBtn = document.getElementById("about-btn");

const appearancePage = document.getElementById("appearance-page");
const aboutPage = document.getElementById("about-page");

function activateTab(activeBtn, activePage) {
    // remove active from both buttons
    appearanceBtn.classList.remove("active");
    aboutBtn.classList.remove("active");

    // hide both pages
    appearancePage.classList.add("hidden");
    aboutPage.classList.add("hidden");

    // activate the clicked one
    activeBtn.classList.add("active");
    activePage.classList.remove("hidden");
}

appearanceBtn.addEventListener("click", () => {
    activateTab(appearanceBtn, appearancePage);
});

aboutBtn.addEventListener("click", () => {
    activateTab(aboutBtn, aboutPage);
});

// optional: default to appearance
activateTab(appearanceBtn, appearancePage);