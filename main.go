package main

import (
	database "forum/forum/database"
)

func main() {
	db := database.InitDatabase()
	// forum.InsertData(forum.Users{}, db, "users", "ea", "esdsqs", "sdqsq", "dqsz")
	// forum.InsertData(forum.Users{}, db, "users", "easports", "j", "sdq", "dqz")
	// forum.InsertData(forum.Users{}, db, "users", "fsfqcqss", "y", "jgfd", "dfsdfsfejyu,khjqsz")
	database.DisplayRows(database.GetAllDataFromTable(db, "users"), database.Users{})
	database.DisplayRows(database.GetDataFromTableWithID(database.Users{}, db, "users", 1), database.Users{})
}
