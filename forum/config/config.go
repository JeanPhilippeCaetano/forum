package config

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

type Config struct {
	GoogleLoginConfig   oauth2.Config
	FacebookLoginConfig oauth2.Config
	// GithubLoginConfig   oauth2.Config
}

var AppConfig Config

const OauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="
const OauthFacebookUrlAPI = "https://graph.facebook.com/v13.0/me?fields=id,name,email,picture&access_token&access_token="

// const OauthGithubUrlAPI = "https://github.com/login/oauth/"

func LoadConfig() {
	// Oauth configuration for Google
	AppConfig.GoogleLoginConfig = oauth2.Config{
		ClientID:     "1031461366637-ph4b9qs44jg7b7avud5iel3djvld8i84.apps.googleusercontent.com",
		ClientSecret: "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",
		Endpoint:     google.Endpoint,
		RedirectURL:  "http://localhost:8080/google_callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
	}

	// Oauth configuration for Facebook
	AppConfig.FacebookLoginConfig = oauth2.Config{
		ClientID:     "700053751053139",
		ClientSecret: "3844f58dda99c9baee007ba585c36084",
		Endpoint:     facebook.Endpoint,
		RedirectURL:  "http://localhost:8080/fb_callback",
		Scopes: []string{
			"email",
			"public_profile",
		},
	}

	// // Oauth configuration for Github
	// AppConfig.GithubLoginConfig = oauth2.Config{
	// 	ClientID:     "653e7a69f14274004377",
	// 	ClientSecret: "fa226b5a2fa95fffeb48bc1a84f624e155c660f3",
	// 	Endpoint:     github.Endpoint,
	// 	RedirectURL:  "http://localhost:8080/github_callback",
	// 	Scopes: []string{
	// 		"email",
	// 		"public_profile",
	// 	},
	// }

}
