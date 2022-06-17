let objectPost = new Object()
let objectUser = new Object()
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

const heartsIconP1 = ` <i class="far fa-heart"></i><i onclick="likePost('like',`
const heartsIconP2 = `)" class="fa fa-heart"></i>`
const commentIcon = ` <i onclick="document.getElementById('comInput').focus()"  class="fa fa-comments" aria-hidden="true"></i>`

const commentsDiv = document.getElementById('divCom')
const commentInput = document.getElementById('comInput')
const commentButton = document.getElementById('subCom')
const commentDivs = document.getElementsByClassName('oneComment')

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
    if (displayLike.hasAttribute("data-like") == true) {
        likesNbr += 1
        displayLike.removeAttribute('data-like')
        displayLike.innerHTML = likesNbr + ` <i class="fa fa-heart"></i> <i onclick="likePost('` + idDiv + `',` + index + `)" class="fas fa-heart-broken"></i>`
    } else if (displayLike.hasAttribute("data-like") == false) {
        likesNbr -= 1
        displayLike.setAttribute('data-like', true)
        displayLike.innerHTML =  likesNbr + ` <i class="far fa-heart"></i> <i onclick="likePost('` + idDiv + `',` + index + `)" class="fa fa-heart"></i>`
    }
    updateObject(index, likesNbr)
}

const choosePost = (index) => {
    if (index == -1) {
        return objectPost.Likes
    } else {
        return arrayComments[index].Likes
    }
}

const updateObject = (index, likesNbr) => {
    if (index == -1) {
        objectPost.Likes = likesNbr
        updateLikesData(objectPost)
    } else {
        arrayComments[index].Likes = likesNbr
        updateLikesData(arrayComments[index])
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
    for (let i=0;i<comInput.value.length;i++) {
        if (comInput.value[i] != ' ') {
            return true
        }
    }
    return false
}

const pushCom = (objCom, index) => {
    let comDiv = document.createElement('div')
    comDiv.setAttribute('class', 'oneComment')
    comDiv.setAttribute('id', objCom.PostID) // id avec la base de donnée, fait

    let PPDiv = document.createElement('div')
    PPDiv.setAttribute('class', 'PP') // ajouter l'image du profil utilisateur, fait
    PPDiv.style.backgroundImage = `url("` + objCom.Image + `")`
    comDiv.appendChild(PPDiv)

    let psuedoDiv = document.createElement('div')
    psuedoDiv.setAttribute('class', 'username')
    psuedoDiv.innerHTML = objCom.Pseudonyme  // ajouter le pseudo de l'utilisateur, fait
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
    likeDiv.innerHTML = objCom.Likes + ` <i class="far fa-heart"></i><i onclick="likePost('likeCom` + objCom.PostID +  `', ` + index + `)"" class="fa fa-heart"></i>`
    iconDiv.appendChild(likeDiv)

    let answerDiv = document.createElement('div')
    answerDiv.setAttribute('class', 'com')
    answerDiv.innerHTML = 0 + ` <i onclick="getPostIDForCom(` + index + `)" class="fa fa-comments" aria-hidden="true"></i>`  // nbs de com avec la base de donnée, fait
    iconDiv.appendChild(answerDiv)

    let trashcanEditDiv = document.createElement('div')  // afficher cette div que si le commentaire nous appartient
    trashcanEditDiv.setAttribute('class', 'trashcanEdit')
    trashcanEditDiv.innerHTML = `<i onclick="console.log('edit post')" class="fas fa-edit"></i> <i onclick="deletePost(this.parentElement.parentElement.parentElement.id)" class="fas fa-trash-alt"></i>`
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
    for (let i=0;i<commentDivs.length;i++) {
        if (commentDivs[i].getAttribute('id') == comID) {
            commentDivs[i].remove()
            revomeComPost()
        }
    }
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
        parentPostID = arrayComments[index-1].PostID
    }
    
}   

//Pop up alert message vide

function createCustomAlert(txt) {
    const d = document

	if(d.getElementById("modalContainer")) return;

	mObj = body.appendChild(d.createElement("div"));
	mObj.id = "modalContainer";
	mObj.style.height = d.documentElement.scrollHeight + "px";
	
	alertObj = mObj.appendChild(d.createElement("div"));
	alertObj.id = "alertBox";
	alertObj.style.left = 35 + "%";
	alertObj.style.visiblity="visible";

	h1 = alertObj.appendChild(d.createElement("h1"));
	h1.appendChild(d.createTextNode('Oops!'));

	msg = alertObj.appendChild(d.createElement("p"));
	msg.innerHTML = txt;

	btn = alertObj.appendChild(d.createElement("a"));
	btn.id = "closeBtn";
	btn.appendChild(d.createTextNode('OK'));
	btn.href = "#";
	btn.focus();
	btn.onclick = function() { removeCustomAlert();return false; }

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
    postLikesDiv.innerHTML = objectPost.Likes + heartsIconP1 + '-1' + heartsIconP2
    postContentDiv.innerText = objectPost.Content
    postComDiv.innerHTML = arrayComments.length + commentIcon
    allPostsID.push(objectPost.PostID)
}

const updateLikesData = (obj) => {
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
                    await pushCom(element, data.indexOf(element)-1)
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

loadPage()
displayComments()
noComYet()
window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        validTextInput()
    }
})