# Learning Game Backend

REST API for a nursery-to-class-4 Android learning game. The frontend loads classes, subjects, and MCQs from MongoDB instead of hardcoding them.

## Setup

1. Install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas).
2. Copy `.env.example` to `.env` and set `MONGODB_URI`.
3. Install and run:

```bash
npm install
npm run seed
npm run dev
```

| Environment | Base URL |
|---|---|
| Local machine / Android studio emulator | `http://10.0.2.2:4000` |
| Physical phone on same Wi-Fi | `http://YOUR_PC_LAN_IP:4000` (example: `http://192.168.1.20:4000`) |
| Browser / Postman on the same PC | `http://localhost:4000` |

API prefix: `/api/v1`

After seed, the database has 6 grades, 18 subjects, and 36 sample MCQs.

---

## Frontend guide

### Recommended game flow

1. Call **List grades** and show class cards (Nursery → Class 4).
2. On class tap, call **Subjects by grade** and show subject cards (English, Maths, EVS).
3. On subject tap, call **Start quiz** with `grade` + `subject` + `count`.
4. Render each question. Store `id` and the option the child selected (`a` / `b` / `c` / `d`).
5. After the last question, call **Submit quiz** with those answers.
6. Show `score`, `percentage`, and per-question `explanation`.

Do **not** use `includeAnswer=true` during gameplay. Correct answers are only returned from **Submit quiz**.

### Common rules

- All JSON. Header for POST/PATCH: `Content-Type: application/json`
- Success bodies include `"success": true`
- Error bodies look like:

```json
{
  "success": false,
  "message": "Grade not found"
}
```

| HTTP status | When |
|---|---|
| 200 | GET / PATCH / DELETE success |
| 201 | POST create success |
| 400 | Missing/invalid body or query |
| 401 | Admin route without a valid `x-admin-key` |
| 404 | Id/code not found, or unknown URL |
| 500 | Server / database error |

**Grade codes** (use these strings, not display names):

`nursery` · `kg` · `class-1` · `class-2` · `class-3` · `class-4`

**Subject codes** (unique together with a grade): `english` · `maths` · `evs`

**Option ids** in seed data: `"a"`, `"b"`, `"c"`, `"d"`

Admin write APIs need this header (value from `.env` `ADMIN_API_KEY`):

```http
x-admin-key: change-me-admin-key
```

Game screens do not need that header.

---

## Endpoint index

### Public (game / frontend)

| Method | Path | Auth |
|---|---|---|
| GET | `/health` | No |
| GET | `/api/v1` | No |
| GET | `/api/v1/grades` | No |
| GET | `/api/v1/grades/:gradeCode` | No |
| GET | `/api/v1/grades/:gradeCode/subjects` | No |
| GET | `/api/v1/subjects` | No |
| GET | `/api/v1/subjects/:subjectId` | No |
| GET | `/api/v1/questions` | No |
| GET | `/api/v1/questions/:questionId` | No |
| GET | `/api/v1/quiz` | No |
| POST | `/api/v1/quiz/submit` | No |

### Admin (content team / CMS)

| Method | Path | Auth |
|---|---|---|
| POST | `/api/v1/grades` | `x-admin-key` |
| PATCH | `/api/v1/grades/:gradeCode` | `x-admin-key` |
| POST | `/api/v1/subjects` | `x-admin-key` |
| PATCH | `/api/v1/subjects/:subjectId` | `x-admin-key` |
| POST | `/api/v1/questions` | `x-admin-key` |
| PATCH | `/api/v1/questions/:questionId` | `x-admin-key` |
| DELETE | `/api/v1/questions/:questionId` | `x-admin-key` |

---

## 1. Health check

Use this to confirm the server is up before the splash screen continues.

```http
GET /health
```

```bash
curl http://localhost:4000/health
```

**200 response**

```json
{
  "success": true,
  "status": "ok"
}
```

---

## 2. API map

```http
GET /api/v1
```

```bash
curl http://localhost:4000/api/v1
```

**200 response**

```json
{
  "success": true,
  "name": "Learning Game API",
  "version": "1.0.0",
  "endpoints": {
    "grades": "GET /api/v1/grades",
    "subjectsByGrade": "GET /api/v1/grades/:gradeCode/subjects",
    "questions": "GET /api/v1/questions?grade=class-1&subject=maths&limit=10&shuffle=true",
    "startQuiz": "GET /api/v1/quiz?grade=class-1&subject=maths&count=10",
    "submitQuiz": "POST /api/v1/quiz/submit"
  }
}
```

---

## 3. List grades

Home screen: load all active classes, sorted by `order`.

```http
GET /api/v1/grades
```

```bash
curl http://localhost:4000/api/v1/grades
```

**200 response**

```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "671a0b12c8f1a2b3c4d5e601",
      "code": "nursery",
      "name": "Nursery",
      "order": 1,
      "ageRange": "3-4 years",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    },
    {
      "_id": "671a0b12c8f1a2b3c4d5e602",
      "code": "kg",
      "name": "Kindergarten",
      "order": 2,
      "ageRange": "4-5 years",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    },
    {
      "_id": "671a0b12c8f1a2b3c4d5e603",
      "code": "class-1",
      "name": "Class 1",
      "order": 3,
      "ageRange": "6-7 years",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    }
  ]
}
```

Frontend should bind the card title to `name` and keep `code` for the next API call (`nursery`, `class-1`, …).

---

## 4. Get one grade

```http
GET /api/v1/grades/:gradeCode
```

```bash
curl http://localhost:4000/api/v1/grades/class-1
```

**200 response**

```json
{
  "success": true,
  "data": {
    "_id": "671a0b12c8f1a2b3c4d5e603",
    "code": "class-1",
    "name": "Class 1",
    "order": 3,
    "ageRange": "6-7 years",
    "isActive": true,
    "createdAt": "2026-10-25T13:00:00.000Z",
    "updatedAt": "2026-10-25T13:00:00.000Z"
  }
}
```

**404** if the code is wrong, e.g. `/api/v1/grades/class-9`

```json
{
  "success": false,
  "message": "Grade not found"
}
```

---

## 5. Subjects by grade (preferred for the game)

```http
GET /api/v1/grades/:gradeCode/subjects
```

```bash
curl http://localhost:4000/api/v1/grades/class-1/subjects
```

**200 response**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "671a0c22c8f1a2b3c4d5e701",
      "code": "english",
      "name": "English",
      "grade": "671a0b12c8f1a2b3c4d5e603",
      "gradeCode": "class-1",
      "description": "Reading and grammar basics",
      "icon": "",
      "color": "#42A5F5",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    },
    {
      "_id": "671a0c22c8f1a2b3c4d5e702",
      "code": "evs",
      "name": "EVS",
      "grade": "671a0b12c8f1a2b3c4d5e603",
      "gradeCode": "class-1",
      "description": "Plants, animals and family",
      "icon": "",
      "color": "#FFA726",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    },
    {
      "_id": "671a0c22c8f1a2b3c4d5e703",
      "code": "maths",
      "name": "Maths",
      "grade": "671a0b12c8f1a2b3c4d5e603",
      "gradeCode": "class-1",
      "description": "Addition, subtraction and shapes",
      "icon": "",
      "color": "#66BB6A",
      "isActive": true,
      "createdAt": "2026-10-25T13:00:00.000Z",
      "updatedAt": "2026-10-25T13:00:00.000Z"
    }
  ]
}
```

Use `color` for the subject card, `name` for the label, and `code` (`maths`) plus the grade code (`class-1`) when starting a quiz.

If the grade code does not exist, you still get `200` with `"count": 0` and `"data": []`.

---

## 6. List subjects (query filter)

Same payload as above. Use this if you already have `grade` as a query param.

```http
GET /api/v1/subjects?grade=class-1
```

```bash
curl "http://localhost:4000/api/v1/subjects?grade=class-1"
```

Omit `grade` to list **all** active subjects across every class.

---

## 7. Get one subject

`:subjectId` is the Mongo `_id` from the list response, not `maths`.

```http
GET /api/v1/subjects/:subjectId
```

```bash
curl http://localhost:4000/api/v1/subjects/671a0c22c8f1a2b3c4d5e703
```

**200 response**

```json
{
  "success": true,
  "data": {
    "_id": "671a0c22c8f1a2b3c4d5e703",
    "code": "maths",
    "name": "Maths",
    "grade": "671a0b12c8f1a2b3c4d5e603",
    "gradeCode": "class-1",
    "description": "Addition, subtraction and shapes",
    "icon": "",
    "color": "#66BB6A",
    "isActive": true,
    "createdAt": "2026-10-25T13:00:00.000Z",
    "updatedAt": "2026-10-25T13:00:00.000Z"
  }
}
```

**404**

```json
{
  "success": false,
  "message": "Subject not found"
}
```

---

## 8. List questions (question bank)

Use this for a practice list or admin preview. For a timed game round, prefer **Start quiz**.

```http
GET /api/v1/questions
```

| Query | Default | Notes |
|---|---|---|
| `grade` | — | `class-1`, `nursery`, … |
| `subject` | — | `maths`, `english`, `evs` |
| `topic` | — | e.g. `addition`, `alphabet` |
| `difficulty` | — | `easy`, `medium`, `hard` |
| `language` | — | seed data is `en` |
| `limit` | `20` | max `50` |
| `shuffle` | `false` | `true` = random sample |
| `includeAnswer` | `false` | `true` also returns `correctOptionId` and `explanation` |

```bash
curl "http://localhost:4000/api/v1/questions?grade=class-1&subject=maths&limit=10&shuffle=true"
```

**200 response** (`includeAnswer` omitted / false — safe for gameplay UI)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "671a0d33c8f1a2b3c4d5e801",
      "gradeCode": "class-1",
      "subjectCode": "maths",
      "topic": "addition",
      "questionText": "What is 15 + 4?",
      "questionImageUrl": "",
      "options": [
        { "id": "a", "text": "18", "imageUrl": "" },
        { "id": "b", "text": "19", "imageUrl": "" },
        { "id": "c", "text": "21", "imageUrl": "" },
        { "id": "d", "text": "11", "imageUrl": "" }
      ],
      "difficulty": "easy",
      "marks": 1,
      "language": "en"
    },
    {
      "id": "671a0d33c8f1a2b3c4d5e802",
      "gradeCode": "class-1",
      "subjectCode": "maths",
      "topic": "subtraction",
      "questionText": "What is 10 - 6?",
      "questionImageUrl": "",
      "options": [
        { "id": "a", "text": "2", "imageUrl": "" },
        { "id": "b", "text": "3", "imageUrl": "" },
        { "id": "c", "text": "4", "imageUrl": "" },
        { "id": "d", "text": "5", "imageUrl": "" }
      ],
      "difficulty": "easy",
      "marks": 1,
      "language": "en"
    }
  ]
}
```

Same call with answers (practice / teacher mode only):

```bash
curl "http://localhost:4000/api/v1/questions?grade=class-1&subject=maths&includeAnswer=true"
```

Extra fields on each item:

```json
{
  "correctOptionId": "b",
  "explanation": "15 plus 4 equals 19."
}
```

Bind the option button to `options[].id` (send that later as `selectedOptionId`). Show `options[].text` on the button. If `questionImageUrl` is not empty, load that image above the question.

---

## 9. Get one question

Answers are **not** included.

```http
GET /api/v1/questions/:questionId
```

```bash
curl http://localhost:4000/api/v1/questions/671a0d33c8f1a2b3c4d5e801
```

**200 response**

```json
{
  "success": true,
  "data": {
    "id": "671a0d33c8f1a2b3c4d5e801",
    "gradeCode": "class-1",
    "subjectCode": "maths",
    "topic": "addition",
    "questionText": "What is 15 + 4?",
    "questionImageUrl": "",
    "options": [
      { "id": "a", "text": "18", "imageUrl": "" },
      { "id": "b", "text": "19", "imageUrl": "" },
      { "id": "c", "text": "21", "imageUrl": "" },
      { "id": "d", "text": "11", "imageUrl": "" }
    ],
    "difficulty": "easy",
    "marks": 1,
    "language": "en"
  }
}
```

**404**

```json
{
  "success": false,
  "message": "Question not found"
}
```

---

## 10. Start quiz

Random set of questions for one class + subject. Correct answers are hidden.

```http
GET /api/v1/quiz?grade=class-1&subject=maths&count=10
```

| Query | Required | Default | Notes |
|---|---|---|---|
| `grade` | yes | — | e.g. `class-1` |
| `subject` | yes | — | e.g. `maths` |
| `count` | no | `10` | max `30`. If the bank is smaller, you get fewer questions. |

```bash
curl "http://localhost:4000/api/v1/quiz?grade=class-1&subject=maths&count=2"
```

**200 response**

```json
{
  "success": true,
  "quiz": {
    "grade": "class-1",
    "subject": "maths",
    "questionCount": 2,
    "questions": [
      {
        "id": "671a0d33c8f1a2b3c4d5e801",
        "gradeCode": "class-1",
        "subjectCode": "maths",
        "topic": "addition",
        "questionText": "What is 15 + 4?",
        "questionImageUrl": "",
        "options": [
          { "id": "a", "text": "18", "imageUrl": "" },
          { "id": "b", "text": "19", "imageUrl": "" },
          { "id": "c", "text": "21", "imageUrl": "" },
          { "id": "d", "text": "11", "imageUrl": "" }
        ],
        "difficulty": "easy",
        "marks": 1,
        "language": "en"
      },
      {
        "id": "671a0d33c8f1a2b3c4d5e802",
        "gradeCode": "class-1",
        "subjectCode": "maths",
        "topic": "subtraction",
        "questionText": "What is 10 - 6?",
        "questionImageUrl": "",
        "options": [
          { "id": "a", "text": "2", "imageUrl": "" },
          { "id": "b", "text": "3", "imageUrl": "" },
          { "id": "c", "text": "4", "imageUrl": "" },
          { "id": "d", "text": "5", "imageUrl": "" }
        ],
        "difficulty": "easy",
        "marks": 1,
        "language": "en"
      }
    ]
  }
}
```

Keep each `questions[].id` in memory. That is the `questionId` you send on submit.

**400** if `grade` or `subject` is missing

```json
{
  "success": false,
  "message": "Query params grade and subject are required"
}
```

If the pair has no questions, `questionCount` is `0` and `questions` is `[]`. Show an empty-state, do not call submit.

---

## 11. Submit quiz

Score the round on the server. This is the only gameplay call that reveals answers.

```http
POST /api/v1/quiz/submit
Content-Type: application/json
```

**Request body**

```json
{
  "answers": [
    {
      "questionId": "671a0d33c8f1a2b3c4d5e801",
      "selectedOptionId": "b"
    },
    {
      "questionId": "671a0d33c8f1a2b3c4d5e802",
      "selectedOptionId": "a"
    }
  ]
}
```

```bash
curl -X POST http://localhost:4000/api/v1/quiz/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"answers\":[{\"questionId\":\"671a0d33c8f1a2b3c4d5e801\",\"selectedOptionId\":\"b\"},{\"questionId\":\"671a0d33c8f1a2b3c4d5e802\",\"selectedOptionId\":\"a\"}]}"
```

On macOS/Linux, use `\` instead of `^`.

**200 response** (first answer correct, second wrong)

```json
{
  "success": true,
  "data": {
    "attempted": 2,
    "score": 1,
    "totalMarks": 2,
    "percentage": 50,
    "results": [
      {
        "questionId": "671a0d33c8f1a2b3c4d5e801",
        "selectedOptionId": "b",
        "correctOptionId": "b",
        "correct": true,
        "explanation": "15 plus 4 equals 19.",
        "marksAwarded": 1
      },
      {
        "questionId": "671a0d33c8f1a2b3c4d5e802",
        "selectedOptionId": "a",
        "correctOptionId": "c",
        "correct": false,
        "explanation": "10 minus 6 equals 4.",
        "marksAwarded": 0
      }
    ]
  }
}
```

Result screen mapping:

- Big score: `data.score` / `data.totalMarks`
- Progress: `data.percentage`
- Green/red per row: `results[].correct`
- “Why?” text: `results[].explanation`

**400** if `answers` is missing or empty

```json
{
  "success": false,
  "message": "answers array is required"
}
```

If a `questionId` is invalid, that row looks like:

```json
{
  "questionId": "000000000000000000000000",
  "correct": false,
  "message": "Question not found"
}
```

---

## Admin endpoints

These are for adding classes, subjects, and questions. The Android game does not need them unless you build a teacher/admin screen.

Every example below sends:

```http
x-admin-key: change-me-admin-key
Content-Type: application/json
```

**401** without a valid key

```json
{
  "success": false,
  "message": "Admin API key is required"
}
```

### 12. Create grade

```http
POST /api/v1/grades
```

**Request body**

```json
{
  "code": "class-5",
  "name": "Class 5",
  "order": 7,
  "ageRange": "10-11 years"
}
```

```bash
curl -X POST http://localhost:4000/api/v1/grades ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"code\":\"class-5\",\"name\":\"Class 5\",\"order\":7,\"ageRange\":\"10-11 years\"}"
```

**201 response**

```json
{
  "success": true,
  "data": {
    "code": "class-5",
    "name": "Class 5",
    "order": 7,
    "ageRange": "10-11 years",
    "isActive": true,
    "_id": "671a1111c8f1a2b3c4d5e901",
    "createdAt": "2026-10-25T13:10:00.000Z",
    "updatedAt": "2026-10-25T13:10:00.000Z"
  }
}
```

### 13. Update grade

```http
PATCH /api/v1/grades/:gradeCode
```

**Request body** (send only fields to change)

```json
{
  "name": "Class 1 (CBSE)",
  "ageRange": "6-7 years"
}
```

```bash
curl -X PATCH http://localhost:4000/api/v1/grades/class-1 ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"name\":\"Class 1 (CBSE)\"}"
```

**200 response** — full grade document with the new `name`.

**404** `"Grade not found"`

### 14. Create subject

```http
POST /api/v1/subjects
```

**Request body**

```json
{
  "gradeCode": "class-1",
  "code": "hindi",
  "name": "Hindi",
  "description": "Akshar and simple words",
  "icon": "",
  "color": "#AB47BC"
}
```

```bash
curl -X POST http://localhost:4000/api/v1/subjects ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"gradeCode\":\"class-1\",\"code\":\"hindi\",\"name\":\"Hindi\",\"description\":\"Akshar and simple words\",\"color\":\"#AB47BC\"}"
```

**201 response**

```json
{
  "success": true,
  "data": {
    "code": "hindi",
    "name": "Hindi",
    "grade": "671a0b12c8f1a2b3c4d5e603",
    "gradeCode": "class-1",
    "description": "Akshar and simple words",
    "icon": "",
    "color": "#AB47BC",
    "isActive": true,
    "_id": "671a1222c8f1a2b3c4d5ea01",
    "createdAt": "2026-10-25T13:12:00.000Z",
    "updatedAt": "2026-10-25T13:12:00.000Z"
  }
}
```

`code` + `gradeCode` must be unique (you cannot add two `maths` subjects for `class-1`).

**400** `"Invalid gradeCode"` if that class does not exist.

### 15. Update subject

```http
PATCH /api/v1/subjects/:subjectId
```

**Request body**

```json
{
  "description": "Addition, subtraction, shapes and patterns",
  "color": "#43A047"
}
```

```bash
curl -X PATCH http://localhost:4000/api/v1/subjects/671a0c22c8f1a2b3c4d5e703 ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"color\":\"#43A047\"}"
```

**200** — updated subject document. **404** `"Subject not found"`.

### 16. Create question

```http
POST /api/v1/questions
```

**Request body**

```json
{
  "gradeCode": "class-1",
  "subjectCode": "maths",
  "topic": "addition",
  "questionText": "What is 2 + 2?",
  "questionImageUrl": "",
  "options": [
    { "id": "a", "text": "3", "imageUrl": "" },
    { "id": "b", "text": "4", "imageUrl": "" },
    { "id": "c", "text": "5", "imageUrl": "" },
    { "id": "d", "text": "6", "imageUrl": "" }
  ],
  "correctOptionId": "b",
  "explanation": "2 plus 2 equals 4.",
  "difficulty": "easy",
  "marks": 1,
  "language": "en"
}
```

Required: `gradeCode`, `subjectCode`, `questionText`, `options` (2–6 items), `correctOptionId` (must be one of the option `id`s).

Optional: `topic` (default `general`), `questionImageUrl`, `difficulty` (`easy` | `medium` | `hard`), `marks`, `language`.

```bash
curl -X POST http://localhost:4000/api/v1/questions ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"gradeCode\":\"class-1\",\"subjectCode\":\"maths\",\"topic\":\"addition\",\"questionText\":\"What is 2 + 2?\",\"options\":[{\"id\":\"a\",\"text\":\"3\"},{\"id\":\"b\",\"text\":\"4\"},{\"id\":\"c\",\"text\":\"5\"},{\"id\":\"d\",\"text\":\"6\"}],\"correctOptionId\":\"b\",\"explanation\":\"2 plus 2 equals 4.\",\"difficulty\":\"easy\"}"
```

**201 response** (includes `correctOptionId` because this is an admin create)

```json
{
  "success": true,
  "data": {
    "grade": "671a0b12c8f1a2b3c4d5e603",
    "subject": "671a0c22c8f1a2b3c4d5e703",
    "gradeCode": "class-1",
    "subjectCode": "maths",
    "topic": "addition",
    "questionText": "What is 2 + 2?",
    "questionImageUrl": "",
    "options": [
      { "id": "a", "text": "3", "imageUrl": "" },
      { "id": "b", "text": "4", "imageUrl": "" },
      { "id": "c", "text": "5", "imageUrl": "" },
      { "id": "d", "text": "6", "imageUrl": "" }
    ],
    "correctOptionId": "b",
    "explanation": "2 plus 2 equals 4.",
    "difficulty": "easy",
    "marks": 1,
    "language": "en",
    "isActive": true,
    "_id": "671a1333c8f1a2b3c4d5eb01",
    "createdAt": "2026-10-25T13:15:00.000Z",
    "updatedAt": "2026-10-25T13:15:00.000Z"
  }
}
```

**400** examples

```json
{ "success": false, "message": "Invalid gradeCode or subjectCode" }
```

```json
{ "success": false, "message": "correctOptionId must match one of the option ids" }
```

### 17. Update question

```http
PATCH /api/v1/questions/:questionId
```

**Request body** (partial)

```json
{
  "difficulty": "medium",
  "explanation": "Add the ones: 2 + 2 = 4."
}
```

```bash
curl -X PATCH http://localhost:4000/api/v1/questions/671a1333c8f1a2b3c4d5eb01 ^
  -H "Content-Type: application/json" ^
  -H "x-admin-key: change-me-admin-key" ^
  -d "{\"difficulty\":\"medium\"}"
```

**200** — full question document. **404** `"Question not found"`.

### 18. Delete question (soft delete)

Sets `isActive` to `false`. The question disappears from list/quiz/get.

```http
DELETE /api/v1/questions/:questionId
```

No body.

```bash
curl -X DELETE http://localhost:4000/api/v1/questions/671a1333c8f1a2b3c4d5eb01 ^
  -H "x-admin-key: change-me-admin-key"
```

**200 response**

```json
{
  "success": true,
  "message": "Question deactivated"
}
```

**404** `"Question not found"`

---

## Unknown URL

```http
GET /api/v1/does-not-exist
```

**404**

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

## Android notes

Ids in list/quiz questions are `id`. Ids on grade/subject documents and on admin create responses are `_id`. When submitting a quiz, send the question `id` as `questionId`.

Cleartext HTTP: for a local IP, allow HTTP in the app (`android:usesCleartextTraffic="true"` or a network-security-config). Prefer HTTPS once the API is deployed.

Ids in these docs (`671a0b12…`) are **examples**. After you run `npm run seed`, copy real `_id` / `id` values from `GET /api/v1/grades` and `GET /api/v1/quiz?...`.
