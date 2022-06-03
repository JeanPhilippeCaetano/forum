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

const checkEmptyInputsSignUp = () => {
    const submitBtn = document.querySelector("#signupBtn")
    const pseudoDiv = document.getElementById("pseudoregister").value
    const emailDiv = document.getElementById("emailregister").value
    const passwordDiv = document.getElementById("passwordregister").value
    if (pseudoDiv.length > 0 && emailDiv.length > 0 && passwordDiv.length > 0) {
        submitBtn.disabled = false
    }
}

const onRegisterClick = () => {
    const errorlog = document.querySelector(".user_forms-signup .forms_form .error_message p")
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
                errorlog.innerHTML = data.error
                return;
            }
        })
}

const onLoginClick = () => {

}