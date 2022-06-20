package forum

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
)

type Global struct {
	AllUsers   []Users
	AllPosts   []Posts
	AllReports []Reports
	Db         *sql.DB
}

func Server() {
	fmt.Println("Le serveur est lancé : http://localhost:8080")

	mux := http.NewServeMux()

	LoadConfig()
	global := &Global{}
	global.Db = InitDatabase()

	fs := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	fscript := http.FileServer(http.Dir("./assets/"))
	mux.Handle("/assets/", http.StripPrefix("/assets/", fscript))

	fp := http.FileServer(http.Dir("./pages/"))
	mux.Handle("/pages/", http.StripPrefix("/pages/", fp))

	LoadApi(global, mux)
	LoadPages(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(":"+port, mux)

}
