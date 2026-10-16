# Lab Evidence & Screenshot Guide: Practical 7

**Student Name:** Abdulkadir Nursumar  
**Practical:** Practical 7 — Authentication and Middleware Pipeline  

Capture the following genuine screenshots from your local environment for your practical submission:

### Required Screenshots
1. **`01_user_registration_postman.png`**:
   - Postman showing `POST /api/auth/register` with valid email and password, returning HTTP `201 Created` with a JWT token and user profile without password.
2. **`02_mongodb_hashed_password.png`**:
   - MongoDB Compass (or mongosh) showing the `users` collection with the password stored as a bcrypt hash starting with `$2a$10$`.
3. **`03_jwt_login_success.png`**:
   - Postman showing `POST /api/auth/login` returning HTTP `200 OK` and a new JWT token.
4. **`04_protected_tasks_bearer_token.png`**:
   - Postman showing `GET /api/tasks` with `Authorization: Bearer <token>` returning the user's isolated tasks.
5. **`05_401_missing_or_invalid_token.png`**:
   - Postman showing `GET /api/tasks` without header returning HTTP `401 Unauthorized`.
6. **`06_auth_test_suite_passing.png`**:
   - Terminal showing all tests passing in `npm test` inside `backend/`.
