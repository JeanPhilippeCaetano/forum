package forum

import (
	"fmt"
	"net/http"
	"text/template"
)

func Pageprofil(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/pageProfil.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func Pagemodifprofil(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/pageModifProfil.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func LoginRegister(w http.ResponseWriter, r *http.Request) {
	fmt.Println("loginregister")
	tmpl := template.Must(template.ParseFiles("./pages/loginregister.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func loadAllRoutes(global *Global) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	})
	http.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	http.HandleFunc("/getinfos", func(w http.ResponseWriter, r *http.Request) {
		GetInfos(w, r, global)
	})
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	http.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, global)
	})
}
