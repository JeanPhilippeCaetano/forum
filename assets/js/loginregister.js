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
    const errorlog = document.querySelector(".user_forms-signup .forms_form .error_message p")
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
        })
}

const onLoginClick = () => {
    const errorlog = document.querySelector(".user_forms-login .forms_form .error_message p")
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
        })
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }