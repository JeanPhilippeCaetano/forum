package forum

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type NewPostParams struct {
	Title   string
	Content string
	Tags    string
}

type ModifyPostParams struct {
	PostID  int
	Title   string
	Content string
	Tags    string
	Likes   int
}

type PostParams struct {
	PostID int
}

func AddPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	session, _ := store.Get(r, "cookie-name")
	fmt.Println(session.Values["authenticated"])
	if auth := session.Values["authenticated"].(bool); !auth {
		http.Error(w, `{"err":"Il faut être connecté pour faire cela !"}`, http.StatusForbidden)
		return
	}
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, err := InsertData(Posts{}, global.Db, "posts", 1, nil, Post.Title, Post.Content, Post.Tags, 0, time.Now().Format("2006.01.02 15:04:05"))
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
	result, _ := UpdateData(Posts{}, global.Db, "posts", Post.PostID, strconv.Itoa(post.ParentID), Post.Title, Post.Content, Post.Tags, strconv.Itoa(post.Likes), post.Date)
	postId, _ := result.LastInsertId()
	w.Write([]byte("{\"postID\": \"" + strconv.FormatInt(postId, 10) + "\"}"))
}

func GetPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var PostBody PostParams
	bd, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(bd, &PostBody)
	post := GetDataFromTableWithID(Posts{}, global.Db, "posts", PostBody.PostID)
	body, _ := json.MarshalIndent(post, "", "")
	w.Write(body)
}

func GetPosts(w http.ResponseWriter, r *http.Request, global *Global) {
	posts := GetAllDataFromTable(global.Db, "posts")
	global = DisplayRows(global, posts, Posts{})
	body, _ := json.MarshalIndent(global.AllPosts, "", "")
	w.Write(body)
}
