const onRegisterClick = () => {
    fetch("/register", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify {
            email: document.getElementById
        }
    })
}