const userData = {
    UserID: 0,
    Pseudonyme: "",
    Email: "",
    Biography: "",
    Password: "",
    Image: ""
}

const goToUrl = () => {
    const query = new URLSearchParams(window.location.search)
    const pseudo = query.get("pseudo")
    location.href = "/modifprofil?pseudo=" + pseudo
}

const getInfo = () => {
    const input = document.getElementById('inputName')
    const biography = document.getElementById("areaBiography")
    const query = new URLSearchParams(window.location.search)
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
            input.value = query.get("pseudo")
            biography.textContent = data.Biography
            Object.keys(userData).forEach(element => {
                userData[element] = data[element]
            })
            return data
        })
        .catch(err => {
            console.log(err.err)
        })
    return promise
}

const changeImage = (event) => {

    fetch("/changeuser", {
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
                image: newImage,
                postlikes: userData.PostLikes
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            location.href = "/profil?pseudo=" + data.Pseudonyme
            return data
        })
        .catch(err => {
            console.log(err.err)
        })
};


const changePassword = () => {
    const oldMdp = document.querySelector("#oldMdp").value
    const newMdp = document.querySelector("#newMdp").value
    const confirmNewMdp = document.querySelector("#confirmNewMdp").value
    if (oldMdp.length > 0 && newMdp.length > 0 && confirmNewMdp.length > 0) {
        if (oldMdp == userData.Password) {
            if (newMdp == confirmNewMdp) {
                fetch("/changeuser", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            id: userData.UserID,
                            pseudo: userData.Pseudonyme,
                            email: userData.Email,
                            biography: userData.Biography,
                            password: newMdp,
                            image: userData.Image,
                            postlikes: userData.PostLikes
                        })
                    })
                    .then(async(res) => {
                        if (!res.ok) {
                            throw await res.json()
                        }
                        return res.json()
                    })
                    .then(data => {
                        location.href = "/profil?pseudo=" + data.Pseudonyme
                        return data
                    })
                    .catch(err => {
                        console.log(err.err)
                    })
            } else {
                console.log("Nouveau mdp & confirm new mdp pas égaux")
            }
        } else {
            console.log("Ancien mot de passe faux")
        }
    }
}

const changeEmail = () => {
    const oldEmail = document.querySelector("#oldEmail").value
    const newEmail = document.querySelector("#newEmail").value
    const confirmNewEmail = document.querySelector("#confirmNewEmail").value
    if (oldEmail.length > 0 && newEmail.length > 0 && confirmNewEmail.length > 0) {
        if (oldEmail == userData.Email) {
            if (newEmail == confirmNewEmail) {
                if (newEmail.match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) {
                    fetch("/changeuser", {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                id: userData.UserID,
                                pseudo: userData.Pseudonyme,
                                email: newEmail,
                                biography: userData.Biography,
                                password: userData.Password,
                                image: userData.Image,
                                postlikes: userData.PostLikes
                            })
                        })
                        .then(async(res) => {
                            if (!res.ok) {
                                throw await res.json()
                            }
                            return res.json()
                        })
                        .then(data => {
                            location.href = "/profil?pseudo=" + data.Pseudonyme
                            return data
                        })
                        .catch(err => {
                            console.log(err.err)
                        })
                } else {
                    console.log("Mauvais format d'email")
                }
            } else {
                console.log("Nouveau email & confirm new email pas égaux")
            }
        } else {
            console.log("Ancien email faux")
        }
    }
}

const changeBiography = () => {
    const newBiography = document.getElementById("areaBiography").value
    if (newBiography.length != 0) {
        fetch("/changeuser", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    id: userData.UserID,
                    pseudo: userData.Pseudonyme,
                    email: userData.Email,
                    biography: newBiography,
                    password: userData.Password,
                    image: userData.Image,
                    postlikes: userData.PostLikes
                })
            })
            .then(async(res) => {
                if (!res.ok) {
                    throw await res.json()
                }
                return res.json()
            })
            .then(data => {
                location.href = "/profil?pseudo=" + data.Pseudonyme
                return data
            })
            .catch(err => {
                console.log(err.err)
            })
    }
}

const changeUsername = () => {
    const inputName = document.getElementById("inputName").value
    if (inputName.length != 0) {
        fetch("/changeuser", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    id: userData.UserID,
                    pseudo: inputName,
                    email: userData.Email,
                    biography: userData.Biography,
                    password: userData.Password,
                    image: userData.Image,
                    postlikes: userData.PostLikes
                })
            })
            .then(async(res) => {
                if (!res.ok) {
                    throw await res.json()
                }
                return res.json()
            })
            .then(data => {
                console.log(data)
                input = data.Pseudonyme
                location.href = "/profil?pseudo=" + data.Pseudonyme
                return data
            })
            .catch(err => {
                console.log(err.err)
            })
    }
}
getInfo()

const goNewUrl = () => {
    const query = new URLSearchParams(window.location.search)
    const params = query.get("pseudo")
    location.href = "/profil?pseudo=" + params
}

// const newUsersName = () => {
//     const input = document.getElementById('inputName').value
//     const query = new URLSearchParams(window.location.search)
//     const params = query.get(input)
//     location.href = "/modifprofil?pseudo=" + params
// }
// const button = document.getElementById('newUsersName')
// button.addEventListener('click', newUsersName)