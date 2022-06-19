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
	// forum.InsertData(forum.Users{}, db, "users", "Admin", "Administrateur", "admin@tucrack.com", "admin", "", "../assets/images/defaultProfil.jpg", "", time.Now().Format("2006.01.02 15:04:05"))
	// forum.InsertData(forum.Users{}, db, "users", "Modo", "Modérateur", "modo@tucrack.com", "modo", "", "../assets/images/defaultProfil.jpg", "", time.Now().Format("2006.01.02 15:04:05"))

	forum.Server()
}
