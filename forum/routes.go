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
	tmpl := template.Must(template.ParseFiles("./pages/userpanel.html", "./templates/header.html", "./templates/footer.html", "./templates/previewUser.html"))
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

func LoadApi(global *Global) {

	// POSTS & COMMENTS

	http.HandleFunc("/deletepost", func(w http.ResponseWriter, r *http.Request) {
		DeletePost(w, r, global)
	})
	http.HandleFunc("/getposts", func(w http.ResponseWriter, r *http.Request) {
		GetPosts(w, r, global)
	})
	http.HandleFunc("/getpost", func(w http.ResponseWriter, r *http.Request) {
		GetPost(w, r, global)
	})
	http.HandleFunc("/modifypost", func(w http.ResponseWriter, r *http.Request) {
		ModifyPost(w, r, global)
	})
	http.HandleFunc("/addpost", func(w http.ResponseWriter, r *http.Request) {
		AddPost(w, r, global)
	})
	http.HandleFunc("/addcom", func(w http.ResponseWriter, r *http.Request) {
		AddCom(w, r, global)
	})
	http.HandleFunc("/editcom", func(w http.ResponseWriter, r *http.Request) {
		EditCom(w, r, global)
	})

	// AUTHENTIFICATION & MODIFICATION PROFILE

	http.HandleFunc("/getusers", func(w http.ResponseWriter, r *http.Request) {
		GetUsers(w, r, global)
	})
	http.HandleFunc("/getinfos", func(w http.ResponseWriter, r *http.Request) {
		GetInfos(w, r, global)
	})
	http.HandleFunc("/changerole", func(w http.ResponseWriter, r *http.Request) {
		ChangeRole(w, r, global)
	})
	http.HandleFunc("/changeuser", func(w http.ResponseWriter, r *http.Request) {
		ModifyUser(w, r, global)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, global)
	})
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		Login(w, r, global)
	})
	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		Logout(w, r, global)
	})
	http.HandleFunc("/getuser", func(w http.ResponseWriter, r *http.Request) {
		GetUserFromId(w, r, global)
	})
}

func LoadPages() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	http.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	http.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		AdminPanel(w, r)
	})
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		UsersRoute(w, r)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
	})
	http.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		Contact(w, r)
	})
	http.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
	})
	http.HandleFunc("/singlepost", func(w http.ResponseWriter, r *http.Request) {
		PostNCom(w, r)
	})
}
