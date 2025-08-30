const darkModeToggle = document.getElementById('darkModeToggle');
let isDark = localStorage.getItem('darkMode') === 'enabled' ||
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);

// Apply initial theme
document.body.classList.toggle('dark', isDark);
document.documentElement.setAttribute("data-color-scheme", isDark ? "dark" : "light");

function toggleDarkMode() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    document.documentElement.setAttribute("data-color-scheme", isDark ? "dark" : "light");

    // Force reflow without removing scrollbars
    document.documentElement.classList.add('reflow');
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.classList.remove('reflow');

    // Save mode
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

function navbarMenu() {
    var navResponsive = document.querySelector(".nav-content");
    if (navResponsive.className === "nav-content") {
        navResponsive.className += " responsive";
    } else {
        navResponsive.className = "nav-content";
    }
}

/*window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.nav-menu');
    if (window.scrollY > 0) {
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('shadow');
    }
});*/