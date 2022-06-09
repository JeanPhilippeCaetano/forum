package forum

import (
	"encoding/json"
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
}

type PostParams struct {
	PostID int
}

func AddPost(w http.ResponseWriter, r *http.Request, global *Global) {
	var Post NewPostParams
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Post)
	result, _ := InsertData(Posts{}, global.Db, "posts", "pseudo", "0", Post.Title, Post.Content, Post.Tags, "0", time.Now().Format("2006.01.02 15:04:05"))
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
	body, _ := json.MarshalIndent(global.AllUsers, "", "")
	w.Write(body)
}
