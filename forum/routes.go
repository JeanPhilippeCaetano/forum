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

// func InscReg(w http.ResponseWriter, r *http.Request) {
// 	tmpl := template.Must(template.ParseFiles("./pages/loginregister.html", "./templates/header.html", "./templates/footer.html"))
// 	if r.Method != http.MethodPost {
// 		tmpl.Execute(w, r)
// 		return
// 	}
// }

// func Contact(w http.ResponseWriter, r *http.Request) {
// 	tmpl := template.Must(template.ParseFiles("./pages/contact.html", "./templates/header.html", "./templates/footer.html"))
// 	if r.Method != http.MethodPost {
// 		tmpl.Execute(w, r)
// 		return
// 	}
// }
func UsersRoute(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/userpanel.html", "./templates/header.html", "./templates/footer.html", "./templates/previewUser.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

// func LoginRegister(w http.ResponseWriter, r *http.Request) {
// 	tmpl := template.Must(template.ParseFiles("./pages/loginregister.html", "./templates/header.html", "./templates/footer.html"))
// 	if r.Method != http.MethodPost {
// 		tmpl.Execute(w, r)
// 		return
// 	}
// }

func PostsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./pages/posts.html", "./templates/header.html", "./templates/footer.html", "./templates/previewPost.html"))
	if r.Method != http.MethodPost {
		tmpl.Execute(w, r)
		return
	}
}

func LoginRegister(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	if auth := session.Values["authenticated"].(bool); auth {
		http.Error(w, "Tu es déjà connecté !", http.StatusForbidden)
		return
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

func loadAllRoutes(global *Global) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		Index(w, r)
	})
	http.HandleFunc("/profil", func(w http.ResponseWriter, r *http.Request) {
		Pageprofil(w, r)
	})
	http.HandleFunc("/getinfos", func(w http.ResponseWriter, r *http.Request) {
		GetInfos(w, r, global)
	})
	http.HandleFunc("/updateprofil", func(w http.ResponseWriter, r *http.Request) {
		UpdateProfil(w, r, global)
	})
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		UsersRoute(w, r)
	})
	http.HandleFunc("/getusers", func(w http.ResponseWriter, r *http.Request) {
		GetUsers(w, r, global)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
	})
	// http.HandleFunc("/inscreg", func(w http.ResponseWriter, r *http.Request) {
	// 	InscReg(w, r)
	// })
	http.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		Contact(w, r)
	})
	http.HandleFunc("/loginregister", func(w http.ResponseWriter, r *http.Request) {
		LoginRegister(w, r)
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
}
