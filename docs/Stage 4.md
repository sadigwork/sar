تمام 👌 — هذا **ملف تسليم كامل (Handoff Brief)** يمكنك نسخه مباشرة لأي Chat جديد أو أي AI آخر، وسيكون قادر يكمل معك بدون فقدان سياق 👇

---

# 🧠 **PROJECT HANDOFF BRIEF — Professional Registration System**

---

## 1. 📌 **Full Context (What We Are Building)**

نحن نقوم ببناء نظام:

> 🎯 **Professional Registration / Accreditation System**

يسمح للمستخدمين بـ:

- إنشاء حساب
- إنشاء ملف مهني (Profile)
- تقديم طلبات اعتماد (Applications)
- متابعة حالة الطلب عبر Workflow متعدد المراحل
- استقبال إشعارات (Notifications)

---

## 2. 🏗 **Tech Stack**

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind + shadcn/ui

### Backend

- Node.js (Nx Monorepo)
- Prisma ORM
- PostgreSQL

---

## 3. ⚙️ **Architecture Decisions (and WHY)**

### ✅ فصل User عن Profile

```ts
User {
  id
  email
  password
  role
}

Profile {
  id
  userId
  fullNameAr
  phone
  address
}
```

🔹 السبب:

- فصل authentication عن البيانات المهنية
- مرونة في التوسع

---

### ✅ API Response Standardization

كل API يرجع:

```json
{
  "success": true,
  "data": ...
}
```

🔹 السبب:

- توحيد التعامل في frontend
- تقليل الأخطاء

---

### ✅ استخدام Hooks مخصصة

```ts
useProfile();
useApplications();
useNotifications();
```

🔹 السبب:

- فصل منطق البيانات عن UI
- إعادة الاستخدام

---

### ✅ JWT Authentication

- accessToken
- refreshToken

🔹 يتم حفظه في:

- localStorage

---

## 4. ✅ **What Has Been Completed**

### 🔐 Authentication

- Login يعمل ✔
- تم حل مشكلة:
  ❌ invalid login response
  ✅ السبب: اختلاف شكل response

---

### 📊 Dashboard

- يعرض:
  - Profile
  - Applications
  - Notifications

- تم إصلاح:
  ❌ notificationsArray undefined
  ✅ باستخدام notifications مباشرة

---

### 🔗 API Integration

- `/profiles/me` ✔
- `/applications` ✔
- `/notifications` ✔

---

## 5. ❌ **Current Problems (IMPORTANT)**

### 🔴 1. Dashboard يعرض كل التطبيقات (100)

❌ المفروض يعرض تطبيقات المستخدم فقط

📌 السبب:

- API يرجع كل البيانات بدون filter

---

### 🔴 2. Tabs فيها أرقام غلط

```ts
All: 100;
Pending: 100;
Action: 100;
```

❌ السبب:

- استخدام نفس array بدون filter

---

### 🔴 3. Tabs تعرض نتائج خاطئة

مثال:

```ts
Pending tab يعرض approved/rejected ❌
```

---

### 🔴 4. Profile Error

```
Cannot read properties of undefined (reading 'email')
```

📌 السبب:

```ts
profile.user === undefined;
```

---

### 🔴 5. Application Details Page لا يعمل

❌ يستخدم:

```ts
mockApplications;
```

بدلاً من API

📌 لذلك:

- عند الضغط View → يرجع Dashboard

---

## 6. 🚧 **What Needs To Be Done (Next Steps)**

### 🔥 HIGH PRIORITY

#### 1. إصلاح API (IMPORTANT)

Backend يجب يرجع فقط تطبيقات المستخدم:

```ts
where: {
  userId: currentUser.id;
}
```

---

#### 2. إصلاح Dashboard Filters

```ts
const pendingApps = applications.filter(...)
const actionApps = applications.filter(...)
const completedApps = applications.filter(...)
```

---

#### 3. إصلاح Tabs Counters

```ts
All: sortedApplications.length;
Pending: pendingApps.length;
Action: actionApps.length;
Completed: completedApps.length;
```

---

#### 4. إصلاح Profile Safe Access

```ts
email: profile?.user?.email || '';
```

---

#### 5. استبدال mock في صفحة التفاصيل

❌ احذف:

```ts
mockApplications;
```

✅ استخدم:

```ts
GET /applications/:id
```

---

#### 6. حماية الوصول (Security)

تأكد أن:

```ts
application.userId === currentUser.id;
```

---

## 7. 🧾 **Important Implementation Rules**

### ⚠️ قواعد لازم الالتزام بها

- لا تفترض شكل API → اطبعه في console
- استخدم optional chaining دائمًا:

```ts
?.
```

- أي array:

```ts
const safe = data || [];
```

- لا تستخدم mock data في production

---

## 8. 👤 **User Preferences & Style**

### طريقة العمل:

- يفضل الحلول العملية المباشرة
- يرسل كود كامل ويطلب تعديل مباشر
- يعمل step-by-step
- يهتم بالتفاصيل التقنية

### أسلوب التواصل:

- عربي
- واضح ومباشر
- بدون حشو

---

## 9. 🧠 **User Skill Level**

- متوسط إلى متقدم في:
  - React
  - Next.js
  - Prisma

- يفهم Debugging جيدًا
- يبني نظام حقيقي (Production mindset)

---

## 10. 🧩 **Key Technical Notes**

### Dashboard يعتمد على:

```ts
useAuth();
useProfile();
useApplications();
useNotifications();
```

---

### API Response Example:

```json
{
  "success": true,
  "data": {
    "user": {},
    "tokens": {}
  }
}
```

---

### المشكلة الأساسية المتكررة:

❗ mismatch بين:

- Backend response
- Frontend expectations

---

## 11. 🧱 **Current System State**

| الجزء               | الحالة          |
| ------------------- | --------------- |
| Auth                | ✅ يعمل         |
| Dashboard UI        | ✅              |
| Data Accuracy       | ❌              |
| Profile             | ⚠️ partial      |
| Applications        | ⚠️ تحتاج filter |
| Application Details | ❌ mock         |

---

## 12. 🎯 **Immediate Next Task (Recommended)**

ابدأ بهذا الترتيب:

1. ✅ Fix Applications API (filter by user)
2. ✅ Fix Dashboard tabs logic
3. ✅ Fix profile.user undefined
4. ✅ Replace mock in details page with API

---

## 13. 🧾 **Tone & Structure to Continue**

- ردود مباشرة
- حلول بالكود
- شرح بسيط بدون إطالة
- التركيز على Debugging

---

## 14. ⚡ **Extra Notes**

- المشروع داخل Nx Monorepo
- Frontend و Backend مفصولين
- JWT مستخدم
- فيه Workflow system لاحقًا

---

# 🚀 **END OF HANDOFF**

---

لو تحب 👇
أقدر في الرسالة القادمة أعطيك:

✅ كود جاهز لإصلاح Dashboard بالكامل
أو
✅ كود Backend filter الصحيح
أو
✅ تحويل صفحة التفاصيل لـ API حقيقي

قول لي بس: **نبدأ منين؟**
