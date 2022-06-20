let filtersOn = false

const getCookies = function(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (pair[0] == name)
            return pair[1];
    }
    return null;
};

const createProfilDiv = (username, image) => {
    const profilDiv = [...document.querySelectorAll(".profil")]
    profilDiv.forEach(element => {
        element.innerHTML = ""
        const imgDiv = document.createElement("div")
        imgDiv.className = "profilHeadPP"
        imgDiv.style.backgroundImage = "url(" + image + ")"
        element.appendChild(imgDiv)
        element.href = "/profil?pseudo=" + username
    })
}

const changeHeader = () => {
    const username = getCookies("pseudo")
    if (!username) {
        return
    }
    console.log(username)
    fetch("/getinfos", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: username
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            console.log(data)
                // console.log(data.Pseudonyme, data.Image)
            createProfilDiv(username, data.Image)
        })
        .catch(err => {
            console.log(err.err)
        })
}



const stickyNavOnScroll = () => {
    const nav = document.querySelector(".navbar-tc")
    var lastScrollTop = 0;

    window.addEventListener("scroll", function() { // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop) {
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
changeHeader()
stickyNavOnScroll()
menuBurger()