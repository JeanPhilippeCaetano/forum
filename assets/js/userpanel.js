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
            location.href = "/users"
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
}

const addUserDiv = (img, username, username, image, content, likes) => {
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

    const likesDiv = document.createElement("div")
    likesDiv.innerHTML = likes
    icons.appendChild(likesDiv)
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