package forum

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type UserRank struct {
	Pseudo  string
	NewRank string
}

func ChangeRole(w http.ResponseWriter, r *http.Request, global *Global) {
	var u UserRank
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &u)
	userData, _ := GetUser(global.Db, "users", u.Pseudo)
	UpdateData(Users{}, global.Db, "users", userData.UserID, userData.Pseudonyme, u.NewRank, userData.Email, userData.Password, userData.Biography, userData.Image, userData.PostLikes, userData.Date)
}
