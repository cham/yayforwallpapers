# Routes available

index
-----
- GET "/v1/" - returns 200 and "ok" text - useful for testing or for health checks

users
-----
- POST "/v1/users" - returns 200 and user, 400 and error message, 409 (user already exists) and error message
- POST "/v1/users/login" - returns 200 and user, 400 and error message, 404 (login invalid) and error message
