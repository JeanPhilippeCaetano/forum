package main

import (
	"fmt"
	database "forum/forum"
)

func main() {
	db := database.InitDatabase()
	global := &database.Global{}
	// forum.InsertData(forum.Users{}, db, "users", "ea", "esdsqs", "sdqsq", "dqsz")
	// forum.InsertData(forum.Users{}, db, "users", "easports", "j", "sdq", "dqz")
	// forum.InsertData(forum.Users{}, db, "users", "fsfqcqss", "y", "jgfd", "dfsdfsfejyu,khjqsz")
	global = database.DisplayRows(global, database.GetAllDataFromTable(db, "users"), database.Users{})
	fmt.Println(global.AllUsers)
	global = database.DisplayRows(global, database.GetDataFromTableWithID(database.Users{}, db, "users", 1), database.Users{})
	fmt.Println(global.AllUsers)
}
