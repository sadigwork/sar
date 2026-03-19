# 📘 SACRS PRMS – Project Documentation

## 1. Overview

SACRS PRMS (Professional Registration Management System) is a backend system built to manage the registration and certification workflow for agricultural engineers.

---

## 2. Tech Stack

- NestJS (NX Monorepo)
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger API Docs
- Multer File Upload

---

## 3. Project Structure

```
apps/api

libs/
  domain/
    auth/
    users/
    profile/
    applications/
    documents/

  infrastructure/
    prisma/
    upload/
```

---

## 4. Authentication

### Features

- JWT Access Token
- Refresh Token
- Cookie-based auth

### Endpoints

- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

---

## 5. Roles

- USER
- ADMIN
- REVIEWER
- REGISTRAR
- ACCOUNTANT

---

## 6. Profile Module

### Features

- Create Profile
- Update Profile
- Add Education
- Add Experience

### Intelligence

- Total Experience Calculation
- User Level Classification
- Profile Completion Percentage

---

## 7. Documents Module

### Features

- Upload Documents
- Link to Profile / Application
- Validation by Type
- Admin Review Workflow

### Document Types

- DEGREE
- LICENSE
- NATIONAL_ID
- PHOTO

### Document Status

- PENDING
- APPROVED
- REJECTED

---

## 8. File Upload

- Stored in /uploads/documents
- Max size: 5MB
- Allowed: PDF, JPG, PNG

---

## 9. Dashboard (Partial)

- Profile stats
- Experience aggregation
- User level stats

---

## 10. Known Issues (Resolved)

- Prisma enum errors → fixed by using enums
- DTO validation errors → fixed with proper decorators
- Date validation issues → fixed using class-transformer
- NX casing issues → fixed by consistent naming

---

## 11. Roadmap

### High Priority

- Applications Module
- Admin Review System
- Advanced Dashboard

### Future Enhancements

- Cloud Storage (S3)
- OCR for documents
- Notifications system

---

## 12. Current Status

- Auth: ✅
- Users: ✅
- Profile: ✅
- Experience: ✅
- Documents: ✅
- Applications: 🚧
- Dashboard: 🚧

---

## 13. Next Steps

1. Build Applications Module
2. Implement Admin Dashboard
3. Add Charts and Analytics
4. Upgrade File Storage

---

## 14. Engineering Notes

- Always use Prisma enums
- Use DTO validation strictly
- Maintain consistent naming
- Avoid multiple Prisma instances

---

## 📌 End of Documentation
