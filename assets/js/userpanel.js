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

const createPost = () => {
    const title = document.querySelector("#post-popup .popup #title").value
    const content = tinymce.get("mytextarea").getContent()
    const tags = tabTags.filter(elem => {
        return elem.classList.contains("choosed")
    })
    const tagsValues = tags.map(elem => {
        return elem.value
    })
    fetch("/adduser", {
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
            location.href = "/users"
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
}

const addUserDiv = (id, image, username, date, content) => {
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
    console.log(container)
    document.querySelector(".suggestedUsers").appendChild(container)
    console.log(document.querySelector(".suggestedUsers"))
}

addUserDiv(1, "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png", "Chatte", "24/01/2001", "Hey sale queue j'aime la suze")
addUserDiv(1, "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png", "Dhatte", "24/01/2001", "Hey sale queudfre glkjndhqz fbhdrscnq jgnsbkdjfs nqkfjve j'aime la suze")
addUserDiv(1, "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png", "Ehatte", "24/01/2001", "Hey sale queue j'aizd eéeéeddéde la suze")
addUserDiv(1, "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png", "Hhatte", "24/01/2001", "Hey sale queuela suze")