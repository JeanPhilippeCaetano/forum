const modifInfos = () => {
    const input = document.getElementById('inputName')
    const query = new URLSearchParams(window.location.search)
    fetch("/modifprofil", {
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
        // input.setAttribute("value", pseudo)
        location.href = "/modifprofil?pseudo=" + data.pseudo
    })
        .catch(err => {
            errorlog.innerHTML = err.err
        })
}