package forum

import (
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

func loadAllRoutes() {
	http.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
}
