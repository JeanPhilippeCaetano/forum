package forum

import (
	"fmt"
	"net/http"
	"text/template"

	"forum/forum/config"
	"forum/forum/controller"
)

func Pageprofil(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/pageProfil.html"))
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
	tmpl := template.Must(template.ParseFiles("./pages/pageModifProfil.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}
func PostsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/posts.html", "./templates/header.html", "./templates/footer.html", "./templates/previewPost.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func LoginRegister(w http.ResponseWriter, r *http.Request) {
	fmt.Println("loginregister")
	tmpl := template.Must(template.ParseFiles("./pages/loginregister.html", "./templates/header.html", "./templates/footer.html"))
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

func loadAllRoutes(global *Global, mux *http.ServeMux) {

	// load configs
	//config.LoadEnv()
	config.LoadConfig()

	// create a router

	// define routes
	mux.HandleFunc("/google_login", controller.GoogleLogin)
	mux.HandleFunc("/google_callback", controller.GoogleCallback)
	mux.HandleFunc("/fb_login", controller.FbLogin)
	mux.HandleFunc("/fb_callback", controller.FbCallback)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	mux.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	mux.HandleFunc("/getinfos", func(w http.ResponseWriter, r *http.Request) {
		GetInfos(w, r, global)
	})
	mux.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
	})
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, global)
	})
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		Login(w, r, global)
	})
	mux.HandleFunc("/getuser", func(w http.ResponseWriter, r *http.Request) {
		GetUserFromId(w, r, global)
	})
	mux.HandleFunc("/getposts", func(w http.ResponseWriter, r *http.Request) {
		GetPosts(w, r, global)
	})
	mux.HandleFunc("/getpost", func(w http.ResponseWriter, r *http.Request) {
		GetPost(w, r, global)
	})
	mux.HandleFunc("/modifypost", func(w http.ResponseWriter, r *http.Request) {
		ModifyPost(w, r, global)
	})
	mux.HandleFunc("/addpost", func(w http.ResponseWriter, r *http.Request) {
		AddPost(w, r, global)
	})
	mux.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
	})
	mux.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		Contact(w, r)
	})

}
