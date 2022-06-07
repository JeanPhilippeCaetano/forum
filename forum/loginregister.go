package forum

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Account struct {
	Pseudo   string `json:"pseudo"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request, global *Global) error {
	var account Account
	body, _ := ioutil.ReadAll(r.Body)
	fmt.Println(body)
	test := json.Unmarshal(body, &account)
	fmt.Println(test)
	err := InsertData(Users{}, global.Db, "users", account.Pseudo, account.Email, account.Password, "")
	// fmt.Println(err)
	return err
}
