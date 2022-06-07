package forum

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type Account struct {
	Pseudo   string
	Email    string
	Password string
}

type User struct {
	Pseudo string
}

func Register(w http.ResponseWriter, r *http.Request, global *Global) {
	var account Account
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

func GetInfos(w http.ResponseWriter, r *http.Request, global *Global) {
	var u User
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &u)
	user := GetUser(global.Db, "users", u.Pseudo)
	body, _ := json.MarshalIndent(user, "", "")
	w.Write(body)
}
