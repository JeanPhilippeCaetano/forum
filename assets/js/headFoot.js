let filtersOn = false

const stickyNavOnScroll = () => {
    const nav = document.querySelector(".navbar-tc")
    var lastScrollTop = 0;

    window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){
            nav.classList.add("sticky")
        } else {
            nav.classList.remove("sticky")
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }, false);
}

const menuBurger = () => {
    const menu = document.querySelector(".menu-toggler")
    const navMenu = document.querySelector(".navbar-menu")

    menu.addEventListener("click", () => {
        menu.classList.toggle("active")
        navMenu.classList.toggle("active")
    })
}

stickyNavOnScroll()
menuBurger()