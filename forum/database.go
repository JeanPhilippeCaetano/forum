package forum

import (
	"database/sql"
	"log"
	"reflect"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type Users struct {
	UserID     int
	Pseudonyme string
	Rank       string
	Email      string
	Password   string
	Biography  string
	Image      string
	PostLikes  string
	Date       string
}

type Posts struct {
	PostID   int
	SenderID int
	ParentID int
	Title    string
	Content  string
	Tags     string
	Likes    int
	Date     string
}

type Reports struct {
	ReportID int
	SenderID int
	ParentID int
	PostID   int
	Reason   string
	Date     string
}

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./forum.db")
	statement := `PRAGMA foreign_keys = ON;
	CREATE TABLE IF NOT EXISTS users
	(
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    	Pseudonyme TEXT NOT NULL UNIQUE CHECK(length(Pseudonyme) <= 24),
		Rank TEXT NOT NULL,
    	Email TEXT NOT NULL UNIQUE,
    	Password TEXT NOT NULL CHECK(length(Password) <= 16),
		Biography TEXT NOT NULL,
    	Image TEXT NOT NULL,
		PostLikes TEXT NOT NULL,
		Date TEXT NOT NULL
	);
	
	CREATE TABLE IF NOT EXISTS posts
	(
		PostID INTEGER PRIMARY KEY AUTOINCREMENT,
		SenderID INTEGER NOT NULL,
		ParentID INTEGER,
		Title TEXT,
		Content TEXT NOT NULL,
		Tags TEXT,
		Likes INTEGER NOT NULL,
		Date TEXT NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID),
		FOREIGN KEY(ParentID) REFERENCES posts(PostID)
	);

	CREATE TABLE IF NOT EXISTS reports
	(
		ReportID INTEGER PRIMARY KEY AUTOINCREMENT,
		SenderID INTEGER NOT NULL,
		ParentID INTEGER,
		PostID INTEGER,
		Reason TEXT NOT NULL,
		Date TEXT NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID),
		FOREIGN KEY(PostID) REFERENCES posts(PostID),
		FOREIGN KEY(ParentID) REFERENCES reports(ReportID)
	);
	`
	db.Exec(statement)
	if err != nil {
		log.Panic(err)
	}
	return db
}

func parseInsertParams(structure interface{}, table string, parameters ...interface{}) string {
	data := reflect.ValueOf(structure)
	statement := "INSERT INTO " + table
	attributes := "("
	values := "VALUES("
	for i := 1; i < data.NumField(); i++ {
		attributes += data.Type().Field(i).Name
		values += "?"
		if i != data.NumField()-1 {
			attributes += ","
			values += ","
		}
	}
	attributes += ") "
	values += ")"
	return statement + attributes + values
}

func InsertData(structure interface{}, db *sql.DB, table string, parameters ...interface{}) (sql.Result, error) {
	statement := parseInsertParams(structure, table, parameters...)
	result, err := db.Exec(statement, parameters...)
	return result, err
}

func parseUpdateParams(structure interface{}, table string, id int, parameters ...interface{}) string {
	data := reflect.ValueOf(structure)
	statement := "UPDATE " + table + " SET "
	setters := ""
	for i := 1; i < data.NumField(); i++ {
		setters += data.Type().Field(i).Name + " = "
		setters += "?"
		if i != data.NumField()-1 {
			setters += ","
		}
	}
	setters += " WHERE " + data.Type().Field(0).Name + "='" + strconv.Itoa(id) + "'"
	return statement + setters
}

func UpdateData(structure interface{}, db *sql.DB, table string, id int, parameters ...interface{}) (sql.Result, error) {
	statement := parseUpdateParams(structure, table, id, parameters...)
	result, err := db.Exec(statement, parameters...)
	return result, err
}

func DeleteData(structure interface{}, db *sql.DB, table string, id int) (sql.Result, error) {
	statement := "DELETE FROM " + table + " WHERE " + GetIDNameFromStruct(structure) + "=" + strconv.Itoa(id) + ""
	result, err := db.Exec(statement)
	return result, err
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

func GetUser(db *sql.DB, table string, pseudo string) (Users, error) {
	var u Users
	statement := "SELECT * FROM " + table + " WHERE Pseudonyme='" + pseudo + "'"
	rows, err := db.Query(statement)
	for rows.Next() {
		err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Rank, &u.Email, &u.Password, &u.Biography, &u.Image, &u.PostLikes, &u.Date)
		if err != nil {
			log.Panic(err)
		}
	}
	return u, err
}

func resetGlobal(global *Global, data string) *Global {
	if data == "Users" {
		global.AllUsers = []Users{}
	} else if data == "Posts" {
		global.AllPosts = []Posts{}
	} else if data == "Reports" {
		global.AllReports = []Reports{}
	}
	return global
}

func DisplayOnePost(rows *sql.Rows) Posts {
	var p Posts
	var parentId sql.NullInt64
	for rows.Next() {
		err := rows.Scan(&p.PostID, &p.SenderID, &parentId, &p.Title, &p.Content, &p.Tags, &p.Likes, &p.Date)
		if err != nil {
			log.Panic(err)
		}
		p.ParentID = int(parentId.Int64)
	}
	return p
}

func DisplayOneUser(rows *sql.Rows) Users {
	var u Users
	for rows.Next() {
		err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Rank, &u.Email, &u.Password, &u.Biography, &u.Image, &u.PostLikes, &u.Date)
		if err != nil {
			log.Panic(err)
		}
	}
	return u
}

func DisplayOneReport(rows *sql.Rows) Reports {
	var r Reports
	var parentId sql.NullInt64
	for rows.Next() {
		err := rows.Scan(&r.ReportID, &r.SenderID, &parentId, &r.PostID, &r.Reason, &r.Date)
		if err != nil {
			log.Panic(err)
		}
		r.ParentID = int(parentId.Int64)
	}
	return r
}

func DisplayRows(global *Global, rows *sql.Rows, structure interface{}) *Global {
	data := reflect.TypeOf(structure).Name()
	global = resetGlobal(global, data)
	for rows.Next() {
		if data == "Users" {
			var u Users
			err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Rank, &u.Email, &u.Password, &u.Biography, &u.Image, &u.PostLikes, &u.Date)
			if err != nil {
				log.Panic(err)
			}
			global.AllUsers = append(global.AllUsers, u)
		} else if data == "Posts" {
			var p Posts
			var parentId sql.NullInt64
			err := rows.Scan(&p.PostID, &p.SenderID, &parentId, &p.Title, &p.Content, &p.Tags, &p.Likes, &p.Date)
			if err != nil {
				log.Panic(err)
			}
			p.ParentID = int(parentId.Int64)
			global.AllPosts = append(global.AllPosts, p)
		}
	}
	return global
}
