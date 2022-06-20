const body = document.querySelector('body')

const answerDiv = document.getElementById('answers')
const allAnswerDiv = document.querySelectorAll('oneAnswer')
const answerInput = document.getElementById('subAn')

const noAnswerYet = () => {
    const getInfoDiv = document.getElementById('noCom')
    if (allAnswerDiv.length < 1) {
        let infoDiv = document.createElement('div')
        infoDiv.setAttribute('class', 'noComYet')
        infoDiv.setAttribute('id', 'noCom')
        infoDiv.innerHTML = "Cette discussion n'a pas encore commencée."
        answerDiv.appendChild(infoDiv)
    } else if (getInfoDiv != null) {
        getInfoDiv.remove()
    }
}

const validTextInput = () => {
    let char = isValidChar()
    if (answerInput.value.length != 0 && char == true) {
        addCommentInDB()
    } else {
        createCustomAlert('Vous ne pouvez pas poster un commentaire vide !')
    }
    answerInput.value = ""
}

const isValidChar = () => {
    for (let i = 0; i < answerInput.value.length; i++) {
        if (answerInput.value[i] != ' ') {
            return true
        }
    }
    return false
}

function createCustomAlert(txt) {
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
    btn.appendChild(d.createTextNode('OK'));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert(); return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    body.removeChild(document.getElementById("modalContainer"));
}

noAnswerYet()