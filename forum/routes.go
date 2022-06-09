package forum

import (
	"net/http"
	"text/template"
)

func Pageprofil(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/pageProfil.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}
func Index(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/index.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func Pagemodifprofil(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/pageModifProfil.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func Posts(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/posts.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func InscReg(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/inscr-reg.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func loadAllRoutes() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	http.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		Posts(w, r)
	})
	http.HandleFunc("/inscreg", func(w http.ResponseWriter, r *http.Request) {
		InscReg(w, r)
	})
}
