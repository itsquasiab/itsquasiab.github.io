function navbarMenu() {
    var navResponsive = document.getElementById("nav");
    if (navResponsive.className === "nav-menu") {
        navResponsive.className += " responsive";
    } else {
        navResponsive.className = "nav-menu";
    }
}
