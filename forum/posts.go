package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type NewPostParams struct {
	ParentID int
	Title    string
	Content  string
	Tags     string
	Likes    int
}

type ModifyPostParams struct {
	PostID   int
	SenderID int
	Title    string
	Content  string
	Tags     string
	Likes    int
}

type ModifyCommentParams struct {
	Id      int
	Content string
}

type PostParams struct {
	Postid int `json:"postid"`
}

func AddPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	session, _ := store.Get(r, "cookie-name")
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, `{"err":"Il faut être connecté pour faire cela !"}`, http.StatusForbidden)
		return
	}
	user, _ := GetUser(global.Db, "users", session.Values["username"].(string))
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, err := InsertData(Posts{}, global.Db, "posts", user.UserID, nil, Post.Title, Post.Content, Post.Tags, 0, time.Now().Format("02-Jan-2006 15:04:05"))
	if err != nil {
		http.Error(w, `{"err":"`+err.Error()+"\"}", http.StatusBadRequest)
		return
	}
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func AddCom(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	session, _ := store.Get(r, "cookie-name")
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, `{"err":"Il faut être connecté pour faire cela !"}`, http.StatusForbidden)
		return
	}
	user, _ := GetUser(global.Db, "users", session.Values["username"].(string))
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, err := InsertData(Posts{}, global.Db, "posts", user.UserID, Post.ParentID, Post.Title, Post.Content, Post.Tags, 0, time.Now().Format("02-Jan-2006 15:04:05"))
	if err != nil {
		http.Error(w, `{"err":"`+err.Error()+"\"}", http.StatusBadRequest)
		return
	}
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func ModifyPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post ModifyPostParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	post := DisplayOnePost(GetDataFromTableWithID(Posts{}, global.Db, "posts", Post.PostID))
	var result sql.Result
	if post.ParentID != 0 {
		result, _ = UpdateData(Posts{}, global.Db, "posts", Post.PostID, post.SenderID, post.ParentID, Post.Title, Post.Content, Post.Tags, Post.Likes, post.Date)
	} else {
		result, _ = UpdateData(Posts{}, global.Db, "posts", Post.PostID, post.SenderID, nil, Post.Title, Post.Content, Post.Tags, Post.Likes, post.Date)
	}
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func EditCom(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post ModifyCommentParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	post := DisplayOnePost(GetDataFromTableWithID(Posts{}, global.Db, "posts", Post.Id))
	result, err := UpdateData(Posts{}, global.Db, "posts", post.PostID, post.SenderID, post.ParentID, post.Title, Post.Content, post.Tags, post.Likes, post.Date)
	fmt.Println(err)
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func DeletePost(w http.ResponseWriter, r *http.Request, global *Global) {
	var PostID PostParams
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &PostID)
	_, err := DeleteData(Posts{}, global.Db, "posts", PostID.Postid)
	fmt.Println(err)
	w.Write([]byte("{\"deleteMsg\": \"Post bien delete !\"}"))
}

func GetPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var PostBody PostParams
	var EmptyPost Posts
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &PostBody)
	post := DisplayOnePost(GetDataFromTableWithID(Posts{}, global.Db, "posts", PostBody.Postid))
	fmt.Println(post)
	if post == EmptyPost {
		http.Error(w, `{"err":"Ce post n'existe pas"}`, http.StatusForbidden)
		return
	}
	body, _ := json.MarshalIndent(post, "", "")
	w.Write(body)
}

func GetPosts(w http.ResponseWriter, r *http.Request, global *Global) {
	posts := GetAllDataFromTable(global.Db, "posts")
	global = DisplayRows(global, posts, Posts{})
	body, _ := json.MarshalIndent(global.AllPosts, "", "")
	w.Write(body)
}
