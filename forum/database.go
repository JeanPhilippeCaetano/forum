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
}

// type PostComments struct {
// 	CommentID int
// 	Content   string
// 	SenderID  int
// 	PostID    int
// 	Likes     int
// 	Date      string
// }

// type Comments struct {
// 	CommentID  int
// 	Content    string
// 	SenderID   int
// 	ReceiverID int
// 	Likes      int
// 	Date       string
// }

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

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./forum.db")
	statement := `PRAGMA foreign_keys = ON;
	CREATE TABLE IF NOT EXISTS users
	(
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    	Pseudonyme TEXT NOT NULL UNIQUE,
		Rank TEXT NOT NULL,
    	Email TEXT NOT NULL UNIQUE,
    	Password TEXT NOT NULL,
		Biography TEXT NOT NULL,
    	Image TEXT NOT NULL 
	);
	
	CREATE TABLE IF NOT EXISTS posts
	(
		PostID INTEGER PRIMARY KEY AUTOINCREMENT,
		SenderID INTEGER NOT NULL,
		ParentID INTEGER NOT NULL,
		Title TEXT,
		Content TEXT NOT NULL,
		Tags TEXT,
		Likes INTEGER NOT NULL,
		Date DATE NOT NULL,
		FOREIGN KEY(SenderID) REFERENCES users(UserID),
		FOREIGN Key(ParentID) REFERENCES posts(PostID)
	);

	`
	// CREATE TABLE IF NOT EXISTS postcomments
	// (
	// 	CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
	// 	Content TEXT NOT NULL,
	// 	SenderID INTEGER NOT NULL,
	// 	PostID INTEGER NOT NULL,
	// 	Likes INTEGER NOT NULL,
	// 	Date DATE NOT NULL,
	// 	FOREIGN KEY(SenderID) REFERENCES users(UserID),
	// 	FOREIGN KEY(PostID) REFERENCES posts(PostID)
	// );
	// CREATE TABLE IF NOT EXISTS comments
	// (
	// 	CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
	// 	Content TEXT NOT NULL,
	// 	SenderID INTEGER NOT NULL,
	// 	ReceiverID INTEGER NOT NULL,
	// 	Likes INTEGER NOT NULL,
	// 	Date DATE NOT NULL,
	// 	FOREIGN KEY(SenderID) REFERENCES users(UserID),
	// 	FOREIGN KEY(ReceiverID) REFERENCES users(UserID)
	// );
	db.Exec(statement)
	if err != nil {
		log.Panic(err)
	}
	return db
}

func parseInsertParams(structure interface{}, table string, parameters ...string) string {
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

func parseUpdateParams(structure interface{}, table string, id int, parameters ...string) string {
	data := reflect.ValueOf(structure)
	statement := "UPDATE " + table + " SET "
	setters := ""
	for i := 1; i < data.NumField(); i++ {
		setters += data.Type().Field(i).Name + " = "
		setters += "'" + parameters[i-1] + "'"
		if i != data.NumField()-1 {
			setters += ","
		}
	}
	setters += "WHERE " + data.Type().Field(0).Name + "='" + strconv.Itoa(id) + "'"
	return statement + setters
}

func InsertData(structure interface{}, db *sql.DB, table string, parameters ...string) (sql.Result, error) {
	statement := parseInsertParams(structure, table, parameters...)
	result, err := db.Exec(statement)
	return result, err
}

func UpdateData(structure interface{}, db *sql.DB, table string, id int, parameters ...string) (sql.Result, error) {
	statement := parseUpdateParams(structure, table, id, parameters...)
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
		err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Rank, &u.Email, &u.Password, &u.Biography, &u.Image)
		if err != nil {
			log.Panic(err)
		}
	}
	return u, err
}

func resetGlobal(global *Global, data string) *Global {
	if data == "Users" {
		global.AllUsers = []Users{}
		// } else if data == "Comments" {
		// 	global.AllComments = []Comments{}
		// } else if data == "PostComments" {
		// 	global.AllPostsComments = []PostComments{}
	} else if data == "Posts" {
		global.AllPosts = []Posts{}
	}
	return global
}

func DisplayOnePost(rows *sql.Rows) Posts {
	var p Posts
	for rows.Next() {
		err := rows.Scan(&p.PostID, &p.SenderID, &p.ParentID, &p.Title, &p.Content, &p.Likes, &p.Date)
		if err != nil {
			log.Panic(err)
		}
	}
	return p
}

func DisplayRows(global *Global, rows *sql.Rows, structure interface{}) *Global {
	data := reflect.TypeOf(structure).Name()
	global = resetGlobal(global, data)
	for rows.Next() {
		if data == "Users" {
			var u Users
			err := rows.Scan(&u.UserID, &u.Pseudonyme, &u.Rank, &u.Email, &u.Password, &u.Biography, &u.Image)
			if err != nil {
				log.Panic(err)
			}
			global.AllUsers = append(global.AllUsers, u)
			// } else if data == "PostComments" {
			// 	var pc PostComments
			// 	err := rows.Scan(&pc.CommentID, &pc.Content, &pc.SenderID, &pc.PostID, &pc.Likes, &pc.Date)
			// 	if err != nil {
			// 		log.Panic(err)
			// 	}
			// 	global.AllPostsComments = append(global.AllPostsComments, pc)
			// } else if data == "Comments" {
			// 	var c Comments
			// 	err := rows.Scan(&c.CommentID, &c.Content, &c.SenderID, &c.ReceiverID, &c.Likes, &c.Date)
			// 	if err != nil {
			// 		log.Panic(err)
			// 	}
			// 	global.AllComments = append(global.AllComments, c)
		} else if data == "Posts" {
			var p Posts
			err := rows.Scan(&p.PostID, &p.SenderID, &p.ParentID, &p.Title, &p.Content, &p.Likes, &p.Date)
			if err != nil {
				log.Panic(err)
			}
			global.AllPosts = append(global.AllPosts, p)
		}
	}
	return global
}
