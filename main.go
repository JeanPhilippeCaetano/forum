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
	forum.Server()
}
