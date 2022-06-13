const goToUrl = () => {
    const query = new URLSearchParams(window.location.search)
    const pseudo = query.get("pseudo")
    location.href = "/modifprofil?pseudo=" + pseudo
}

const getInfo = () => {
    const input = document.getElementById('inputName')
    const query = new URLSearchParams(window.location.search)
    fetch("/getinfos", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            pseudo: query.get("pseudo")
            // pseudo: query.get("pseudo")
        })
    })
    .then(async(res) => {
        if (!res.ok) {
            throw await res.json()
        }
        return res.json()
    })
    .then(data => {
        // input.setAttribute("value", query)
        // console.log(input)
        input.value = query.get("pseudo")
    })
    .catch(err => {
        console.log(err.err)
        })
        // console.log(pseudo)
}

getInfo()

const replaceUsers = () => {
    const input = document.getElementById('inputName')
    
}