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

func Register(w http.ResponseWriter, r *http.Request, global *Global) {
	var account Account
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	err := InsertData(Users{}, global.Db, "users", account.Pseudo, account.Email, account.Password, "")
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.Email" {
			w.Write([]byte("{\"error\": \"Mail déjà utilisé !\"}"))
		} else if err.Error() == "UNIQUE constraint failed: users.Pseudonyme" {
			w.Write([]byte("{\"error\": \"Pseudo déjà utilisé !\"}"))
		}
	}
}
