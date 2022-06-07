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

const likePost = () => {
    const displayLike = document.getElementById('like')
    let likesNbr = parseInt(displayLike.innerHTML.split('<')[0])
    if (displayLike.hasAttribute("data-like") == true) {
        likesNbr += 1
        displayLike.removeAttribute('data-like')
        displayLike.innerHTML = likesNbr.toString() + ' <i onclick="likePost()" class="fa fa-heart" aria-hidden="true">'
    } else if (displayLike.hasAttribute("data-like") == false) {
        likesNbr -= 1
        displayLike.setAttribute('data-like', true)
        displayLike.innerHTML =  likesNbr.toString() + ' <i onclick="likePost()" class="fa fa-heart-o" aria-hidden="true">'
    }  
}

const validTextInput = () => {
    let char = isValidChar()
    if (comInput.value.length != 0 && char == true) {
        pushCom() 
    } else {
        alert('Input text empty')
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

    let trashcanDiv = document.createElement('div')
    trashcanDiv.setAttribute('class', 'trashcan')
    trashcanDiv.innerHTML = `<i onclick="deletePost(this.parentElement.parentElement.id)" class="fa fa-trash-o" aria-hidden="true"></i>`
    comDiv.appendChild(trashcanDiv)

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

noComYet()