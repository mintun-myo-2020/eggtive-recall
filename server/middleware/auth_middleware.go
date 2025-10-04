package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
	"google.golang.org/api/option"
)

func AuthMiddleware() gin.HandlerFunc {
	path := storage.AuthPath
	app, err := initalizeFirebaseApp(path)
	if err != nil {
		log.Fatal(err)
	}

	return func(c *gin.Context) {
		authToken := c.GetHeader("Authorization")

		// 1. AUTHENTICATION: Verify JWT token
		authClient, err := app.Auth(context.Background())
		if err != nil {
			log.Println("Failed to init Firebase Auth", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		token, err := authClient.VerifyIDToken(context.Background(), authToken)
		if err != nil {
			log.Println("Failed to verify ID Token", err)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// 2. AUTHORIZATION: Check user can access requested resources
		if !isAuthorizedForResource(c, token.UID) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: cannot access other user's resources"})
			c.Abort()
			return
		}

		// Store user info for controllers
		c.Set("user", token)
		c.Set("authenticatedUserId", token.UID)
		c.Next()
	}
}

// isAuthorizedForResource checks if user can access the requested resource
func isAuthorizedForResource(c *gin.Context, authenticatedUserId string) bool {
	// Check userId from URL parameter
	userIdFromPath := c.Param("userId")
	if userIdFromPath != "" && authenticatedUserId != userIdFromPath {
		return false
	}

	// Check userId from query parameter
	userIdFromQuery := c.Query("userId")
	if userIdFromQuery != "" && authenticatedUserId != userIdFromQuery {
		return false
	}

	// Check userId from request body for POST/PUT requests
	if c.Request.Method == "POST" || c.Request.Method == "PUT" {
		var requestBody map[string]interface{}
		if err := c.ShouldBindJSON(&requestBody); err == nil {
			if userId, exists := requestBody["userId"]; exists {
				if userIdStr, ok := userId.(string); ok && userIdStr != authenticatedUserId {
					return false
				}
			}
			// Re-bind the body for the controller to use
			c.Set("requestBody", requestBody)
		}
	}

	return true
}

func initalizeFirebaseApp(serviceAccountKeyPath string) (*firebase.App, error) {

	opt := getCredentialsOptions(serviceAccountKeyPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	return app, nil

}

func getCredentialsOptions(path string) option.ClientOption {
	environment := os.Getenv("ENVIRONMENT")
	var opt option.ClientOption
	if environment != "production" {
		opt = option.WithCredentialsFile(path)
	} else {
		credentials := map[string]interface{}{
			"type":                        os.Getenv("TYPE"),
			"project_id":                  os.Getenv("PROJECT_ID"),
			"private_key_id":              os.Getenv("PRIVATE_KEY_ID"),
			"private_key":                 os.Getenv("PRIVATE_KEY"),
			"client_email":                os.Getenv("CLIENT_EMAIL"),
			"client_id":                   os.Getenv("CLIENT_ID"),
			"auth_uri":                    os.Getenv("AUTH_URI"),
			"token_uri":                   os.Getenv("TOKEN_URI"),
			"auth_provider_x509_cert_url": os.Getenv("AUTH_PROVIDER_X509_CERT_URL"),
			"client_x509_cert_url":        os.Getenv("CLIENT_X509_CERT_URL"),
		}

		jsonData, err := json.Marshal(credentials)
		if err != nil {
			log.Println("Error:", err)
		}

		opt = option.WithCredentialsJSON(json.RawMessage(jsonData))

	}

	return opt

}
