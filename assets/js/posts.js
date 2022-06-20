let postsData = {
    maxPosts: 0,
    postsPerPage: 10,
    page: 1,
    tagsChoosed: "",
    ascOrDesc: "descending",
    typeFilter: "Dates"
}

const getUrl = () => {
    const queryString = window.location.search
    const params = Object.fromEntries(new URLSearchParams(queryString))
    const url = new URL(window.location);
    const options = ['tagsChoosed', 'ascOrDesc', 'typeFilter']
    const allTags = ["javascript", "html/css", "golang", "java", "python", "mobile", "appli/logiciel"]
    Object.entries(params).forEach(element => {
        if (options.includes(element[0])) {
            if (element[0] == "ascOrDesc" && element[1] != "ascending" && element[1] != "descending") {
                postsData[element[0]] = "descending"
                url.searchParams.set([element[0]], postsData[element[0]])
                window.history.replaceState({}, '', url)
            } else if (element[0] == "typeFilter" && element[1] != "Dates" && element[1] != "Likes" && element[1] != "Comments") {
                postsData[element[0]] = "Dates"
                url.searchParams.set([element[0]], postsData[element[0]])
                window.history.replaceState({}, '', url)
            } else if (element[0] == "tagsChoosed" && !allTags.includes(element[1])) {
                postsData[element[0]] = ""
                url.searchParams.set([element[0]], postsData[element[0]])
                window.history.replaceState({}, '', url)
            } else {
                postsData[element[0]] = element[1]
            }
        }
    })
}

const getTags = () => {
    const tabTags = [...document.querySelectorAll(".tag-from-filters")]
    const tags = tabTags.filter(elem => {
        return elem.classList.contains("choosed")
    })
    const tagsValues = tags.map(elem => {
        return elem.value
    })
    postsData.tagsChoosed = tagsValues
    const url = new URL(window.location);
    url.searchParams.set("tagsChoosed", `${tagsValues}`)
    window.history.replaceState({}, '', url)
}

const changeSort = (value) => {
    const sortDiv = [...document.querySelectorAll(".sort")]
    const url = new URL(window.location);
    if (value.classList.contains("fa-sort-amount-down-alt")) {
        sortDiv[0].classList.add("sorted")
        sortDiv[1].classList.remove("sorted")
        postsData.ascOrDesc = "ascending"
        url.searchParams.set("ascOrDesc", "ascending")
    } else {
        sortDiv[0].classList.remove("sorted")
        sortDiv[1].classList.add("sorted")
        postsData.ascOrDesc = "descending"
        url.searchParams.set("ascOrDesc", "descending")
    }
    window.history.replaceState({}, '', url)
    getPosts("changePage")
}

const addChoosed = (value) => {
    const tags = document.querySelector(".tags-filters")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
    getTags()
    getPosts("changePage")
}

const addTagsPost = (value) => {
    const tags = document.querySelector(".tags-create-post")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
}

const openPopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.add("active")
}

const closePopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.remove("active")
}

const openFilters = () => {
    const filters = document.querySelector(".filters-container")
    filters.classList.toggle("open")
}

/* Create post Requests Api */

const createPost = () => {
        const title = document.querySelector("#post-popup .popup #title").value
        const errorlog = document.querySelector(".error_message")
        const content = tinymce.get("mytextarea").getContent()
        const tabTags = [...document.querySelectorAll(".tags button")]
        const tags = tabTags.filter(elem => {
            return elem.classList.contains("choosed")
        })
        const tagsValues = tags.map(elem => {
            return elem.value
        })
        fetch("/addpost", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    tags: `${tagsValues}`
                })
            })
            .then(async(res) => {
                if (!res.ok) {
                    throw await res.json()
                }
                return res.json()
            })
            .then(data => {
                closePopup()
                location.href = "/posts"
            })
            .catch(err => {
                errorlog.innerHTML = err.err
                console.log(err)
            })
    }
    /* End Create post Requests Api */

/* Get All Posts */

const addPostDiv = (id, title, username, image, content, likes, nbComments) => {
    const section = document.createElement("SECTION")
    section.setAttribute("id", "post" + id)
    const innerPost = document.createElement("div")
    innerPost.className = "inner-post"
    const infoUser = document.createElement("div")
    infoUser.className = "info-user"

    const imgCtn = document.createElement("div")
    imgCtn.className = "img-ctn"
    const img = document.createElement("img")
    img.setAttribute("src", image)

    const ctnUsernTitl = document.createElement("div")
    ctnUsernTitl.className = "ctnUT"

    const usernameDiv = document.createElement("div")
    usernameDiv.className = "username"
    usernameDiv.innerText = username
    const titleDiv = document.createElement("div")
    titleDiv.className = "title"
    titleDiv.innerText = title
    ctnUsernTitl.appendChild(usernameDiv)
    ctnUsernTitl.appendChild(titleDiv)

    const tagsPost = document.createElement("div")
    tagsPost.className = "tagsPost"


    const contentDiv = document.createElement("div")
    contentDiv.className = "text-ctn"
    contentDiv.innerHTML = content

    const icons = document.createElement("div")
    icons.className = "icons-post"
    const likeIcon = document.createElement("i")
    likeIcon.className = "comment-posts fa fa-heart"
    const commentsIcon = document.createElement("i")
    commentsIcon.className = "comment-posts fa fa-comments"

    imgCtn.appendChild(img)

    const likesDiv = document.createElement("div")
    likesDiv.innerHTML = likes
    icons.appendChild(likesDiv)
    icons.appendChild(likeIcon)
    const commentsDiv = document.createElement("div")
    commentsDiv.innerHTML = nbComments
    icons.appendChild(commentsDiv)
    icons.appendChild(commentsIcon)

    infoUser.appendChild(imgCtn)
    infoUser.appendChild(ctnUsernTitl)
    

    innerPost.appendChild(infoUser)
    innerPost.appendChild(contentDiv)
    innerPost.appendChild(icons)

    section.appendChild(innerPost)
    if (title != "Aucun résultat") {
        section.addEventListener('click', function() {
            location.href = '/singlepost?id=' + id
        }, false);
    }
    document.querySelector(".all-posts").appendChild(section)

}

const getUser = (userID) => {
    const promise = fetch("/getuser", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: userID
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            return data
        })
        .catch(err => {
            console.log(err)
        })
    return promise
}


const getComments = (tabID) => {
    let allPostsID = tabID
    const promise = fetch("/getposts", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            data.forEach(element => {
                if (allPostsID.includes(element.ParentID)) {
                    allPostsID.push(element.PostID)
                }
            })
            return allPostsID
        })
        .catch(err => {
            console.log(err)
        })
    return promise
}

const checkValue = (value, userData, element) => {
    if (userData.Pseudonyme.toLowerCase().includes(value.toLowerCase()) ||
        element.Content.toLowerCase().includes(value.toLowerCase()) ||
        element.Title.toLowerCase().includes(value.toLowerCase()) ||
        value == ""
    ) {
        return true
    }
    return false
}

const checkValueFromPage = (index) => {
    const slides = [...document.querySelectorAll(".slide")]
    let currentPage;
    slides.forEach(element => {
        if (element.classList.contains("pagination:active")) {
            currentPage = parseInt(element.innerHTML) - 1
        }
    })
    const firstNum = postsData.postsPerPage * currentPage + 1
    const lastNum = postsData.postsPerPage * currentPage + postsData.postsPerPage
    if ((firstNum <= index + 1) && (index + 1 <= lastNum)) {
        return true
    }
    return false
}

const getPosts = (verification) => {
    const queryString = window.location.search
    const params = Object.fromEntries(new URLSearchParams(queryString))
    let searchValue = "";
    let maxPosts = 0;
    if (params.search != null) {
        searchValue = params.search
    }
    const postsDiv = document.querySelector(".all-posts")
    postsDiv.innerHTML = ""
    fetch("/getposts", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(async(data) => {
            getUrl()
            let resultsTab = [];
            for (const element of data) {
                try {
                    const userData = await getUser(element.SenderID)
                    const nbComments = await getComments([element.PostID])
                    if (checkValue(searchValue, userData, element) && element.ParentID == 0) {
                        resultsTab.push([element, userData, nbComments])
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            let filteredTabTags = resultsTab.filter(post => {
                return filterByTag(postsData.tagsChoosed, post[0])
            })
            if (postsData.typeFilter == "Likes") {
                filteredTabTags = filterByLikes(filteredTabTags)
            } else if (postsData.typeFilter == "Comments") {
                filteredTabTags = filterByComments(filteredTabTags)
            } else if (postsData.typeFilter == "Dates") {
                filteredTabTags = filterByDates(filteredTabTags)
            }
            console.log(filteredTabTags)
            maxPosts = filteredTabTags.length
            if (maxPosts == 0) {
                postsDiv.innerHTML = ""
                initPagination(1)
                addPostDiv(0, "Aucun résultat", "TUC'rack", "../assets/images/Fichier 1.svg", "", 0, 0)
            }
            if (verification !== undefined) {
                initPagination(maxPosts)
            }

            filteredTabTags.forEach((element, index) => {
                if (checkValueFromPage(index)) {
                    addPostDiv(element[0].PostID, element[0].Title, element[1].Pseudonyme, element[1].Image, element[0].Content.substring(0, 500), element[0].Likes, element[2].length - 1)
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
}

/* End Get All Posts */


const filtersBy = () => {
    const choice = [...document.querySelectorAll(".choice")]
    const url = new URL(window.location);
    choice.forEach(elem => {
        if (elem.checked) {
            if (elem.classList.contains("likes-filter")) {
                postsData.typeFilter = "Likes"
                url.searchParams.set("typeFilter", "Likes")
            } else if (elem.classList.contains("comments-filter")) {
                postsData.typeFilter = "Comments"
                url.searchParams.set("typeFilter", "Comments")
            } else {
                postsData.typeFilter = "Dates"
                url.searchParams.set("typeFilter", "Dates")
            }
        }
    })
    window.history.replaceState({}, '', url)
    getPosts("e")
}



const filterByTag = (tab, element) => {
    let includesTag = false
    if (tab.length == 0) {
        return true
    } else {
        for (let i = 0; i < tab.length; i++) {
            if (element.Tags.includes(tab[i])) {
                includesTag = true
            } else {
                return false
            }
        }
    }
    return includesTag
}

const filterByLikes = (tab) => {
    sortedTab = tab.sort((a, b) => a[0].Likes - b[0].Likes)
    if (postsData.ascOrDesc == "descending") {
        sortedTab = sortedTab.reverse()
    }
    return sortedTab
}

const filterByComments = (tab) => {
    sortedTab = tab.sort((a, b) => (a[2].length - 1) - (b[2].length - 1))
    if (postsData.ascOrDesc == "descending") {
        sortedTab = sortedTab.reverse()
    }
    return sortedTab
}

const filterByDates = (tab) => {
    sortedTab = tab.sort((a, b) => new Date(a[0].Date) - new Date(b[0].Date))
    if (postsData.ascOrDesc == "descending") {
        sortedTab = sortedTab.reverse()
    }
    return sortedTab
}

/* Searchbar */

const changeSearchValue = () => {
        const searchInput = document.querySelector(".searchTerm")
        const url = new URL(window.location);
        url.searchParams.set("search", searchInput.value)
        window.history.replaceState({}, '', url)
        getPosts("change")
    }
    /* End searchbar */

/* Create post text zone */

tinymce.init({

    selector: '#mytextarea',

    plugins: [

        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',

        'lists', 'link', 'image code', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',

        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'

    ],

    toolbar: 'undo redo | image code | formatpainter casechange blocks | bold italic backcolor | ' +

        'alignleft aligncenter alignright alignjustify | ' +

        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help ',
    images_upload_url: 'postAcceptor.php',
});


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
    console.log(postsData.page)
    if (nbPages !== undefined) {
        postsData.page = Math.ceil(nbPages / 10)
    }
    const slideType = [...slides]
    const parent = document.querySelector(".display-pages")
    if (postsData.page > 5) {
        slides[0].innerHTML = 1
        slides[1].innerHTML = 2
        slides[2].innerHTML = 3
        slides[3].innerHTML = 4
        slides[4].innerHTML = postsData.page
    } else {
        parent.innerHTML = ""
        for (let i = 0; i < postsData.page; i++) {
            slideType[i].innerHTML = i + 1
            parent.append(slideType[i])
        }
        addClasses(0)
    }

}

const goToNext = () => {
    const slides = document.querySelectorAll(".slide");

    if (postsData.page >= 5) {
        if (slides[0].classList.contains("pagination:active")) {
            addClasses(1)
        } else if (slides[1].classList.contains("pagination:active")) {
            addClasses(2)
        } else if ((parseInt(slides[2].innerHTML) == (postsData.page - 2)) && slides[2].classList.contains("pagination:active")) {
            addClasses(3)

        } else if (parseInt(slides[3].innerHTML) == (postsData.page - 1)) {
            addClasses(4)
        } else {
            slides[1].innerHTML = slides[2].innerHTML
            slides[2].innerHTML = slides[3].innerHTML
            slides[3].innerHTML = parseInt(slides[3].innerHTML) + 1
        }
    } else {
        if (slides[postsData.page - 1].classList.contains("pagination:active") != true) {
            if (slides[0].classList.contains("pagination:active")) {
                addClasses(1)
            } else if (slides[1].classList.contains("pagination:active")) {
                addClasses(2)
            } else if (slides[2].classList.contains("pagination:active")) {
                addClasses(3)
            }
        }
    }
    getPosts()
}

const goToPrev = () => {
    const slides = document.querySelectorAll(".slide");

    if (postsData.page >= 5) {
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
            if (slides[postsData.page - 1].classList.contains("pagination:active")) {
                addClasses(postsData.page - 2)
            } else if (slides[postsData.page - 2].classList.contains("pagination:active")) {
                addClasses(postsData.page - 3)
            } else if (slides[postsData.page - 3].classList.contains("pagination:active")) {
                addClasses(postsData.page - 4)
            }
        }
    }
    getPosts()
}

const goToNum = (value) => {
    const slides = document.querySelectorAll(".slide");
    const index = value.innerHTML
    if (postsData.page >= 5) {
        if (parseInt(value.innerHTML) == postsData.page) {
            changerInnerText(1, postsData.page - 3, postsData.page - 2, postsData.page - 1, postsData.page)
            addClasses(4)
        } else if (parseInt(value.innerHTML) == 1) {
            changerInnerText(1, 2, 3, 4, postsData.page)
            addClasses(0)
        } else if ((value.classList.contains("mid-left") && (value.innerHTML != 2)) || (value.classList.contains("mid-right") && (value.innerHTML != postsData.page - 1))) {
            changerInnerText(1, parseInt(value.innerHTML) - 1, parseInt(value.innerHTML), parseInt(value.innerHTML) + 1, postsData.page)
            addClasses(2)
        } else if ((value.classList.contains("mid"))) {
            addClasses(2)
        } else if (value.classList.contains("mid-left") && (parseInt(slides[0].innerHTML) == 1)) {
            addClasses(1)
        } else if (value.classList.contains("mid-right") && (parseInt(slides[4].innerHTML) == postsData.page)) {
            addClasses(3)
        }
    } else {
        addClasses(index - 1)
    }
    getPosts()
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

getPosts("initialisation")