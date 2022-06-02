package api

import (
	"encoding/json"
	"fmt"
	"forum/forum"
	"io/ioutil"
	"net/http"
)

type Account struct {
	Pseudonyme string
	Email      string
	Password   string
}

func Register(w http.ResponseWriter, r *http.Request, global *forum.Global) {
	var account Account
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)
	err := forum.InsertData(forum.Users{}, global.Db, "users", account.Pseudonyme, account.Email, account.Password, "")
	fmt.Println(err)
}
