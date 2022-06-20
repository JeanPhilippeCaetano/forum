package forum

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type GoogleAccount struct {
	Id             string
	Email          string
	Verified_email bool
	Name           string
	Given_name     string
	Family_name    string
	Picture        string
	Locale         string
}

type GithubAccount struct {
	Login      string
	Id         int
	Avatar_url string
}

type FacebookAccount struct {
	Id      string
	Name    string
	Email   string
	Picture FbPicture
}

type FbPicture struct {
	Data FbImage
}

type FbImage struct {
	Height        int
	Is_silhouette bool
	Url           string
	Width         int
}

func GoogleCallback(w http.ResponseWriter, r *http.Request, global *Global) {
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

	// ERROR : Invalid OAuth State
	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth google state")
		return
	}

	// Exchange Auth Code for Tokens
	token, err := AppConfig.GoogleLoginConfig.Exchange(
		context.Background(), code)

	// ERROR : Auth Code Exchange Failed
	if err != nil {
		fmt.Fprintf(w, "falied code exchange: %s", err.Error())
		return
	}

	// Fetch User Data from google server
	response, err := http.Get(OauthGoogleUrlAPI + token.AccessToken)

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
	session, _ := store.Get(r, "cookie-name")
	var ggAccount GoogleAccount

	json.Unmarshal(contents, &ggAccount)
	InsertData(Users{}, global.Db, "users", ggAccount.Name, "Utilisateur", ggAccount.Email, "", "", ggAccount.Picture, "", time.Now().Format("02-Jan-2006 15:04:05"))
	session.Values["authenticated"] = true
	session.Values["username"] = ggAccount.Name
	c := http.Cookie{
		Name:   "pseudo",
		Value:  ggAccount.Name,
		MaxAge: 2147483647}
	http.SetCookie(w, &c)
	session.Save(r, w)
	http.Redirect(w, r, "/profil?pseudo="+ggAccount.Name, http.StatusFound)
}

func FbCallback(w http.ResponseWriter, r *http.Request, global *Global) {
	session, _ := store.Get(r, "cookie-name")
	var fbAccount FacebookAccount
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	oauthState, _ := r.Cookie("oauthstate")
	state := r.FormValue("state")
	code := r.FormValue("code")
	w.Header().Add("content-type", "application/json")

	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth facebook state")
		return
	}

	token, err := AppConfig.FacebookLoginConfig.Exchange(
		context.Background(), code)

	if err != nil {
		fmt.Fprintf(w, "failed code exchange: %s", err.Error())
		return
	}

	response, err := http.Get(OauthFacebookUrlAPI + token.AccessToken)

	if err != nil {
		fmt.Fprintf(w, "failed getting user info: %s", err.Error())
		return
	}

	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Fprintf(w, "failed read response: %s", err.Error())
		return
	}

	json.Unmarshal(contents, &fbAccount)
	InsertData(Users{}, global.Db, "users", fbAccount.Name, "Utilisateur", fbAccount.Email, "", "", fbAccount.Picture.Data.Url, "", time.Now().Format("02-Jan-2006 15:04:05"))
	session.Values["authenticated"] = true
	session.Values["username"] = fbAccount.Name
	c := http.Cookie{
		Name:   "pseudo",
		Value:  fbAccount.Name,
		MaxAge: 2147483647}
	http.SetCookie(w, &c)
	session.Save(r, w)
	http.Redirect(w, r, "/profil?pseudo="+fbAccount.Name, http.StatusFound)
}

func GitHubCallback(w http.ResponseWriter, r *http.Request, global *Global) {
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
	token, err := AppConfig.GithubLoginConfig.Exchange(
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

	session, _ := store.Get(r, "cookie-name")
	var gthubAccount GithubAccount

	json.Unmarshal(contents, &gthubAccount)
	InsertData(Users{}, global.Db, "users", gthubAccount.Login, "Utilisateur", "", "", "", gthubAccount.Avatar_url, "", time.Now().Format("02-Jan-2006 15:04:05"))
	session.Values["authenticated"] = true
	session.Values["username"] = gthubAccount.Login
	c := http.Cookie{
		Name:   "pseudo",
		Value:  gthubAccount.Login,
		MaxAge: 2147483647}
	http.SetCookie(w, &c)
	session.Save(r, w)
	http.Redirect(w, r, "/profil?pseudo="+gthubAccount.Login, http.StatusFound)
}
