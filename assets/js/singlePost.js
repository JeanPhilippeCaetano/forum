const getCookie = function(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (pair[0] == name)
            return pair[1];
    }
    return null;
};


let objectPost = new Object()
let objectUser = new Object()
let objectUsernameConnected = new Object()
let arrayComments = []
let allPostsID = []
let parentPostID = -1

const body = document.querySelector('body')

const userPPDiv = document.getElementById('userPP')
const userNameDiv = document.getElementById('userName')
const postTitleDIv = document.getElementById('postTitle')
const postTagDIv = document.getElementById('postTags')
const postLikesDiv = document.getElementById('like')
const postContentDiv = document.getElementById('postContent')
const postComDiv = document.getElementById('com')
const writeCom = document.querySelector(".writeCom")

const heartsIconP1 = ` <i class="far fa-heart"></i><i onclick="likePost('like',`
const heartsIconP2 = `)" class="fa fa-heart"></i>`
const commentIcon = ` <i onclick="document.getElementById('comInput').focus()"  class="fa fa-comments" aria-hidden="true"></i>`

const commentsDiv = document.getElementById('divCom')
const commentInput = document.getElementById('comInput')
const commentButton = document.getElementById('subCom')
const commentDivs = document.getElementsByClassName('oneComment')

const ppAddCom = document.querySelector(".writeCom .PP")
const editPostIcon = document.querySelector(".adminUserOptions .fa-edit")
const deletePostIcon = document.querySelector(".adminUserOptions .fa-trash-alt")

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

const addTagsPost = (value) => {
    const tags = document.querySelector(".tags-create-post")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
}

const getModifyPostInfos = () => {
    const titlePopup = document.querySelector("#title")
    const tagsTab = objectPost.Tags.split(",")
    titlePopup.value = objectPost.Title
    tinymce.activeEditor.setContent(objectPost.Content);
    tagsTab.forEach(element => {
        addTagsPost(element)
    })
}

const openPopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.add("active")
    getModifyPostInfos()
}

const closePopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.remove("active")
}

const checkPermsForDeletePost = (username) => {
    let bool = false;
    if (username == objectUser.Pseudonyme) {
        return true
    } else {
        bool = fetch("/getinfos", {
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
                if (data.Rank == "Administrateur") {
                    return true
                }
                return false
            })
            .catch(err => {
                console.log(err.err)
            })
    }
    return bool
}

const checkPermsForDeleteCom = (username) => {
    const bool = fetch("/getinfos", {
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
            if (data.Rank == "Administrateur") {
                return true
            }
            return false
        })
        .catch(err => {
            console.log(err.err)
        })
    return bool
}

const editPost = () => {
    const username = getCookie("pseudo")
    if (!username) {
        createCustomAlert("Il faut être connecté pour pouvoir effectuer cela. Cliquez sur le bouton ci-dessous pour vous connecter/inscrire !", "likedisconnected")
        return
    }
    const errorlog = document.querySelector(".error_message")
    if (username == objectUser.Pseudonyme) {
        const title = document.querySelector("#post-popup .popup #title").value
        const content = tinymce.get("mytextarea").getContent()
        const tabTags = [...document.querySelectorAll(".tags button")]
        const tags = tabTags.filter(elem => {
            return elem.classList.contains("choosed")
        })
        const tagsValues = tags.map(elem => {
            return elem.value
        })
        let newPostObj = objectPost
        newPostObj.Title = title
        newPostObj.Content = content
        newPostObj.Tags = `${tagsValues}`
        updateLikesData(newPostObj)
        closePopup()
        location.href = "/singlepost?id=" + objectPost.PostID
    } else {
        errorlog.innerHTML = "Vous n'avez pas le droit d'effectuer cette action."
    }
}

const noComYet = () => {
    const getInfoDiv = document.getElementById('noCom')
    if (commentDivs.length < 1) {
        let infoDiv = document.createElement('div')
        infoDiv.setAttribute('class', 'noComYet')
        infoDiv.setAttribute('id', 'noCom')
        infoDiv.innerHTML = "Il n'y a pas encore de commentaire pour ce post. Sois le premier à commenter."
        commentsDiv.appendChild(infoDiv)
    } else if (getInfoDiv != null) {
        getInfoDiv.remove()
    }
}

const likePost = (idDiv, index) => {
    let displayLike = document.getElementById(idDiv)
    let likesNbr = choosePost(index)
    let delOrAdd;
    const username = getCookie("pseudo")
    if (!username) {
        createCustomAlert("Il faut être connecté pour pouvoir effectuer cela. Cliquez sur le bouton ci-dessous pour vous connecter/inscrire !", "likedisconnected")
        return
    }
    if (displayLike.hasAttribute("data-like") == true) {
        likesNbr += 1
        delOrAdd = "+"
        displayLike.removeAttribute('data-like')
        displayLike.innerHTML = likesNbr + ` <i class="fa fa-heart"></i> <i onclick="likePost('` + idDiv + `',` + index + `)" class="fas fa-heart-broken"></i>`
    } else if (displayLike.hasAttribute("data-like") == false) {
        likesNbr -= 1
        delOrAdd = "-"
        displayLike.setAttribute('data-like', true)
        displayLike.innerHTML = likesNbr + ` <i class="far fa-heart"></i> <i onclick="likePost('` + idDiv + `',` + index + `)" class="fa fa-heart"></i>`
    }
    updateObject(index, likesNbr, delOrAdd)
}

const choosePost = (index) => {
    if (index == -1) {
        return objectPost.Likes
    } else {
        return arrayComments[index].Likes
    }
}

const updateObject = (index, likesNbr, delOrAdd) => {
    if (index == -1) {
        objectPost.Likes = likesNbr
        updateLikesData(objectPost, delOrAdd)
    } else {
        arrayComments[index].Likes = likesNbr
        updateLikesData(arrayComments[index], delOrAdd)
    }
}

const validTextInput = () => {
    let char = isValidChar()
    if (comInput.value.length != 0 && char == true) {
        addCommentInDB()
    } else {
        createCustomAlert('Vous ne pouvez pas poster un commentaire vide !')
    }
    comInput.value = ""
}

const isValidChar = () => {
    for (let i = 0; i < comInput.value.length; i++) {
        if (comInput.value[i] != ' ') {
            return true
        }
    }
    return false
}

const confirmEditPost = (comid) => {
    const commentText = document.querySelector(`[data-postid='${comid}'] .commentText #areaComment`).value
    fetch("/editcom", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: comid,
                content: commentText
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            location.href = `/singlepost?id=${objectPost.PostID}`
        })
        .catch(err => {
            console.log(err)
        })

}

const editCom = (comid) => {
    const commentText = document.querySelector(`[data-postid='${comid}'] .commentText`)
    const commentContent = commentText.textContent
    const trashcanEdit = document.querySelector(`[data-postid='${comid}'] .trashcanEdit`)
    commentText.innerHTML = `<input type="text" id="areaComment" value='${commentContent}'>`
    trashcanEdit.innerHTML = `<i onclick="confirmEditPost(${comid})" class="fas fa-check" style="margin-right:10%"></i><i onclick="location.href='/singlepost?id=${objectPost.PostID}'" class="fas fa-times"></i>`
}

const pushCom = (objCom, index) => {
    const username = getCookie("pseudo")

    let comDiv = document.createElement('div')
    comDiv.setAttribute('class', 'oneComment')
    comDiv.setAttribute('data-postid', objCom.PostID) // id avec la base de donnée, fait

    let PPDiv = document.createElement('div')
    PPDiv.setAttribute('class', 'PP') // ajouter l'image du profil utilisateur, fait
    PPDiv.style.backgroundImage = `url("` + objCom.Image + `")`
    comDiv.appendChild(PPDiv)

    let psuedoDiv = document.createElement('div')
    psuedoDiv.setAttribute('class', 'username')
    psuedoDiv.innerHTML = objCom.Pseudonyme // ajouter le pseudo de l'utilisateur, fait
    comDiv.appendChild(psuedoDiv)

    let textDiv = document.createElement('div')
    textDiv.setAttribute('class', 'commentText')
    textDiv.innerHTML = objCom.Content // changer le input.value avec le content de la base de donnée, fait
    comDiv.appendChild(textDiv)

    let iconDiv = document.createElement('div')
    iconDiv.setAttribute('class', 'icons')

    let likeDiv = document.createElement('div')
    likeDiv.setAttribute('class', 'like')
    likeDiv.setAttribute('data-like', true)
    likeDiv.setAttribute('id', 'likeCom' + objCom.PostID) // id avec la base de donnée, fait

    const tabPostLikes = objectUsernameConnected.PostLikes.split(",")
    if (!(tabPostLikes.length == 1 && tabPostLikes[0] == "") && tabPostLikes.includes(objCom.PostID + "")) {
        likeDiv.innerHTML = objCom.Likes + ` <i class="fa fa-heart"></i><i onclick="likePost('likeCom` + objCom.PostID + `', ` + index + `)" class="fas fa-heart-broken"></i>`
        likeDiv.removeAttribute("data-like")
    } else {
        likeDiv.innerHTML = objCom.Likes + ` <i class="far fa-heart"></i><i onclick="likePost('likeCom` + objCom.PostID + `', ` + index + `)"" class="fa fa-heart"></i>`
    }
    iconDiv.appendChild(likeDiv)
    let answerDiv = document.createElement('div')
    answerDiv.setAttribute('class', 'com')
    answerDiv.innerHTML = 0 + ` <i onclick="getPostIDForCom(` + index + `)" class="fa fa-comments" aria-hidden="true"></i>` // nbs de com avec la base de donnée, fait
    iconDiv.appendChild(answerDiv)

    let trashcanEditDiv = document.createElement('div') // afficher cette div que si le commentaire nous appartient
    trashcanEditDiv.setAttribute('class', 'trashcanEdit')
    if (!!username && username == objCom.Pseudonyme) {
        trashcanEditDiv.innerHTML = `<i onclick="editCom(this.dataset.comid)" class="fas fa-edit" data-comid="${objCom.PostID}"></i> <i onclick="deletePost(this.dataset.comid)" class="fas fa-trash-alt" data-comid="${objCom.PostID}"></i>`
    } else if ((objectUsernameConnected.Rank == "Administrateur" || username == objCom.Pseudonyme)) {
        trashcanEditDiv.innerHTML = `<i onclick="deletePost(this.dataset.comid)" class="fas fa-trash-alt" data-comid="${objCom.PostID}"></i>`
    }
    iconDiv.appendChild(trashcanEditDiv)
    comDiv.appendChild(iconDiv)
    commentsDiv.appendChild(comDiv)
    addComPost()
}

const addComPost = () => {
    const displayComs = document.getElementById('com')
    let comsNbr = parseInt(displayComs.innerHTML.split('<')[0]) + 1
    displayComs.innerHTML = comsNbr.toString() + ` <i onclick="document.getElementById('comInput').focus()"  class="fa fa-comments" aria-hidden="true"></i>`
    noComYet()
}

const deletePost = (comID) => {
    if (comID != objectPost.PostID) {
        for (let i = 0; i < commentDivs.length; i++) {
            if (commentDivs[i].getAttribute('id') == comID) {
                commentDivs[i].remove()
                revomeComPost()
            }
        }
    } else {
        if (comID == objectPost.PostID) {
            for (let i = allPostsID.length - 1; i > 0; i--) {
                deletePost(allPostsID[i])
            }
        }
    }
    fetch("/deletepost", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                postid: parseInt(comID)
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            location.href = "/posts"
        })
        .catch(err => {
            console.log(err)
        })
}

const revomeComPost = () => {
    const displayComs = document.getElementById('com')
    let comsNbr = parseInt(displayComs.innerHTML.split('<')[0]) - 1
    displayComs.innerHTML = comsNbr.toString() + ` <i onclick="document.getElementById('comInput').focus()"  class="fa fa-comments" aria-hidden="true"></i>`
    noComYet()
}

const getPostIDForCom = (index) => {
    document.getElementById('comInput').focus()
    if (index == -1) {
        parentPostID = objectPost.PostID
    } else {
        parentPostID = arrayComments[index - 1].PostID
    }

}

//Pop up alert message vide

function createCustomAlert(txt, disconnectedOption) {
    const d = document

    if (d.getElementById("modalContainer")) return;

    mObj = body.appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    alertObj.style.left = 35 + "%";
    alertObj.style.visiblity = "visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode('Oops!'));

    msg = alertObj.appendChild(d.createElement("p"));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    if (!disconnectedOption) {
        btn.appendChild(d.createTextNode('OK'));
        btn.href = "#";
    } else if (disconnectedOption == "likedisconnected") {
        btn.appendChild(d.createTextNode("LOGIN"));
        btn.addEventListener('click', function() {
            location.href = '/loginregister'
        }, false);
    }
    btn.focus();
    btn.onclick = function() { removeCustomAlert(); return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    body.removeChild(document.getElementById("modalContainer"));
}

// appels API

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

const loadPage = () => {
    const query = new URLSearchParams(window.location.search)
    const promise = fetch("/getpost", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                postid: parseInt(query.get("id"))
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(async(data) => {
            try {
                const userData = await getUser(data.SenderID)
                objectUser.Image = userData.Image
                objectUser.Pseudonyme = userData.Pseudonyme
                objectPost.Content = data.Content
                objectPost.Date = data.Date
                objectPost.Likes = data.Likes
                objectPost.ParentID = data.ParentID
                objectPost.PostID = data.PostID
                objectPost.SenderID = data.SenderID
                objectPost.Tags = data.Tags
                objectPost.Title = data.Title
            } catch (err) {
                console.log(err);
            }
            await displayPostInfo()
        })
    return promise
}

const displayPostInfo = () => {
    userPPDiv.style.backgroundImage = `url("` + objectUser.Image + `")`
    userNameDiv.innerText = objectUser.Pseudonyme
    postTitleDIv.innerText = objectPost.Title
    postTagDIv.innerText = objectPost.Tags
    const displayLikeDiv = document.querySelector('.displayLikesValue')
    postLikesDiv.innerHTML = objectPost.Likes + heartsIconP1 + '-1' + heartsIconP2
    postContentDiv.innerHTML = objectPost.Content
    postComDiv.innerHTML = arrayComments.length + commentIcon
    allPostsID.push(objectPost.PostID)
    const username = getCookie("pseudo")
    if (!username) {
        writeCom.innerHTML = ""
        cantComment = document.createElement("div")
        cantComment.className = "cantComment"
        cantComment.textContent = "Il faut être connecté pour pouvoir commenter. Cliquez ici pour être redirigé vers la page de connexion."
        cantComment.addEventListener('click', function() {
            location.href = '/loginregister'
        }, false);
        writeCom.appendChild(cantComment)
        return
    } else {
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
                const tabPostLikes = data.PostLikes.split(",")
                if (!(tabPostLikes.length == 1 && tabPostLikes[0] == "") && tabPostLikes.includes(objectPost.PostID + "")) {
                    postLikesDiv.innerHTML = objectPost.Likes + ` <i class="fa fa-heart"></i><i onclick="likePost('like',-1)" class="fas fa-heart-broken"></i>`
                    displayLikeDiv.removeAttribute('data-like')
                } else {
                    postLikesDiv.innerHTML = objectPost.Likes + ` <i class="far fa-heart"></i><i onclick="likePost('like',` + '-1' + `)" class="fa fa-heart"></i>`
                }
                ppAddCom.style.backgroundImage = `url("` + data.Image + `")`
            })
            .catch(err => {
                console.log(err)
            })

    }
    if (username == objectUser.Pseudonyme) {
        editPostIcon.style.display = "inline"
    }
    if (objectUsernameConnected.Rank == "Administrateur" || username == objectUser.Pseudonyme) {
        deletePostIcon.style.display = "inline"
        deletePostIcon.setAttribute("id", objectPost.PostID)
    }
}

const changeUser = (userData, obj, delOrAdd) => {
    let tabPostLikes = userData.PostLikes.split(",")
    if (delOrAdd == "+") {
        if (tabPostLikes.length == 1 && tabPostLikes[0] == "") {
            tabPostLikes[0] = obj.PostID + ""
        } else if (!tabPostLikes.includes(obj.PostID + "")) {
            tabPostLikes.push(obj.PostID + "")
        }
    } else if (delOrAdd == "-") {
        tabPostLikes = tabPostLikes.filter(e => e + "" != obj.PostID + "")
    }
    const promise = fetch("/changeuser", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: userData.UserID,
                pseudo: userData.Pseudonyme,
                email: userData.Email,
                biography: userData.Biography,
                password: userData.Password,
                image: userData.Image,
                postlikes: `${tabPostLikes}`
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

const updateLikedPostUser = (obj, delOrAdd) => {
    const username = getCookie("pseudo")
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
        .then(async(data) => {
            try {
                await changeUser(data, obj, delOrAdd)
            } catch (err) {
                console.log(err)
            }
        })
        .catch(err => {
            console.log(err)
        })

}


const updateLikesData = (obj, delOrAdd) => {
    const promise = fetch("/modifypost", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                postid: obj.PostID,
                parentid: obj.ParentID,
                title: obj.Title,
                content: obj.Content,
                tags: obj.Tags,
                likes: obj.Likes,
                date: obj.Date,
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .catch(err => {
            console.log(err)
        })
    updateLikedPostUser(obj, delOrAdd)
    return promise
}

const displayComments = () => {
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
        .then(async(data) => {
            try {
                for (const element of data) {
                    const userData = await getUser(element.SenderID)
                    if (allPostsID.includes(element.ParentID)) {
                        element.Pseudonyme = userData.Pseudonyme
                        element.Image = userData.Image
                        arrayComments.push(element)
                        allPostsID.push(element.PostID)
                        await pushCom(element, data.indexOf(element) - 1)
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })
        .catch(err => {
            console.log(err)
        })
    return promise
}

const addCommentInDB = () => {
    const query = new URLSearchParams(window.location.search)
    if (parentPostID == -1) {
        parentPostID = parseInt(query.get("id"))
    }
    const promise = fetch("/addcom", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                parentid: parentPostID,
                content: commentInput.value,
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .catch(err => {
            console.log(err)
        })
    location.reload()
    return promise
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
                objectUsernameConnected = data
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
loadUserConnected()
    .then((res) => {
        objectUsernameConnected = res
    })
    .catch(err => console.log(err))


loadPage()
displayComments()
noComYet()
window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        validTextInput()
    }
})