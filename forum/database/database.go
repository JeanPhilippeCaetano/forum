package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type Users struct {
	Pseudonyme string
	Email      string
	Password   string
	Image      string
}

type PostComments struct {
	CommentID int
	Content   string
	SenderID  int
	PostID    int
}

type Comments struct {
	CommentID  int
	Content    string
	SenderID   int
	ReceiverID int
}

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./forum.db")
	if err != nil {
		log.Panic(err)
	}
	statement := `PRAGMA foreign_keys = ON;
				CREATE TABLE IF NOT EXISTS users(
					UserID INTEGER PRIMARY KEY AUTOINCREMENT,
					Pseudonyme UNIQUE TEXT NOT NULL,
					Email UNIQUE TEXT NOT NULL,
					Password TEXT NOT NULL,
					Image TEXT NOT NULL
				);
				CREATE TABLE IF NOT EXISTS postcomments(
					CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
					Content TEXT NOT NULL,
					SenderID INTEGER NOT NULL,
					PostID INTEGER NOT NULL
					FOREIGN KEY(SenderID)
						REFERENCES users(UserID)
				);
				CREATE TABLE IF NOT EXISTS posts(
					PostID INTEGER PRIMARY KEY AUTOINCREMENT,
					SenderID INTEGER NOT NULL,
					Title TEXT NOT NULL,
					Content TEXT NOT NULL,
					FOREIGN KEY(SenderID)
						REFERENCES users(UserID)
				);
				CREATE TABLE IF NOT EXISTS comments(
					CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
					Content TEXT NOT NULL,
					SenderID INTEGER NOT NULL,
					ReceiverID INTEGER NOT NULL,
					FOREIGN KEY(SenderID)
						REFERENCES users(UserID),
					FOREIGN KEY(ReceiverID)
						REFERENCES users(UserID)
				);

	`

	db.Exec(statement)

	return db
}

type Posts struct {
	PostID  int
	Title   string
	Content string
}
