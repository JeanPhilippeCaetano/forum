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
        // console.log(pseudo)
}

const changeBiography = () => {
    const newBiography = document.getElementById("areaBiography").value
    console.log(newBiography)
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
                    image: userData.Image
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
                    image: userData.Image
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