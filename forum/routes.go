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
	session, _ := store.Get(r, "cookie-name")
	if session.Values["authenticated"] == nil {
		http.Error(w, "Il faut être connecté pour exécuter une telle action !", http.StatusForbidden)
		return
	}
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, "Il faut être connecté pour exécuter une telle action !", http.StatusForbidden)
		return
	} else if auth := session.Values["username"].(string); auth != r.URL.Query().Get("pseudo") {
		http.Error(w, "Vous ne pouvez pas modifier le profil d'une autre personne !", http.StatusForbidden)
		return
	}
	tmpl := template.Must(template.ParseFiles("./pages/pageModifProfil.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func UsersRoute(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/userpanel.html", "./templates/header.html", "./templates/footer.html"))
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

func LoginRegister(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	if session.Values["authenticated"] != nil {
		if auth := session.Values["authenticated"].(bool); auth {
			http.Error(w, "Tu es déjà connecté !", http.StatusForbidden)
			return
		}
	}

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

func PostNCom(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/singlePost.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func AdminPanel(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/adminpanel.html", "./templates/header.html", "./templates/footer.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func LoadApi(global *Global, mux *http.ServeMux) {

	// AUTHENTIFICATION API (Google, Facebook, Github)

	mux.HandleFunc("/google_login", GoogleLogin)
	mux.HandleFunc("/google_callback", func(w http.ResponseWriter, r *http.Request) {
		GoogleCallback(w, r, global)
	})
	mux.HandleFunc("/fb_login", FbLogin)
	mux.HandleFunc("/fb_callback", func(w http.ResponseWriter, r *http.Request) {
		FbCallback(w, r, global)
	})
	mux.HandleFunc("/github_login", GitHubLogin)
	mux.HandleFunc("/github_callback", func(w http.ResponseWriter, r *http.Request) {
		GitHubCallback(w, r, global)
	})

	// POSTS & COMMENTS

	mux.HandleFunc("/deletepost", func(w http.ResponseWriter, r *http.Request) {
		DeletePost(w, r, global)
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
	mux.HandleFunc("/addcom", func(w http.ResponseWriter, r *http.Request) {
		AddCom(w, r, global)
	})
	mux.HandleFunc("/editcom", func(w http.ResponseWriter, r *http.Request) {
		EditCom(w, r, global)
	})

	// AUTHENTIFICATION & MODIFICATION PROFILE

	mux.HandleFunc("/getusers", func(w http.ResponseWriter, r *http.Request) {
		GetUsers(w, r, global)
	})
	mux.HandleFunc("/getinfos", func(w http.ResponseWriter, r *http.Request) {
		GetInfos(w, r, global)
	})
	mux.HandleFunc("/changerole", func(w http.ResponseWriter, r *http.Request) {
		ChangeRole(w, r, global)
	})
	mux.HandleFunc("/changeuser", func(w http.ResponseWriter, r *http.Request) {
		ModifyUser(w, r, global)
	})
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, global)
	})
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		Login(w, r, global)
	})
	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		Logout(w, r, global)
	})
	mux.HandleFunc("/getuser", func(w http.ResponseWriter, r *http.Request) {
		GetUserFromId(w, r, global)
	})
}

func LoadPages(mux *http.ServeMux) {
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	mux.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	mux.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		AdminPanel(w, r)
	})
	mux.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		UsersRoute(w, r)
	})
	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
	})
	mux.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		Contact(w, r)
	})
	mux.HandleFunc("/singlepost", func(w http.ResponseWriter, r *http.Request) {
		PostNCom(w, r)
	})
	mux.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
	})

}
