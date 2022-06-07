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
			// w.Write([]byte("{\"error\": \"Mail déjà utilisé !\"}"))
			http.Error(w, `{"err": "Mail déjà utilisé"}`, http.StatusBadRequest)
			return
		} else if err.Error() == "UNIQUE constraint failed: users.Pseudonyme" {
			http.Error(w, `{"err": "Pseudo déjà utilisé"}`, http.StatusBadRequest)
			// w.Write([]byte("{\"error\": \"Pseudo déjà utilisé !\"}"))
			return
		}
	}
	w.Write([]byte("{\"msg\": \"\"}"))
	//	http.Redirect(w, r, "/profil?user="+account.Pseudo, http.StatusFound)
}

func GetInfos(w http.ResponseWriter, r *http.Request, global *Global, pseudo string) {
	user := GetUser(global.Db, "users", pseudo)
	body, _ := json.MarshalIndent(user, "", "")
	w.Write(body)
}
