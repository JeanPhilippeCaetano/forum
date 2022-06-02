package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type Account struct {
	Pseudonyme string
	Email      string
	Password   string
}

func Register(w http.ResponseWriter, r *http.Request) {
	var account Account
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &account)

}
