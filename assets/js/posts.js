const addChoosed = (value) => {
    const tags = document.querySelector(".tags-filters")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
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
        const content = tinymce.get("mytextarea").getContent()
        const tabTags = [...document.querySelectorAll(".tags button")]
        const tags = tabTags.filter(elem => {
            return elem.classList.contains("choosed")
        })
        const tagsValues = tags.map(elem => {
            return elem.value
        })
        console.log(tagsValues)
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
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    /* End Create post Requests Api */

/* Get All Posts */

const addPostDiv = (id, title, username, image, content) => {
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
    const usernameDiv = document.createElement("div")
    usernameDiv.className = "username"
    usernameDiv.innerText = username
    const titleDiv = document.createElement("div")
    titleDiv.className = "title"
    titleDiv.innerText = title

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

    icons.appendChild(likeIcon)
    icons.appendChild(commentsIcon)

    infoUser.appendChild(imgCtn)
    infoUser.appendChild(usernameDiv)
    infoUser.appendChild(titleDiv)

    innerPost.appendChild(infoUser)
    innerPost.appendChild(contentDiv)
    innerPost.appendChild(icons)

    section.appendChild(innerPost)
    document.querySelector(".all-posts").appendChild(section)
}

const getPosts = () => {
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
        .then(data => {
            data.forEach(element => {
                addPostDiv(element.PostID, element.Title, element.SenderID, "../assets/images/defaultProfil.jpg", element.Content)
            })
        })
        .catch(err => {
            console.log(err)
        })


}

/* End Get All Posts */

/* Create post text zone */

tinymce.init({

    selector: '#mytextarea',

    plugins: [

        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',

        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',

        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'

    ],

    toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +

        'alignleft aligncenter alignright alignjustify | ' +

        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help '
});


/* Pagination */

const postsData = {
    maxPosts: 50,
    count: 3,
    sizePagination: 3,
    page: 1
}

const pagination = () => {
    // const slider = document.querySelector(".display-pages");
    const slides = document.querySelectorAll(".slide");
    const button = document.querySelectorAll(".arrow");

    let current = 0;
    let prev = (slides.length);
    let next = 1;

    /* variables at the beginning */
    let startPrev = slides.length
    let startCurrent = 0
    let startNext = 1

    let endPrev = slides.length - 1
    let endCurrent = slides.length
    let endNext = 0
        /* beginning pagination */
    if (slides[0].innerHTML == 1) {
        pageBtn(startCurrent)
        exactPageBtn(startPrev, startCurrent, startNext)
    } else if ((slides[5].innerHTML == postsData.maxPosts) && (slides[4].innerHTML == postsData.maxPosts - 1)) {
        pageBtn(endCurrent)
        exactPageBtn(endPrev, endCurrent, endNext)
    } else {
        pageBtn(current)
        exactPageBtn(prev, current, next)
    }

    /* Change active page by clicking on Previous / Next btn */
    const pageBtn = (current) => {
        for (let i = 0; i < button.length; i++) {
            button[i].addEventListener("click", () => {
                i == 0 ? goTo("prev", current) : gotoNext("next", current);
            })
        }
    }

    const exactPageBtn = (prev, current, next) => {
        for (let i = 0; i < slides.length - 1; i++) {
            /* Change active page by clicking on exact page*/
            slides[i].addEventListener("click", () => {
                slides.forEach(elem => {
                    elem.classList.remove("pagination:active")
                })
                current = i
                if (current == (slides.length - 2)) {
                    prev = current - 1
                    next = 0
                }
                if (current == 0) {
                    prev = slides.length - 1;
                    next = 1
                }
                slides[i].classList.add("pagination:active")
            })
        }
    }

    const goTo = (prevOrNext, current) => {
        const gotoPrev = () => current > 0 ? gotoNum(current - 1) : gotoNum(slides.length - 2);
        const gotoNext = () => current < slides.length - 2 ? gotoNum(current + 1) : gotoNum(0);
        if (prevOrNext == "prev") {
            gotoPrev()
        } else {
            gotoNext()
        }
    }

    const gotoNum = number => {
        current = number;
        prev = current - 1;
        next = current + 1;
        for (let i = 0; i < slides.length - 1; i++) {
            slides[i].classList.remove("pagination:active");
            slides[i].classList.remove("before");
            slides[i].classList.remove("after");
        }
        if (next == (slides.length - 1)) {
            next = 0;
        }
        if (prev == -1) {
            prev = slides.length - 2;
        }
        addClass(prev, current, next)
        changeInnerSlides(number)
    }

    const changeInnerSlides = (prev, curr, next) => {
        if (curr + 1 == 6) {
            slides.forEach(elem => {
                elem.classList.remove("pagination:active")
            })
            addClass(prev, curr, next)
            for (let i = 0; i < slides.length - 1; i++) {
                slides[i].innerHTML = i + (paginationPosts.sizePagination * paginationPosts.page)
            }
            paginationPosts.endCount += paginationPosts.count
            paginationPosts.page += 1
        }
    }

    const addClass = (prev, curr, next) => {
        slides[prev].classList.add("before")
        slides[curr].classList.add("pagination:active")
        slides[next].classList.add("after")
    }
}


getPosts()

pagination()

/* end Pagination */