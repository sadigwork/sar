# 🧠 SACRS PRMS – System Context & Progress Summary

## 📌 1. نظرة عامة على المشروع

هذا المشروع هو:

**Professional Registration Management System (PRMS)**
لنقابة/هيئة المهندسين الزراعيين

### 🎯 الهدف

إدارة:

- تسجيل المهندسين
- التقديم للحصول على ترخيص
- مراجعة الطلبات
- إدارة المستندات
- إصدار القرارات

---

## 🏗️ 2. Architecture

### Backend Stack

- **Framework:** NestJS (Monorepo باستخدام NX)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + Refresh Tokens + Cookies
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger
- **File Upload:** Multer (Local حاليا)

---

### 📁 Project Structure (مختصر)

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

## 👤 3. User & Roles System

### Roles (Enum في Prisma)

- USER
- ADMIN
- REVIEWER
- REGISTRAR
- ACCOUNTANT

---

### 🧩 نظام التسجيل

#### ✅ Public Register

- endpoint: `/auth/register`
- role ثابت: `USER`

#### ✅ Admin Register

- endpoint: `/auth/create-user`
- يمكن تحديد role
- محمي بـ:
  - JwtAuthGuard
  - RolesGuard

---

## 🛠️ 4. المشاكل التي تم حلها

### ❌ مشكلة Role في Prisma

```
Invalid value for argument `role`. Expected Role
```

### ✅ الحل

- منع تمرير string
- استخدام enum:

```ts
role: Role.USER;
```

---

### ❌ مشكلة Validation "property should not exist"

### السبب:

`whitelist + forbidNonWhitelisted`

### الحل:

- تعريف DTO بشكل صحيح
- التأكد من import الصحيح

---

### ❌ مشكلة Date Validation

```
must be a valid ISO 8601 date
```

### الحل النهائي:

```ts
@IsDate()
@Type(() => Date)
startDate: Date;
```

---

### ❌ مشكلة Prisma prepared statement

```
prepared statement already exists
```

### الحل:

- singleton PrismaService
- عدم إنشاء instance جديد

---

### ❌ مشكلة NX casing warning

```
Documents.service.ts vs documents.service.ts
```

### الحل:

- توحيد naming (lowercase)
- `nx reset`

---

## 👤 5. Profile Module

### Features

- إنشاء Profile
- تحديث Profile
- إضافة:
  - Education
  - Experience

- حساب:
  - Profile Completion %
  - Total Experience
  - User Level

---

### 🧠 Profile Intelligence

#### ✅ Total Experience

- حساب بالأشهر
- تحويل إلى سنوات

#### ✅ User Classification

```ts
Junior < 2;
Mid - Level < 5;
Senior < 10;
Expert >= 10;
```

#### ✅ Profile Completion

- Personal Info = 40%
- Education = 20%
- Experience = 20%
- Documents = 20%

---

## 📄 6. Documents Module (🔥 جديد)

### 🎯 الهدف

- رفع المستندات
- ربطها بـ:
  - User
  - Profile
  - Application

- مراجعتها (Workflow)

---

### 🧾 Prisma Model

- Document
- DocumentType
- DocumentStatus

---

### 📦 Features

#### ✅ Upload Document

- باستخدام Multer
- تخزين محلي `/uploads/documents`

#### ✅ Validation حسب النوع

| Type        | Validation |
| ----------- | ---------- |
| PHOTO       | image      |
| DEGREE      | PDF        |
| LICENSE     | PDF        |
| NATIONAL_ID | image      |

---

#### ✅ منع التكرار

- NATIONAL_ID لا يمكن رفعه مرتين

---

#### ✅ Document Status

- PENDING
- APPROVED
- REJECTED

---

#### ✅ Admin Review

- approve / reject

---

### 🔗 API Endpoints

```
POST   /documents        (upload)
GET    /documents/me     (my documents)
DELETE /documents/:id
POST   /documents/:id/review
```

---

## 📂 7. File Upload System

### Multer Config

- max size: 5MB
- allowed:
  - pdf
  - jpg/png

---

### Static Files

```ts
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/',
});
```

---

## 🔐 8. Authentication System

### Features

- JWT Access Token
- Refresh Token
- Cookies (httpOnly)

---

### Flow

1. Register
2. Login
3. Generate tokens
4. Store hashed refresh token
5. Refresh endpoint
6. Logout

---

## 📊 9. Dashboard (جزئي)

تم بناء:

### Backend APIs

- Profile stats
- User levels stats
- Experience aggregation

---

## 🚧 10. ما لم يكتمل بعد

### 🔴 High Priority

#### 1. Applications Module

- إنشاء طلب
- ربط المستندات
- حالات الطلب

---

#### 2. Admin Review System (Full)

- مراجعة Profiles
- مراجعة Applications
- مراجعة Documents

---

#### 3. Dashboard API (Advanced)

- charts:
  - registrations per month
  - approval rate
  - user levels

---

#### 4. File Storage Upgrade

- الانتقال إلى:
  - AWS S3 أو Cloudinary

---

#### 5. Document Enhancements

- reviewNotes
- reviewedBy
- reviewedAt

---

## 🚀 11. الخطوات القادمة المقترحة

### 🔥 الترتيب المثالي

1. Applications Module (الأهم)
2. Admin Dashboard (Review workflow)
3. Advanced Dashboard Charts
4. Cloud Storage
5. Notifications System

---

## 🧠 12. ملاحظات هندسية مهمة

- استخدم Enums دائماً مع Prisma
- لا تمرر string للـ enums
- احرص على DTO validation
- تجنب multiple Prisma instances
- التزم naming consistency

---

## ✅ الحالة الحالية

✔ Auth يعمل
✔ Users يعمل
✔ Profile يعمل
✔ Experience يعمل
✔ Documents يعمل
✔ Upload يعمل

🚧 Applications (قادم)
🚧 Dashboard (تطوير)

---

# 🎯 خلاصة

المشروع الآن في مرحلة:

👉 **Mid-Level Backend System جاهز للتوسع إلى Enterprise**

---

# 🧭 المطلوب من المحادثة القادمة

ابدأ بـ:

👉 "نريد بناء Applications Module بشكل احترافي مرتبط بـ Profile و Documents"

أو:

👉 "نريد بناء Admin Dashboard كامل (Review + Charts)"

---

---
