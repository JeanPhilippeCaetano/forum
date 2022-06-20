package forum

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type FacebookAccount struct {
	Id      int
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

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
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

	// send back response to browser
	fmt.Fprintln(w, string(contents))
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

	// ERROR : Invalid OAuth State
	if state != oauthState.Value {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		fmt.Fprintf(w, "invalid oauth facebook state")
		return
	}

	// Exchange Auth Code for Tokens
	token, err := AppConfig.FacebookLoginConfig.Exchange(
		context.Background(), code)

	// ERROR : Auth Code Exchange Failed
	if err != nil {
		fmt.Fprintf(w, "failed code exchange: %s", err.Error())
		return
	}

	// Fetch User Data from facebook server
	response, err := http.Get(OauthFacebookUrlAPI + token.AccessToken)

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

	// fmt.Fprintln(w, string(contents))
	// send back response to browser
	json.Unmarshal(contents, &fbAccount)
	fmt.Println(fbAccount)
	InsertData(Users{}, global.Db, "users", fbAccount.Name, "Utilisateur", fbAccount.Email, strconv.Itoa(fbAccount.Id), "", fbAccount.Picture.Data.Url, "", time.Now().Format("2006.01.02 15:04:05"))
	session.Values["authenticated"] = true
	session.Values["username"] = fbAccount.Name
	c := http.Cookie{
		Name:   "pseudo",
		Value:  fbAccount.Name,
		MaxAge: 2147483647}
	http.SetCookie(w, &c)
	session.Save(r, w)
	w.Write([]byte("{\"pseudo\": \"" + fbAccount.Name + "\"}"))
	http.Redirect(w, r, "/profil?pseudo="+fbAccount.Name, http.StatusFound)
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

	// send back response to browser
	fmt.Fprintln(w, string(contents))
}
