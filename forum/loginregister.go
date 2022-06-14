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

type UserID struct {
	Id int
}

type User struct {
	Pseudo string
}

func Register(w http.ResponseWriter, r *http.Request, global *Global) {
	var account RegParams
	session, _ := store.Get(r, "cookie-name")
	if auth, ok := session.Values["authenticated"].(bool); ok || auth {
		http.Error(w, "Tu es déjà connecté !", http.StatusForbidden)
		return
	}
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	_, err := InsertData(Users{}, global.Db, "users", account.Pseudo, "Utilisateur", account.Email, account.Password, "", "../assets/images/defaultProfil.jpg")
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.Email" {
			http.Error(w, `{"err": "Mail déjà utilisé"}`, http.StatusBadRequest)
			return
		} else if err.Error() == "UNIQUE constraint failed: users.Pseudonyme" {
			http.Error(w, `{"err": "Pseudo déjà utilisé"}`, http.StatusBadRequest)
			return
		} else if err.Error() == "CHECK constraint failed: length(Pseudonyme) <= 16" {
			http.Error(w, `{"err": "Le pseudonyme ne doit pas dépasser 16 caractères"}`, http.StatusBadRequest)
			return
		} else if err.Error() == "CHECK constraint failed: length(Password) <= 16" {
			http.Error(w, `{"err": "Le mot de passe ne doit pas dépasser 16 caractères"}`, http.StatusBadRequest)
			return
		}
	}
	session.Values["authenticated"] = true
	session.Save(r, w)
	w.Write([]byte("{\"pseudo\": \"" + account.Pseudo + "\"}"))
}

func Login(w http.ResponseWriter, r *http.Request, global *Global) {
	var account LogParams
	session, _ := store.Get(r, "cookie-name")
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	u, _ := GetUser(global.Db, "users", account.Pseudo)
	if u.Pseudonyme == "" {
		http.Error(w, `{"err": "Compte inexistant."}`, http.StatusBadRequest)
		return
	} else if u.Pseudonyme == account.Pseudo && u.Password != account.Password {
		http.Error(w, `{"err": "Mauvais mot de passe."}`, http.StatusBadRequest)
		return
	}
	session.Values["authenticated"] = account.Pseudo
	session.Save(r, w)
	w.Write([]byte("{\"pseudo\": \"" + account.Pseudo + "\"}"))
}

func GetUserFromId(w http.ResponseWriter, r *http.Request, global *Global) {
	var u UserID
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &u)
	user := DisplayOneUser(GetDataFromTableWithID(Users{}, global.Db, "users", u.Id))
	body, _ := json.MarshalIndent(user, "", "")
	w.Write(body)
}

func GetInfos(w http.ResponseWriter, r *http.Request, global *Global) {
	var u User
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &u)
	user, _ := GetUser(global.Db, "users", u.Pseudo)
	body, _ := json.MarshalIndent(user, "", "")
	w.Write(body)
}
