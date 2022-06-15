let usersData = {
    maxUsers: 0,
    usersPerPage: 10,
    page: 1,
}

const checkValue = (value, element) => {
    if (element.Pseudonyme.toLowerCase().includes(value.toLowerCase()) ||
    value == ""
    ) {
        return true
    }
    return false
}

const changeSearchValue = () => {
    const searchInput = document.querySelector(".userpanel")
    const url = new URL(window.location);
    url.searchParams.set("search", searchInput.value)
    window.history.replaceState({}, '', url)
    getUsers("change")
}

const checkValueFromPage = (index) => {
    const slides = [...document.querySelectorAll(".slide")]
    let currentPage;
    slides.forEach(element => {
        if (element.classList.contains("pagination:active")) {
            currentPage = parseInt(element.innerHTML) - 1
        }
    })
    const firstNum = usersData.usersPerPage * currentPage + 1
    const lastNum = usersData.usersPerPage * currentPage + usersData.usersPerPage
    if ((firstNum <= index + 1) && (index + 1 <= lastNum)) {
        return true
    }
    return false
}

const addUserDiv = (id, image, username, date, content) => {
    console.log(id, image, username, date, content) 
    const container = document.createElement("a")
    container.setAttribute("id", "user" + id)
    container.className = "user-total"
    const topUser = document.createElement("div")
    topUser.className = "top-user"
    const imgCtn = document.createElement("div")
    imgCtn.className = "img-container"
    const img = document.createElement("img")
    img.className = "userIcon"
    img.setAttribute("src", image)


    const userInfo = document.createElement("div")
    userInfo.className = "userInfo"
    const pseudo = document.createElement("div")
    pseudo.className = "pseudo"
    pseudo.innerText = username
    const regDate = document.createElement("div")
    regDate.className = "regDate"
    regDate.innerText = date

    const biography = document.createElement("div")
    biography.className = "biography"
    biography.innerHTML = content

    imgCtn.appendChild(img)

    userInfo.appendChild(pseudo)
    userInfo.appendChild(regDate)

    topUser.appendChild(imgCtn)
    topUser.appendChild(userInfo)

    container.appendChild(topUser)
    container.appendChild(biography)
    document.querySelector(".suggestedUsers").appendChild(container)
}

const getUsers = (verification) => {
    const queryString = window.location.search
    const params = Object.fromEntries(new URLSearchParams(queryString))
    let searchValue = "";
    let maxUsers = 0;
    if (params.search != null) {
        searchValue = params.search
    }
    const usersDiv = document.querySelector(".suggestedUsers")
    usersDiv.innerHTML = ""
    fetch("/getusers", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
    })
        .then(async (res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(async (data) => {
            let resultsTab = [];
            for (const element of data) {
                if (checkValue(searchValue, element)) {
                    maxUsers += 1
                    if (verification !== undefined) {
                        initPagination(maxUsers)
                    }
                    resultsTab.push(element)

                }
            }
            resultsTab.forEach((element, index) => {
                if (checkValueFromPage(index)) {
                    addUserDiv(element.UserID, element.Image, element.Pseudonyme, "date à faire", element.Biography)
                }
            })
        })
        .catch(err => {
            console.log(err)
        })

}


/* Pagination */

const removeClasses = () => {
    const slides = document.querySelectorAll(".slide");
    slides.forEach(elem => {
        elem.classList.remove("pagination:active")
    })
}

const addClasses = (current) => {
    removeClasses()
    const slides = document.querySelectorAll(".slide");
    slides[current].classList.add("pagination:active")
}

const slides = document.querySelectorAll(".slide");

const initPagination = (nbPages) => {
    if (nbPages !== undefined) {
        usersData.page = Math.ceil(nbPages / 10)
    }
    const slideType = [...slides]
    const parent = document.querySelector(".display-pages")
    if (usersData.page > 5) {
        slides[0].innerHTML = 1
        slides[1].innerHTML = 2
        slides[2].innerHTML = 3
        slides[3].innerHTML = 4
        slides[4].innerHTML = usersData.page
    } else {
        parent.innerHTML = ""
        for (let i = 0; i < usersData.page; i++) {
            slideType[i].innerHTML = i + 1
            parent.append(slideType[i])
        }
        addClasses(0)
    }

}

const goToNext = () => {
    const slides = document.querySelectorAll(".slide");

    if (usersData.page >= 5) {
        if (slides[0].classList.contains("pagination:active")) {
            addClasses(1)
        } else if (slides[1].classList.contains("pagination:active")) {
            addClasses(2)
        } else if ((parseInt(slides[2].innerHTML) == (usersData.page - 2)) && slides[2].classList.contains("pagination:active")) {
            addClasses(3)

        } else if (parseInt(slides[3].innerHTML) == (usersData.page - 1)) {
            addClasses(4)
        } else {
            slides[1].innerHTML = slides[2].innerHTML
            slides[2].innerHTML = slides[3].innerHTML
            slides[3].innerHTML = parseInt(slides[3].innerHTML) + 1
        }
    } else {
        if (slides[usersData.page - 1].classList.contains("pagination:active") != true) {
            if (slides[0].classList.contains("pagination:active")) {
                addClasses(1)
            } else if (slides[1].classList.contains("pagination:active")) {
                addClasses(2)
            } else if (slides[2].classList.contains("pagination:active")) {
                addClasses(3)
            }
        }
    }
    getUsers()
}

const goToPrev = () => {
    const slides = document.querySelectorAll(".slide");

    if (usersData.page >= 5) {
        if (slides[4].classList.contains("pagination:active")) {
            addClasses(3)
        } else if (slides[3].classList.contains("pagination:active")) {
            addClasses(2)
        } else if ((parseInt(slides[2].innerHTML) == 3) && slides[2].classList.contains("pagination:active")) {
            addClasses(1)

        } else if (parseInt(slides[1].innerHTML) == 2) {
            addClasses(0)
        } else {
            slides[3].innerHTML = parseInt(slides[2].innerHTML)
            slides[2].innerHTML = parseInt(slides[1].innerHTML)
            slides[1].innerHTML = parseInt(slides[2].innerHTML) - 1
        }
    } else {
        if (slides[0].classList.contains("pagination:active") != true) {
            if (slides[usersData.page - 1].classList.contains("pagination:active")) {
                addClasses(usersData.page - 2)
            } else if (slides[usersData.page - 2].classList.contains("pagination:active")) {
                addClasses(usersData.page - 3)
            } else if (slides[usersData.page - 3].classList.contains("pagination:active")) {
                addClasses(usersData.page - 4)
            }
        }
    }
    getUsers()
}

const goToNum = (value) => {
    const slides = document.querySelectorAll(".slide");
    const index = value.innerHTML
    if (usersData.page >= 5) {
        if (parseInt(value.innerHTML) == usersData.page) {
            changerInnerText(1, usersData.page - 3, usersData.page - 2, usersData.page - 1, usersData.page)
            addClasses(4)
        } else if (parseInt(value.innerHTML) == 1) {
            changerInnerText(1, 2, 3, 4, usersData.page)
            addClasses(0)
        } else if ((value.classList.contains("mid-left") && (value.innerHTML != 2)) || (value.classList.contains("mid-right") && (value.innerHTML != usersData.page - 1))) {
            changerInnerText(1, parseInt(value.innerHTML) - 1, parseInt(value.innerHTML), parseInt(value.innerHTML) + 1, usersData.page)
            addClasses(2)
        } else if ((value.classList.contains("mid"))) {
            addClasses(2)
        } else if (value.classList.contains("mid-left") && (parseInt(slides[0].innerHTML) == 1)) {
            addClasses(1)
        } else if (value.classList.contains("mid-right") && (parseInt(slides[4].innerHTML) == usersData.page)) {
            addClasses(3)
        }
    } else {
        addClasses(index - 1)
    }
    getUsers()
}

const changerInnerText = (first, second, third, fourth, fifth) => {
    const slides = document.querySelectorAll(".slide");
    slides[0].innerHTML = first
    slides[1].innerHTML = second
    slides[2].innerHTML = third
    slides[3].innerHTML = fourth
    slides[4].innerHTML = fifth
}

/* end Pagination */

getUsers("initialization")