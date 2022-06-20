package main

import (
	forum "forum/forum"
)

func main() {
	// db := forum.InitDatabase()
	// forum.InsertData(forum.Users{}, db, "users", "Admin", "Administrateur", "admin@tucrack.com", "admin", "", "../assets/images/defaultProfil.jpg", "", "")

	forum.Server()
}
