const getCookie = function(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (pair[0] == name)
            return pair[1];
    }
    return null;
};

let objUsernameConnected = new Object();
let objUser = new Object();

const addPostDiv = (id, title, username, image, content, likes) => {
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
    section.addEventListener('click', function() {
        location.href = '/singlepost?id=' + id
    }, false);

    document.querySelector(".choiceContent").appendChild(section)
}

const addCommentDiv = (id, title, username, image, content, likes) => {
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

    document.querySelector(".choiceContent").appendChild(section)
}


const getUserInfos = (username) => {
    const promise = fetch("/getinfos", {
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
            return data
        })
        .catch(err => {
            console.log(err.err)
        })
    return promise
}

const downrank = () => {
    const query = new URLSearchParams(window.location.search)
    fetch("/changerole", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: query.get("pseudo"),
                newrank: "Utilisateur"
            })
        })
        .then(res => {
            return res
        })
        .then(data => { location.href = "/profil?pseudo=" + query.get("pseudo") })
        .catch(err => {
            console.log(err.err)
        })
    getInfos()
}

const uprank = () => {
    const query = new URLSearchParams(window.location.search)
    fetch("/changerole", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: query.get("pseudo"),
                newrank: "Modérateur"
            })
        })
        .then(res => {
            return res
        })
        .then(data => {
            location.href = "/profil?pseudo=" + query.get("pseudo")
        })
        .catch(err => {
            console.error(err.err)
        })
    getInfos()
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

const getInfos = (tri) => {
    const pseudo = document.querySelector(".nameUsers h1")
    const imgDiv = document.querySelector(".imgDiv")
    const biography = document.querySelector(".biography p")
    const rank = document.querySelector(".rank")
    const usernameConnected = getCookie("pseudo")
    const query = new URLSearchParams(window.location.search)
    if (usernameConnected != "" && usernameConnected == query.get("pseudo") && !tri) {
        const modifBtn = [...document.querySelectorAll(".fas")]
        modifBtn.forEach(element => {
            if (!element.classList.contains("fa-graduation-cap") && !element.classList.contains("fa-angle-double-down")) {
                element.style.display = "block"
            }
        })
    } else if (usernameConnected != "") {
        const upgrade = document.querySelector(".nameUsers .fa-graduation-cap")
        const downgrade = document.querySelector(".nameUsers .fa-angle-double-down")
        if (objUsernameConnected.Rank == "Administrateur" && usernameConnected != query.get("pseudo") && objUser.Rank != "Modérateur") {
            upgrade.style.display = "block"
            downgrade.style.display = "none"
        } else if (objUsernameConnected.Rank == "Administrateur" && usernameConnected != query.get("pseudo") && objUser.Rank == "Modérateur") {
            downgrade.style.display = "block"
            upgrade.style.display = "none"
        }
    }
    const promise = fetch("/getinfos", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: query.get("pseudo")
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            if (!!tri) {
                return data
            }

            if (data.Pseudonyme != "") {
                pseudo.innerHTML = data.Pseudonyme
                imgDiv.style.backgroundImage = "url(" + data.Image + ")"
                biography.innerHTML = data.Biography
                rank.innerHTML = data.Rank
                if (data.Rank == "Administrateur") {
                    rank.style.color = "red"
                } else if (data.Rank == "Modérateur") {
                    rank.style.color = "#10497e"
                } else if (data.Rank == "Utilisateur") {
                    rank.style.color = "#f4d35e"
                }
            } else {
                location.href = "/"
            }
        })
        .catch(err => {
            errorlog.innerHTML = err.err
        })
    return promise
}

const getLikedPosts = () => {
    const postsDiv = document.querySelector(".choiceContent")
    const query = new URLSearchParams(window.location.search)
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
            for (const element of data) {
                try {
                    const userData = await getInfos("tri")
                    const elementCreator = await getUser(element.SenderID)
                    const tabPostsLikes = userData.PostLikes.split(",")
                    if (tabPostsLikes.includes(element.PostID.toString())) {
                        addPostDiv(element.PostID, element.Title, elementCreator.Pseudonyme, elementCreator.Image, element.Content.substring(0, 500), element.Likes)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const getPostsFromUser = () => {
    const postsDiv = document.querySelector(".choiceContent")
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
            for (const element of data) {
                try {
                    const userData = await getInfos("tri")
                    const elementCreator = await getUser(element.SenderID)
                    if (userData.UserID == element.SenderID && element.ParentID == '0') {
                        addPostDiv(element.PostID, element.Title, elementCreator.Pseudonyme, elementCreator.Image, element.Content.substring(0, 500), element.Likes)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}


const getCommentsFromUser = () => {
    const postsDiv = document.querySelector(".choiceContent")
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
            for (const element of data) {
                try {
                    const userData = await getInfos("tri")
                    const elementCreator = await getUser(element.SenderID)
                    if (userData.UserID == element.SenderID && element.ParentID != '0') {
                        addCommentDiv(element.PostID, element.Title, elementCreator.Pseudonyme, elementCreator.Image, element.Content.substring(0, 500), element.Likes)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const loadUserInfos = () => {
    const query = new URLSearchParams(window.location.search)
    return new Promise((resolve, reject) => {
        fetch("/getinfos", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    pseudo: query.get("pseudo")
                })
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                objUser = data
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const loadUserConnected = () => {
    return new Promise((resolve, reject) => {
        fetch("/getinfos", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    pseudo: getCookie("pseudo")
                })
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                objUsernameConnected = data
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
loadUserConnected()
    .then((res) => {
        objUsernameConnected = res
    })
    .catch(err => console.log(err))

loadUserInfos()
    .then((res) => {
        objUser = res
        getInfos()
    })
    .catch(err => console.log(err))