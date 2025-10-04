package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Check if origin is allowed
		if isAllowedOrigin(origin) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400") // 24 hours

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		// Block requests from non-allowed origins
		if !isAllowedOrigin(origin) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "CORS: Origin not allowed",
			})
			return
		}

		c.Next()
	}
}

// isAllowedOrigin checks if the origin is from an allowed domain
func isAllowedOrigin(origin string) bool {
	if origin == "" {
		return false
	}

	// Convert to lowercase for case-insensitive comparison
	origin = strings.ToLower(origin)

	// Allow localhost for development
	if strings.HasPrefix(origin, "http://localhost:") ||
		strings.HasPrefix(origin, "https://localhost:") ||
		strings.HasPrefix(origin, "http://127.0.0.1:") ||
		strings.HasPrefix(origin, "https://127.0.0.1:") {
		return true
	}

	// Allow eggtive.com and all its subdomains
	if strings.HasSuffix(origin, ".eggtive.com") ||
		origin == "https://eggtive.com" ||
		origin == "http://eggtive.com" {
		return true
	}

	return false
}
