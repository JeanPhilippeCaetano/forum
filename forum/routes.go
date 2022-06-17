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
	// fmt.Println("loginregister")
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

func PostNCom(w http.ResponseWriter, r *http.Request, global *Global) {
	// InsertData(Users{}, global.Db, "users", "Gleadn", "utilisateur", "Gleadn@test.fr", "12345", "Salut à tous, c'est FANTA!", "../assets/images/defaultProfil.jpg")
	// InsertData(Posts{}, global.Db, "posts", 1, 2, "", "Du coup ? ça marche tout ça ?", "", 1, "15/06/2022")
	// InsertData(Posts{}, global.Db, "posts", 1, 512, "", "Maintenant faut afficher les commentaires du post", "", 42, "15/06/2022")
	// InsertData(Posts{}, global.Db, "posts", 1, 4, "", "Et faudra régler le prblèmes des likes sur les commentaires", "", 9, "15/06/2022")
	tmpl := template.Must(template.ParseFiles("./pages/singlePost.html", "./templates/header.html", "./templates/footer.html"))
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
	http.HandleFunc("/modifprofil", func(w http.ResponseWriter, r *http.Request) {
		Pagemodifprofil(w, r)
	})
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		PostsRoute(w, r)
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
	http.HandleFunc("/singlepost", func(w http.ResponseWriter, r *http.Request) {
		PostNCom(w, r, global)
	})
	http.HandleFunc("/getuser", func(w http.ResponseWriter, r *http.Request) {
		GetUserFromId(w, r, global)
	})
}
