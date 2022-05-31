package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./forum.db")
	if err != nil {
		log.Panic(err)
	}
	return db
}
