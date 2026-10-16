# Healthcare Backend

Node.js REST API for managing patients, doctors, and patient–doctor assignments.

**Stack:** Node.js, Express, PostgreSQL (Neon / Cloud / Local), Sequelize ORM, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator`.

---

## Project Structure

```
src/
  config/db.js            Sequelize connection (reads .env, SSL enabled)
  models/                 User, Patient, Doctor, Mapping + associations
  controllers/            Business logic (auth, patient, doctor, mapping)
  routes/                 Endpoints + validation rules
  middleware/             auth (JWT), validate, errorHandler
  utils/asyncHandler.js   Forwards async errors to the error handler
  app.js                  Express app configuration
  server.js               Entry point (connects DB, syncs tables, listens)
```

---

## Setup & Running

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud database like Neon)

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Create a `.env` file in the project root:
```env
PORT=5000
NODE_ENV=development

DB_HOST=ep-twilight-silence-b4g1l3e0-pooler.c-6.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your_password_here

JWT_ACCESS_SECRET=IlIMk0kGp47
JWT_REFRESH_SECRET=TwWPM5EXTz4
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d
```

### 4. Run the server
```bash
npm run dev      # development mode with auto-reload
npm start        # production mode
```
Database tables (`users`, `patients`, `doctors`, `mappings`) are created and synchronized automatically on startup via `sequelize.sync()`.

---

## API Endpoints

### 1. Authentication
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| POST | `/api/auth/register/` | Register user | `name`, `email`, `password` |
| POST | `/api/auth/login/` | User login | `email`, `password` → returns `access` and `refresh` tokens |
| POST | `/api/auth/refresh/` | Refresh JWT | `refresh` token → returns new `access` token |

### 2. Patients (`Authorization: Bearer <access_token>`)
*Users can only access and manage their own patient records.*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/patients/` | Create patient (`name`, `age`, `gender`, `address?`, `medicalHistory?`) |
| GET | `/api/patients/` | List all patients created by the authenticated user |
| GET | `/api/patients/:id/` | Get patient details by ID |
| PUT | `/api/patients/:id/` | Update patient record |
| DELETE | `/api/patients/:id/` | Delete patient record (cascades to mappings) |

### 3. Doctors (`Authorization: Bearer <access_token>`)
*All authenticated users can view doctors; only the doctor's creator can edit or delete.*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/doctors/` | Create doctor (`name`, `specialization`, `email?`, `phone?`, `experienceYears?`) |
| GET | `/api/doctors/` | List all doctors in the system |
| GET | `/api/doctors/:id/` | Get doctor details by ID |
| PUT | `/api/doctors/:id/` | Update doctor (creator only; others get 403) |
| DELETE | `/api/doctors/:id/` | Delete doctor (creator only; others get 403) |

### 4. Mappings (`Authorization: Bearer <access_token>`)
*Assign doctors to patients owned by the authenticated user.*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mappings/` | Assign doctor to patient (`{ "patient": 1, "doctor": 2 }`) |
| GET | `/api/mappings/` | List all mappings for current user's patients |
| GET | `/api/mappings/:patient_id/` | List all doctors assigned to a specific patient |
| DELETE | `/api/mappings/:id/` | Remove an assignment (patient owner only) |

---

## Status Codes

- `200` OK
- `201` Created
- `204` No Content (Deleted)
- `400` Validation Error
- `401` Unauthorized (Invalid or missing JWT token)
- `403` Forbidden (Not permitted to modify resource)
- `404` Not Found
- `409` Conflict (Duplicate record / email already registered)
- `500` Internal Server Error

---

## Testing with Postman & API Verification Evidence

All endpoints have been tested and verified against the live PostgreSQL database.

### 1. Register & Login
- **POST** ``
  ```json
  {
    "name": "Dr. Smith",
    "email": "smith@hospital.org",
    "password": "Password123"
  }
  ```
  **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "Dr. Smith",
      "email": "smith@hospital.org"
    }
  }
  ```

- **POST** `/api/auth/login/`
  ```json
  {
    "email": "smith@hospital.org",
    "password": "Password123"
  }
  ```
  **Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 2. Patient Operations
- Add Header: `Authorization: Bearer <access_token>`
- **POST** `/api/patients/`
  ```json
  {
    "name": "John Doe",
    "age": 42,
    "gender": "male",
    "address": "123 Main St",
    "medicalHistory": "Hypertension"
  }
  ```
  **Response (201 Created):** Returns patient with assigned `id: 1` and `createdBy: 1`.

### 3. Doctor Operations
- **POST** `/api/doctors/`
  ```json
  {
    "name": "Dr. Gregory House",
    "specialization": "Diagnostic Medicine",
    "experienceYears": 15
  }
  ```
  **Response (201 Created):** Returns doctor object with assigned `id: 1`.

### 4. Mapping (Assigning Doctor to Patient)
- **POST** `/api/mappings/`
  ```json
  {
    "patient": 1,
    "doctor": 1
  }
  ```
  **Response (201 Created):**
  ```json
  {
    "id": 1,
    "patientId": 1,
    "doctorId": 1,
    "createdAt": "2026-10-16T13:20:00.000Z"
  }
  ```
- **GET** `/api/mappings/1/`
  **Response (200 OK):** Returns array of doctors assigned to patient 1.
