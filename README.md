📌 Custom URL Shortener API
A scalable URL shortener built with Node.js, Express, MongoDB, and Redis, featuring Google Authentication, advanced analytics, and performance optimization using caching.

🚀 Features
✔ Shorten URLs with optional custom alias and topic-based grouping.
✔ Google Authentication using Firebase.
✔ Redirect users to the original long URL.
✔ Detailed analytics (total clicks, unique users, OS, device type).
✔ Topic-based analytics for grouped insights.
✔ Caching with Redis for improved performance.
✔ Rate limiting for spam protection.
✔ Dockerized deployment for scalability.

🛠️ Tech Stack
Technology	Purpose
Node.js	Backend server
Express.js	API framework
MongoDB	Database for storing URLs
Redis	Caching layer for optimization
Firebase Authentication	User authentication
React.js	Frontend (for analytics and management)
Docker	Containerized deployment
📜 API Endpoints
🔹 1. Shorten URL

POST /api/shorten
Description: Creates a shortened URL with an optional custom alias and topic.
Headers: { "Authorization": "Bearer <token>" }
Body:

{
  "longUrl": "https://example.com",
  "customAlias": "my-link", 
  "topic": "Tech"
}
Response:

{
  "shortUrl": "http://localhost:5000/my-link"
}
🔹 2. Redirect to Long URL

GET /:alias
Description: Redirects the user to the original long URL.
Example: Visiting http://localhost:5000/my-link redirects to https://example.com.
🔹 3. Get URL Analytics

GET /api/analytics/:alias
Description: Retrieves analytics for a specific short URL.
Headers: { "Authorization": "Bearer <token>" }
Response:

{
  "totalClicks": 150,
  "uniqueUsers": 120,
  "clicksByDate": [
    { "date": "2025-02-10", "clicks": 30 },
    { "date": "2025-02-11", "clicks": 45 }
  ],
  "osType": [
    { "osName": "Windows", "uniqueClicks": 80, "uniqueUsers": 70 },
    { "osName": "MacOS", "uniqueClicks": 40, "uniqueUsers": 35 }
  ],
  "deviceType": [
    { "deviceName": "Desktop", "uniqueClicks": 100, "uniqueUsers": 90 },
    { "deviceName": "Mobile", "uniqueClicks": 50, "uniqueUsers": 45 }
  ]
}
🔹 4. Get Topic-Based Analytics

GET /api/analytics/topic/:topic
Description: Retrieves analytics for all URLs under a specific topic.
Headers: { "Authorization": "Bearer <token>" }
Response:

{
  "totalClicks": 300,
  "uniqueUsers": 250,
  "clicksByDate": [
    { "date": "2025-02-10", "clicks": 100 },
    { "date": "2025-02-11", "clicks": 200 }
  ],
  "urls": [
    { "shortUrl": "http://localhost:5000/tech-news", "totalClicks": 150, "uniqueUsers": 120 },
    { "shortUrl": "http://localhost:5000/ai-guide", "totalClicks": 80, "uniqueUsers": 60 }
  ]
}
🔹 5. User Authentication (Google OAuth)

POST /api/auth/google
Description: Authenticates a user via Google Sign-In.
Response:

{
  "user": { "name": "John Doe", "email": "john@example.com" },
  "token": "JWT_TOKEN_HERE"
}
⚡ Performance Optimization
✔ Redis Caching:

Stores short-to-long URL mappings for fast redirects.
Caches analytics data to reduce database load.
✔ Rate Limiting:

Prevents spam attacks and API abuse.
✔ Docker Support:

Deploy using containers for scalability.
🛠️ Installation & Setup
1️⃣ Clone the Repository

git clone https://github.com/trojan1771/url-shortener.git
cd url-shortener
2️⃣ Install Dependencies

npm install
3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add:


MONGO_URI=mongodb://localhost:27017/shortener
REDIS_HOST=localhost
REDIS_PORT=6379
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
4️⃣ Start Redis
Ensure Redis is running:


redis-server
5️⃣ Start the Server

npm start
Your API will run on http://localhost:5000.

🖥️ Frontend (React)
1️⃣ Install Frontend Dependencies

cd frontend
npm install
2️⃣ Run React Frontend

npm start
This will launch the frontend at http://localhost:3000.

🔹 API Testing with Postman
1️⃣ Sign in with Google to get the auth token.
2️⃣ Use the token in Postman → Authorization → Bearer Token.
3️⃣ Test URL shortening, analytics, and topic-based analytics.

