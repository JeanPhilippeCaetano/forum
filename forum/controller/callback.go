package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"forum/forum/config"
)

type FacebookAccount struct {
	Id    int
	Name  string
	Email string
	Image map[string]FbImage
}

type FbImage struct {
	Url string
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	// check if method is correct
<<<<<<< HEAD
=======

>>>>>>> d84a6f4ed9abbfe8f775115f38fbd4571b6255ba
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get oauth state from cookie for this user
	oauthState, _ := r.Cookie("oauthstate")
	state := r.FormValue("state")
	code := r.FormValue("code")
	w.Header().Add("content-type", "application/json")

	// ERROR : Invalid OAuth State
	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth google state")
		return
	}

	// Exchange Auth Code for Tokens
	token, err := config.AppConfig.GoogleLoginConfig.Exchange(
		context.Background(), code)

	// ERROR : Auth Code Exchange Failed
	if err != nil {
		fmt.Fprintf(w, "falied code exchange: %s", err.Error())
		return
	}

	// Fetch User Data from google server
	response, err := http.Get(config.OauthGoogleUrlAPI + token.AccessToken)

	// ERROR : Unable to get user data from google
	if err != nil {
		fmt.Fprintf(w, "failed getting user info: %s", err.Error())
		return
	}

	// Parse user data JSON Object
	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Fprintf(w, "failed read response: %s", err.Error())
		return
	}

	// send back response to browser
	fmt.Fprintln(w, string(contents))
}

func FbCallback(w http.ResponseWriter, r *http.Request) {
	// check if method is correct
	var fbAccount FacebookAccount

	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get oauth state from cookie for this user
	oauthState, _ := r.Cookie("oauthstate")
	state := r.FormValue("state")
	code := r.FormValue("code")
	w.Header().Add("content-type", "application/json")

	// ERROR : Invalid OAuth State
	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth facebook state")
		return
	}

	// Exchange Auth Code for Tokens
	token, err := config.AppConfig.FacebookLoginConfig.Exchange(
		context.Background(), code)

	// ERROR : Auth Code Exchange Failed
	if err != nil {
		fmt.Fprintf(w, "failed code exchange: %s", err.Error())
		return
	}

	// Fetch User Data from facebook server
	response, err := http.Get(config.OauthFacebookUrlAPI + token.AccessToken)

	// ERROR : Unable to get user data from facebook
	if err != nil {
		fmt.Fprintf(w, "failed getting user info: %s", err.Error())
		return
	}

	// Parse user data JSON Object
	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Fprintf(w, "failed read response: %s", err.Error())
		return
	}

	// send back response to browser
	json.Unmarshal(contents, &fbAccount)
	fmt.Println(fbAccount)
}

func GitHubCallback(w http.ResponseWriter, r *http.Request) {
	// check if method is correct
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get oauth state from cookie for this user
	oauthState, _ := r.Cookie("oauthstate")
	state := r.FormValue("state")
	code := r.FormValue("code")
	w.Header().Add("content-type", "application/json")
	w.Header().Add("Accept", "application/json")

	// ERROR : Invalid OAuth State
	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth github state")
		return
	}
	// Exchange Auth Code for Tokens
	token, err := config.AppConfig.GithubLoginConfig.Exchange(
		context.Background(), code)

	//ERROR : Auth Code Exchange Failed
	if err != nil {
		fmt.Fprintf(w, "failed code exchange: %s", err.Error())
		return
	}

	client := &http.Client{}

	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)

	// ERROR : Unable to get user data from github
	if err != nil {
		fmt.Fprintf(w, "failed getting user info: %s", err.Error())
		return
	}

	req.Header.Add("Authorization", "token "+token.AccessToken)
	resp, err := client.Do(req)

	// ERROR : Unable to get user data from github
	if err != nil {
		fmt.Fprintf(w, "failed getting user info: %s", err.Error())
		return
	}

	// Parse user data JSON Object
	defer resp.Body.Close()
	contents, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(w, "failed read response: %s", err.Error())
		return
	}

	// send back response to browser
	fmt.Fprintln(w, string(contents))
}
