package forum

import (
	"fmt"
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

func PostsRoute(w http.ResponseWriter, r *http.Request) {
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
		Index(w, r)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
	})
	http.HandleFunc("/inscreg", func(w http.ResponseWriter, r *http.Request) {
		InscReg(w, r)
	})
	http.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, global)
	})
}
