package forum

import (
	"net/http"
	"text/template"
)

func Index(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/index.html", "./templates/header.html", "./templates/footer.html"))
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

func Contact(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/contact.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func loadAllRoutes() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		Posts(w, r)
	})
	http.HandleFunc("/inscreg", func(w http.ResponseWriter, r *http.Request) {
		InscReg(w, r)
	})
	http.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		Contact(w, r)
	})
}
