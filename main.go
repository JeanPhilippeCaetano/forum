package main

import (
	forum "forum/forum/database"
)

func main() {
	db := forum.InitDatabase()
	// forum.InsertData(forum.Users{}, db, "users", "ea", "esdsqs", "sdqsq", "dqsz")
	// forum.InsertData(forum.Users{}, db, "users", "easports", "j", "sdq", "dqz")
	// forum.InsertData(forum.Users{}, db, "users", "fsfqcqss", "y", "jgfd", "dfsdfsfejyu,khjqsz")
	forum.DisplayRows(forum.GetAllDataFromTable(db, "users"), forum.Users{})
	forum.DisplayRows(forum.GetDataFromTableWithID(forum.Users{}, db, "users", 1), forum.Users{})
}
