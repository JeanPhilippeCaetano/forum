package main

import (
	"forum/forum"
)

func main() {
	// db := forum.InitDatabase()
	// global := &forum.Global{}
	// forum.InsertData(forum.Users{}, db, "users", "Jp", "admin", "jp@gmail.com", "mdp123", "ma biographie", "../assets/images/defaultProfil.jpg")
	// global = forum.DisplayRows(global, forum.GetAllDataFromTable(db, "users"), forum.Users{})
	// fmt.Println(global.AllUsers)
	// // result, err := forum.InsertData(forum.Users{}, db, "users", "Jp", "jp@gmail.com", "mdp123", "ma biographie", "../assets/images/defaultProfil.jpg")
	// // fmt.Println(result, err)
	// forum.UpdateData(forum.Users{}, db, "users", 1, "Jeep", "jeep@gmail.com", "mdp", "biography", "../assets/images/defaultProfil.jpg")
	// global = forum.DisplayRows(global, forum.GetDataFromTableWithID(forum.Users{}, db, "users", 1), forum.Users{})
	// fmt.Println(global.AllUsers)
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Chacal", "Amaury le gros chacal de ses grands morts", "java", 12, time.Now().Format("2004.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Singe", "Amaury le gros singe de ses grands morts", "javascript,golang", 99, time.Now().Format("2003.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Pute", "Amaury la grosse pute de ses grands morts", "python", 123, time.Now().Format("2006.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Trou", "Amaury le gros trou de ses grands morts", "mobile", 1234, time.Now().Format("2005.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Cheval", "Amaury le gros cheval de ses grands morts", "appli/logiciel", 12345, time.Now().Format("2007.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Javel", "Amaury la grosse javel de ses grands morts", "javascript,python", 123456, time.Now().Format("2008.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Babouin", "Amaury le gros babouin de ses grands morts", "mobile,golang", 1234567, time.Now().Format("2009.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Computer", "Amaury le gros computer de ses grands morts", "python,golang", 12345678, time.Now().Format("2010.01.02 15:04:05"))
	// forum.InsertData(forum.Posts{}, db, "posts", 1, nil, "Insecte", "Amaury le gros insecte de ses grands morts", "java,golang", 123456789, time.Now().Format("2011.01.02 15:04:05"))
	forum.Server()

}
