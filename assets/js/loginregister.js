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
    const errorlog = document.querySelector(".error_message p")
    console.log(errorlog)
    fetch("/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                pseudo: document.getElementById("pseudoregister").value,
                email: document.getElementById("emailregister").value,
                password: document.getElementById("passwordregister").value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!!data.error) {
                alert(data.error)
                errorlog.innerText = data.error
            }

        })
}

const onLoginClick = () => {

}