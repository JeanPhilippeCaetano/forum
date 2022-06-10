const body = document.querySelector('body')
const commentsDiv = document.getElementById('divCom')
const commentInput = document.getElementById('comInput')
const commentButton = document.getElementById('subCom')
const commentDivs = document.getElementsByClassName('oneComment')

let commentsIds = 1

const noComYet = () => {
    const getInfoDiv = document.getElementById('noCom')
    if (commentDivs.length < 1) {
        let infoDiv = document.createElement('div')
        infoDiv.setAttribute('class', 'noComYet')
        infoDiv.setAttribute('id', 'noCom')
        infoDiv.innerHTML = "Il n'y a pas encore de commentaire pour ce post. Soit le premier à commenter."
        commentsDiv.appendChild(infoDiv)
    } else if (getInfoDiv != null) {
        getInfoDiv.remove()
    }
}

const likePost = (id) => {
    let displayLike = document.getElementById(id)
    console.log(displayLike, id)
    let likesNbr = parseInt(displayLike.innerHTML.split('<')[0])
    if (displayLike.hasAttribute("data-like") == true) {
        likesNbr += 1
        displayLike.removeAttribute('data-like')
        displayLike.innerHTML = likesNbr.toString() + ` <i class="fa fa-heart"></i> <i onclick="likePost('` + id + `')" class="fas fa-heart-broken"></i>`
    } else if (displayLike.hasAttribute("data-like") == false) {
        likesNbr -= 1
        displayLike.setAttribute('data-like', true)
        displayLike.innerHTML =  likesNbr.toString() + ` <i class="far fa-heart"></i> <i onclick="likePost('` + id + `')" class="fa fa-heart"></i>`
    }  
}

const validTextInput = () => {
    let char = isValidChar()
    if (comInput.value.length != 0 && char == true) {
        pushCom() 
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

const pushCom = () => {
    let comDiv = document.createElement('div')
    comDiv.setAttribute('class', 'oneComment')
    comDiv.setAttribute('id', commentsIds)

    let PPDiv = document.createElement('div')
    PPDiv.setAttribute('class', 'PP')
    comDiv.appendChild(PPDiv)

    let psuedoDiv = document.createElement('div')
    psuedoDiv.setAttribute('class', 'username')
    psuedoDiv.innerHTML = 'pseudo of user'
    comDiv.appendChild(psuedoDiv)

    let textDiv = document.createElement('div')
    textDiv.setAttribute('class', 'commentText')
    textDiv.innerHTML = commentInput.value
    comDiv.appendChild(textDiv)

    let iconDiv = document.createElement('div')
    iconDiv.setAttribute('class', 'icons')

    let likeDiv = document.createElement('div')
    likeDiv.setAttribute('class', 'like')
    likeDiv.setAttribute('data-like', true)
    likeDiv.setAttribute('id', 'likeCom' + commentsIds)
    likeDiv.innerHTML = 2 + ` <i class="far fa-heart"></i><i onclick="likePost('likeCom` + commentsIds + `')"" class="fa fa-heart"></i>`
    iconDiv.appendChild(likeDiv)

    let answerDiv = document.createElement('div')
    answerDiv.setAttribute('class', 'com')
    answerDiv.innerHTML = 12 + ` <i class="fa fa-comments" aria-hidden="true"></i>`
    iconDiv.appendChild(answerDiv)

    let trashcanEditDiv = document.createElement('div')
    trashcanEditDiv.setAttribute('class', 'trashcanEdit')
    trashcanEditDiv.innerHTML = `<i onclick="console.log('edit post')" class="fas fa-edit"></i> <i onclick="deletePost(this.parentElement.parentElement.parentElement.id)" class="fas fa-trash-alt"></i>`
    iconDiv.appendChild(trashcanEditDiv)

    comDiv.appendChild(iconDiv)

    commentsDiv.appendChild(comDiv)
    commentsIds += 1
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

const loadPage = () => {
    fetch("/singlepost", {
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
}

loadPage()
noComYet()
window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        validTextInput()
    }
})