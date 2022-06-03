package forum

import (
	"encoding/json"
	"fmt"
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
	var err error
	if account != nil {
		err = InsertData(Users{}, global.Db, "users", account.Pseudo, account.Email, account.Password, "")
	}
	fmt.Println(err)
	if err != nil {
		w.Write([]byte("{\"error\": \"Pseudo ou Mail déjà utilisé !\"}"))
	}
}
