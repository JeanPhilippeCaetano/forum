package forum

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type UpdateParams struct {
	Id       int
	Pseudo   string
	Email    string
	Password string
}

func UpdateProfil(w http.ResponseWriter, r *http.Request, global *Global) {
	var account UpdateParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	_, err := UpdateData(Users{}, global.Db, "users", account.Id, account.Pseudo, "Utilisateur", account.Email, account.Password, "", "../assets/images/defaultProfil.jpg")
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
