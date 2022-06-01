package database

import (
	"database/sql"
	"fmt"
	"log"
	"reflect"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type Users struct {
	UserID     int
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
	Likes     int
	Date      string
}

type Comments struct {
	CommentID  int
	Content    string
	SenderID   int
	ReceiverID int
	Likes      int
	Date       string
}

type Posts struct {
	PostID   int
	SenderID int
	Title    string
	Content  string
	Likes    int
	Date     string
}

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./forum.db")
	statement := `PRAGMA foreign_keys = ON;
	CREATE TABLE IF NOT EXISTS users
	(
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    	Pseudonyme TEXT NOT NULL UNIQUE,
    	Email TEXT NOT NULL UNIQUE,
    	Password TEXT NOT NULL,
    	Image TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS postcomments
	(
		CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
		Content TEXT NOT NULL,
		SenderID INTEGER NOT NULL,
		PostID INTEGER NOT NULL,
		Likes INTEGER NOT NULL,
		Date DATE NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID),
		FOREIGN KEY(PostID) REFERENCES posts(PostID)
	);
	CREATE TABLE IF NOT EXISTS posts
	(
		PostID INTEGER PRIMARY KEY AUTOINCREMENT,
		SenderID INTEGER NOT NULL,
		Title TEXT NOT NULL,
		Content TEXT NOT NULL,
		Likes INTEGER NOT NULL,
		Date DATE NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID)
	);
	CREATE TABLE IF NOT EXISTS comments
	(
		CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
		Content TEXT NOT NULL,
		SenderID INTEGER NOT NULL,
		ReceiverID INTEGER NOT NULL,
		Likes INTEGER NOT NULL,
		Date DATE NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID),
		FOREIGN KEY(ReceiverID) REFERENCES users(UserID)
	);
	`
	db.Exec(statement)
	if err != nil {
		log.Panic(err)
	}
	return db
}

func parseParams(structure interface{}, table string, parameters ...string) string {
	data := reflect.ValueOf(structure)
	statement := "INSERT INTO " + table
	attributes := "("
	values := "VALUES("
	for i := 1; i < data.NumField(); i++ {
		attributes += data.Type().Field(i).Name
		values += "'" + parameters[i-1] + "'"
		if i != data.NumField()-1 {
			attributes += ","
			values += ","
		}
	}
	attributes += ") "
	values += ")"
	return statement + attributes + values
}

func InsertData(structure interface{}, db *sql.DB, table string, parameters ...string) sql.Result {
	statement := parseParams(structure, table, parameters...)
	result, err := db.Exec(statement)
	if err != nil {
		log.Panic(err)
	}
	return result
}

func GetAllDataFromTable(db *sql.DB, table string) *sql.Rows {
	statement := "SELECT * FROM " + table
	query, err := db.Query(statement)
	if err != nil {
		log.Panic(err)
	}
	return query
}

func GetIDNameFromStruct(structure interface{}) string {
	data := reflect.ValueOf(structure)
	return data.Type().Field(0).Name
}

func GetDataFromTableWithID(structure interface{}, db *sql.DB, table string, id int) *sql.Rows {
	idName := GetIDNameFromStruct(structure)
	statement := "SELECT * FROM " + table + " WHERE " + idName + "='" + strconv.Itoa(id) + "'"
	query, err := db.Query(statement)
	if err != nil {
		log.Panic(err)
	}
	return query
}

func DisplayRows(rows *sql.Rows, structure interface{}) {
	data := reflect.TypeOf(structure).Name()
	var allUsers []Users
	for rows.Next() {
		if data == "Users" {
			var u Users
			err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Email, &u.Password, &u.Image)
			if err != nil {
				log.Panic(err)
			}
			allUsers = append(allUsers, u)
		} else if data == "PostComments" {
			var pc PostComments
			err := rows.Scan(&pc.CommentID, &pc.Content, &pc.SenderID, &pc.PostID, &pc.Likes, &pc.Date)
			if err != nil {
				log.Panic(err)
			}
		} else if data == "Comments" {
			var c Comments
			err := rows.Scan(&c.CommentID, &c.Content, &c.SenderID, &c.ReceiverID, &c.Likes, &c.Date)
			if err != nil {
				log.Panic(err)
			}
		} else if data == "Posts" {
			var p Posts
			err := rows.Scan(&p.PostID, &p.SenderID, &p.Title, &p.Content, &p.Likes, &p.Date)
			if err != nil {
				log.Panic(err)
			}
		}
	}

	fmt.Println(allUsers)
}
