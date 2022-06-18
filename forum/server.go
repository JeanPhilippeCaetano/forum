package forum

import (
	"database/sql"
	"fmt"
	"net/http"
)

type Global struct {
	AllUsers []Users
	AllPosts []Posts
	// AllPostsComments []PostComments
	// AllComments      []Comments
	Db *sql.DB
}

func Server() {
	fmt.Println("Le serveur est lancé : http://localhost:8080")

	// create a router
	mux := http.NewServeMux()

	global := &Global{}
	global.Db = InitDatabase()

	fs := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	fscript := http.FileServer(http.Dir("./assets/"))
	mux.Handle("/assets/", http.StripPrefix("/assets/", fscript))

	fp := http.FileServer(http.Dir("./pages/"))
	mux.Handle("/pages/", http.StripPrefix("/pages/", fp))

	loadAllRoutes(global, mux)

	// run server
	http.ListenAndServe(":8080", mux)

}
