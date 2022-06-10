/**
 * Variables
 */
const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms')

/**
 * Add event listener to the "Sign Up" button
 */
signupButton.addEventListener('click', () => {
    userForms.classList.remove('bounceRight')
    userForms.classList.add('bounceLeft')
}, false)

/**
 * Add event listener to the "Login" button
 */
loginButton.addEventListener('click', () => {
    userForms.classList.remove('bounceLeft')
    userForms.classList.add('bounceRight')
}, false)

const onRegisterClick = () => {
    console.log("test")
    fetch("/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                Pseudo: document.getElementById("pseudoregister"),
                Email: document.getElementById("emailregister"),
                Password: document.getElementById("passwordregister")
            })
        })
        .then(res => res.json())
        .then(data => {
            debuglog.innerText = data
        })
}