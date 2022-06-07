const getInfos = () => {
    const pseudo = document.querySelector(".nameUsers h1")
    const imgDiv = document.querySelector(".imgDiv")
    const biography = document.querySelector(".biography p")
    const query = new URLSearchParams(window.location.search)
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
            pseudo.innerHTML = data.Pseudonyme
            imgDiv.style.backgroundImage = "url(" + data.Image + ")"
            biography.innerHTML = data.Biography
        })
        .catch(err => {
            errorlog.innerHTML = err.err
        })
}

getInfos()