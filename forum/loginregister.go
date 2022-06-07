package forum

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/sessions"
)

var (
	key   = []byte("super-secret-key")
	store = sessions.NewCookieStore(key)
)

type RegParams struct {
	Pseudo   string
	Email    string
	Password string
}

type LogParams struct {
	Pseudo   string
	Password string
}

type User struct {
	Pseudo string
}

func Register(w http.ResponseWriter, r *http.Request, global *Global) {
	var account RegParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	_, err := InsertData(Users{}, global.Db, "users", account.Pseudo, account.Email, account.Password, "", "../assets/images/defaultProfil.jpg")
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.Email" {
			http.Error(w, `{"err": "Mail déjà utilisé"}`, http.StatusBadRequest)
			return
		} else if err.Error() == "UNIQUE constraint failed: users.Pseudonyme" {
			http.Error(w, `{"err": "Pseudo déjà utilisé"}`, http.StatusBadRequest)
			return
		}
	}
	w.Write([]byte("{\"pseudo\": \"" + account.Pseudo + "\"}"))
}

func Login(w http.ResponseWriter, r *http.Request, global *Global) {
	var account LogParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	u, _ := GetUser(global.Db, "users", account.Pseudo)
	if u.Pseudonyme == "" {
		http.Error(w, `{"err": "Compte inexistant."}`, http.StatusBadRequest)
		return
	}
	session, _ := store.Get(r, "cookie-name")
	session.Values["authenticated"] = account.Pseudo
	session.Save(r, w)
	w.Write([]byte("{\"pseudo\": \"" + account.Pseudo + "\"}"))
}

func GetInfos(w http.ResponseWriter, r *http.Request, global *Global) {
	var u User
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &u)
	user, _ := GetUser(global.Db, "users", u.Pseudo)
	body, _ := json.MarshalIndent(user, "", "")
	w.Write(body)
}
