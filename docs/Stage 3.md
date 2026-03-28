# 🧠 PROJECT CONTEXT BRIEFING — PRMS SYSTEM (JWT MIGRATION + AUTO REFRESH)

---

## 1️⃣ FULL CONTEXT

We are building a **Professional Registration Management System (PRMS)** for agricultural engineers.

### Tech Stack:

- **Frontend:** Next.js (App Router) + SWR + Axios
- **Backend:** NestJS (Modular Architecture)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Auth (Current Focus):** JWT-based authentication (migrating from cookies)

---

## 2️⃣ DECISIONS MADE (AND WHY)

### ❌ Removed Cookie-Based Auth

- Previously used cookies (similar to Sanctum / session)
- Caused mismatch with frontend using Bearer tokens
- Resulted in `401 Unauthorized`

### ✅ Switched to JWT بالكامل

Reasons:

- Stateless (أفضل للـ scaling)
- مناسب للأنظمة الحكومية والمؤسسية
- يعمل بسلاسة مع Next.js API & external services

---

### ✅ Adopted Dual Token Strategy

- `accessToken` (15 min)
- `refreshToken` (7 days)

Reason:

- Security + UX balance

---

### ✅ Implemented Auto Refresh Flow

- Using Axios Interceptors
- Transparent to user (no forced logout)

---

## 3️⃣ CURRENT STATUS

### ✅ Backend (NestJS)

✔ JwtStrategy working:

- Uses `Bearer Token`
- Reads from `Authorization header`

✔ AuthService:

- Login returns:
  - accessToken
  - refreshToken

- Refresh endpoint works with body (NOT cookies)
- Tokens signed with:
  - JWT_SECRET
  - JWT_REFRESH_SECRET

✔ Guards:

- JwtAuthGuard applied
- RolesGuard working

✔ Cookies:

- ❌ Completely removed

---

### ✅ Frontend (Next.js)

✔ Token Storage:

- localStorage used

✔ Axios Interceptor:

- Adds Bearer token automatically
- Handles 401
- Refreshes token automatically
- Retries failed requests

✔ SWR:

- Uses global fetcher (no manual token passing)

---

## 4️⃣ WHAT IS WORKING

- ✅ Login flow
- ✅ Protected endpoints (Bearer)
- ✅ Profile fetch
- ✅ Auto refresh token
- ✅ Retry failed requests
- ✅ Logout on invalid refresh

---

## 5️⃣ WHAT STILL NEEDS TO BE DONE

### 🔥 HIGH PRIORITY

1. **Route Protection (Frontend)**
   - Middleware (Next.js)
   - Redirect if no token

2. **Auth Context / State Management**
   - Use Zustand or React Context
   - Store user globally

3. **Better Error Handling UI**
   - Show session expired
   - Handle refresh failures gracefully

---

### 🔐 SECURITY IMPROVEMENTS (IMPORTANT)

4. Move refreshToken to:
   - httpOnly cookie (recommended)

5. Implement:
   - Refresh Token Rotation
   - Token Blacklisting (on logout)

6. Add:
   - Rate limiting on `/auth/refresh`

---

### 🏗️ ARCHITECTURE IMPROVEMENTS

7. Separate Auth Module cleanly:
   - strategies/
   - guards/
   - decorators/

8. Add RBAC expansion:
   - Permissions (not just roles)

---

## 6️⃣ NEXT STEPS (ORDERED PLAN)

1. Add Next.js middleware for route protection
2. Create AuthProvider (global auth state)
3. Improve interceptor with better UX handling
4. Secure refresh token storage
5. Add RBAC permissions layer
6. Prepare for production deployment

---

## 7️⃣ IMPORTANT IMPLEMENTATION RULES

- ❌ NEVER use cookies for auth anymore

- ✅ ALWAYS use Bearer Token

- ✅ Backend must read:
  Authorization: Bearer <token>

- ❌ Do NOT mix auth strategies

- ✅ Keep JWT flow consistent

---

## 8️⃣ USER PREFERENCES & WORK STYLE

### Communication Style:

- Prefers:
  - Step-by-step guidance
  - Practical code (not theory)
  - Direct debugging help

- Does NOT prefer:
  - Long abstract explanations
  - High-level only answers

---

### Development Style:

- Hands-on (build while learning)
- Wants production-ready architecture
- Junior → but aiming for **Enterprise-level system**

---

## 9️⃣ USER PROFILE (RELEVANT)

- Backend developer (NestJS focus)
- Building real system (not tutorial)
- Working on:
  - RBAC
  - Auth systems
  - API architecture

---

## 🔟 CURRENT PROBLEM CONTEXT (SOLVED)

Previously:

- 401 Unauthorized everywhere
- Cause:
  - Cookies vs Bearer mismatch

Now:

- ✅ Fully resolved
- ✅ JWT working correctly

---

## 11️⃣ CURRENT CORE FILES

### Backend:

- jwt.strategy.ts ✅
- auth.controller.ts ✅ (clean, no cookies)
- auth.service.ts ✅ (tokens unified)

### Frontend:

- token-storage.ts ✅
- api.ts (Axios interceptor) ✅
- fetcher.ts ✅

---

## 12️⃣ EXPECTED BEHAVIOR

- User logs in → tokens stored
- API calls succeed
- Token expires → auto refresh
- Refresh fails → logout + redirect

---

## 13️⃣ WHAT THE NEXT AI SHOULD DO

Immediately continue with:

👉 Implementing:

- Next.js middleware (route protection)
- Auth global state (Context or Zustand)

Then:

- Move toward production hardening

---

## 🚀 FINAL NOTE

This is no longer a beginner setup.

This is now:

> 🔥 A production-grade JWT authentication system with auto-refresh

Continue building it with:

- clean architecture
- strong security practices
- scalable design

---
