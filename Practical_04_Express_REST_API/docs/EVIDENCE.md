# Lab Evidence & Screenshot Guide: Practical 4

**Student Name:** Abdulkadir Nursumar  
**Practical:** Practical 4 — Building a RESTful API with Node.js and Express  

Capture the following genuine screenshots from your local environment for your practical submission:

### Required Screenshots
1. **`01_server_startup_log.png`**:
   - Terminal showing `npm start` output with server banner running on `http://localhost:5000`.
2. **`02_post_create_task_postman.png`**:
   - Postman or Thunder Client showing `POST http://localhost:5000/tasks` with JSON payload, returning HTTP `201 Created` and generated UUID.
3. **`03_get_all_tasks_postman.png`**:
   - Postman showing `GET http://localhost:5000/tasks` returning the list of tasks.
4. **`04_reject_missing_content_type.png`**:
   - Postman showing `POST /tasks` without `Content-Type: application/json` returning HTTP `400 Bad Request`.
5. **`05_put_and_delete_tasks.png`**:
   - Postman showing successful update (`PUT /tasks/:id`) and deletion (`DELETE /tasks/:id`).
6. **`06_automated_jest_tests.png`**:
   - Terminal showing all tests passing in `npm test`.
