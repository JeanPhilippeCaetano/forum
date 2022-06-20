package forum

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type NewReportParams struct {
	ParentID int
	PostID   int
	Title    string
	Content  string
}

type ReportParam struct {
	Reportid int `json:"postid"`
}

func AddReport(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	session, _ := store.Get(r, "cookie-name")
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, `{"err":"Il faut être connecté pour faire cela !"}`, http.StatusForbidden)
		return
	}
	user, _ := GetUser(global.Db, "users", session.Values["username"].(string))
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, err := InsertData(Posts{}, global.Db, "posts", user.UserID, nil, Post.Title, Post.Content, Post.Tags, 0, time.Now().Format("2006.01.02 15:04:05"))
	if err != nil {
		http.Error(w, `{"err":"`+err.Error()+"\"}", http.StatusBadRequest)
		return
	}
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func AddAnswer(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	session, _ := store.Get(r, "cookie-name")
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, `{"err":"Il faut être connecté pour faire cela !"}`, http.StatusForbidden)
		return
	}
	user, _ := GetUser(global.Db, "users", session.Values["username"].(string))
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, err := InsertData(Posts{}, global.Db, "posts", user.UserID, Post.ParentID, Post.Title, Post.Content, Post.Tags, 0, time.Now().Format("2006.01.02 15:04:05"))
	if err != nil {
		http.Error(w, `{"err":"`+err.Error()+"\"}", http.StatusBadRequest)
		return
	}
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func GetReport(w http.ResponseWriter, r *http.Request, global *Global) {
	var ReportBody ReportParam
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &ReportBody)
	report := DisplayOnePost(GetDataFromTableWithID(Reports{}, global.Db, "reports", ReportBody.Reportid))
	body, _ := json.MarshalIndent(report, "", "")
	w.Write(body)
}

func GetReports(w http.ResponseWriter, r *http.Request, global *Global) {
	reports := GetAllDataFromTable(global.Db, "reports")
	global = DisplayRows(global, reports, Reports{})
	body, _ := json.MarshalIndent(global.AllReports, "", "")
	w.Write(body)
}
