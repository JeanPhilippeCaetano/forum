package forum

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
)

func GenerateStateOauthCookie(w http.ResponseWriter) string {
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{
		Name:   "oauthstate",
		Value:  state,
		MaxAge: 2147483647,
	}

	http.SetCookie(w, &cookie)

	return state
}
