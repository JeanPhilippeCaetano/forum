const toggleForm = () => {
    const container = document.querySelector('.container');
    container.classList.toggle('active');
};
/**
 * Variables
 */
const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms')

/**
 * Add event listener to the "Sign Up" button
 */
// signupButton.addEventListener('click', () => {
//     userForms.classList.remove('bounceRight')
//     userForms.classList.add('bounceLeft')
// }, false)

/**
 * Add event listener to the "Login" button
 */
// loginButton.addEventListener('click', () => {
//     userForms.classList.remove('bounceLeft')
//     userForms.classList.add('bounceRight')
// }, false)

const checkEmptyInputsSignUp = () => {
    const submitBtn = document.querySelector("#signupBtn")
    const pseudoDiv = document.getElementById("pseudoregister").value
    const emailDiv = document.getElementById("emailregister").value
    const passwordDiv = document.getElementById("passwordregister").value
    if (pseudoDiv.length > 0 && emailDiv.length > 0 && passwordDiv.length > 0 && emailDiv.toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
        submitBtn.disabled = false
    }
}

const checkEmptyInputsSignIn = () => {
    const submitBtn = document.querySelector("#signinBtn")
    const pseudoDiv = document.getElementById("pseudologin").value
    const passwordDiv = document.getElementById("passwordlogin").value
    if (pseudoDiv.length > 0 && passwordDiv.length > 0) {
        submitBtn.disabled = false
    }
}

const onRegisterClick = () => {
    const errorlog = document.querySelector(".signupBx .formBx .error_message p")
    const regDate = new Date(Date.now()).toUTCString();
    const submitBtn = document.querySelector("#signupBtn")
    fetch("/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: document.getElementById("pseudoregister").value,
                email: document.getElementById("emailregister").value,
                password: document.getElementById("passwordregister").value,
                date: regDate
            })

        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            location.href = "/profil?pseudo=" + data.pseudo
        })
        .catch(err => {
            errorlog.innerHTML = err.err
            submitBtn.disabled = true
        })
}

const onLoginClick = () => {
    const errorlog = document.querySelector(".signinBx .formBx .error_message p")
    const submitBtn = document.querySelector("#signinBtn")
    fetch("/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: document.getElementById("pseudologin").value,
                password: document.getElementById("passwordlogin").value
            })
        })
        .then(async(res) => {
            if (!res.ok) {
                throw await res.json()
            }
            return res.json()
        })
        .then(data => {
            location.href = "/profil?pseudo=" + data.pseudo
        })
        .catch(err => {
            errorlog.innerHTML = err.err
            submitBtn.disabled = true
        })
}