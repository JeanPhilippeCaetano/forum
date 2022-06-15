const getCookies = function(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; ++i) {
        const pair = cookies[i].trim().split('=');
        if (pair[0] == name)
            return pair[1];
    }
    return null;
};

const getInfos = () => {
    const pseudo = document.querySelector(".nameUsers h1")
    const imgDiv = document.querySelector(".imgDiv")
    const biography = document.querySelector(".biography p")
    const usernameConnected = getCookies("pseudo")
    const query = new URLSearchParams(window.location.search)
    if (usernameConnected != "" && usernameConnected == query.get("pseudo")) {
        const modifBtn = [...document.querySelectorAll(".fas")]

        modifBtn.forEach(element => {
            element.style.display = "block"
        })
    }
    fetch("/getinfos", {
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
            console.log(data)
            if (data.Pseudonyme != "") {
                pseudo.innerHTML = data.Pseudonyme
                imgDiv.style.backgroundImage = "url(" + data.Image + ")"
                biography.innerHTML = data.Biography
            } else {
                location.href = "/"
            }
        })
        .catch(err => {
            errorlog.innerHTML = err.err
        })
}

getInfos()