# Lab Evidence & Screenshot Guide: Practical 5

**Student Name:** Abdulkadir Nursumar  
**Practical:** Practical 5 — MongoDB Integration and Schema Design with Mongoose  

Capture the following genuine screenshots from your local environment for your practical submission:

### Required Screenshots
1. **`01_mongodb_server_connected.png`**:
   - Terminal showing `npm start` with message: `[MongoDB] Connected to database: awdf_tasks_practical5 @ 127.0.0.1:27017`.
2. **`02_post_create_task_mongodb.png`**:
   - Postman showing `POST http://localhost:5000/tasks` returning `201 Created` with a 24-character hexadecimal MongoDB `_id`.
3. **`03_mongodb_compass_or_shell.png`**:
   - MongoDB Compass (or mongosh) displaying the newly inserted document inside the `tasks` collection of `awdf_tasks_practical5`.
4. **`04_schema_validation_error.png`**:
   - Postman showing `POST /tasks` without `title`, returning `400 Bad Request` with structured JSON validation error.
5. **`05_invalid_objectid_error.png`**:
   - Postman showing `GET /tasks/invalid-id-string` returning `400 Bad Request` from the `validateObjectId` middleware.
6. **`06_automated_jest_tests.png`**:
   - Terminal showing all tests passing against the active database in `npm test`.
