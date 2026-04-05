تمام، سأقوم بإعداد **ملف Briefing احترافي كامل** يمكنك نسخه ولصقه في أي دردشة جديدة أو أداة ذكاء اصطناعي، بحيث يكون كل شيء متاح للفهم الفوري دون فقدان أي تفاصيل. سأقسّمها بطريقة منظمة وسهلة القراءة.

---

# 🚀 Professional AI Handoff Briefing

## 1️⃣ Full Project Context

You are building a **Professional Registration Management System (PRMS)** for **agricultural engineers**, combining **Next.js (frontend)** with **NestJS + PostgreSQL (backend)**. The system includes:

- User authentication and profile management
- Application submission for professional certification
- Draft management with autosave
- Step-by-step form system
- RBAC with roles like admin, registrar, and registrant

Key architectural decisions:

- **Next.js App Router** for frontend pages & UI
- **NestJS controllers/services** for backend API
- **Drizzle ORM** for database queries
- **React Hook Form + Zod** for form validation
- Autosave per step with debounce
- Multilingual support (Arabic/English)
- Stepper UI with navigation and progress indicators

---

## 2️⃣ Decisions Made & Rationale

| Decision                                                   | Reasoning                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Use **NestJS backend** for API endpoints                   | Separation of concerns and maintainable backend logic                        |
| Avoid creating Next.js API routes for application data     | Prevent duplicated logic, stick to NestJS as source of truth                 |
| Implement **Next.js rewrites** to proxy `/api/*` to NestJS | So frontend can call `localhost:3000/api/...` without changing all endpoints |
| Use **React Hook Form + Zod resolver**                     | Robust form validation and per-step schema enforcement                       |
| Use **stepSchemas & FormRenderer**                         | Dynamic rendering of multi-step forms without duplicating UI code            |
| Autosave per step                                          | UX enhancement for long forms, prevent data loss                             |
| Draft mapping (`mapDraftToForm`)                           | Converts backend draft structure into frontend form-ready values             |

---

## 3️⃣ Current Status

- Frontend page `new/page.tsx` rewritten with **FormRenderer** and **StepNavigation**
- Draft fetching implemented via `useApplicationDraft` hook
- Autosave hook `useStepAutosave` implemented, but currently fails (404) because Next.js API routes point to nonexistent path
- NestJS `applications.controller` exists with `/api/applications/my-draft`, but not reachable due to Next.js intercepting `/api/*`
- Steps, progress bar, and navigation buttons implemented
- Submit flow implemented with `useSubmitApplication`
- Backend endpoints exist but need proper proxying from Next.js

**Issues currently blocking full functionality:**

1. **HTTP 404** on `/api/applications/my-draft` when autosave or fetch draft is triggered
2. `useFormContext` errors in some custom hooks due to unmounted forms or missing provider context
3. Autosave fails because PATCH requests are routed incorrectly

---

## 4️⃣ Remaining Tasks / Next Steps

### Frontend:

1. **Set up proxy** in `next.config.js` to forward `/api/*` requests to NestJS backend.
2. Ensure **React Hook Form Context** wraps all form components to avoid `watch` destructuring errors.
3. Map backend draft structure to frontend form schema (currently done with `mapDraftToForm`).
4. Test step autosave and submission flow.
5. Confirm multilingual strings render correctly.

### Backend:

1. Ensure NestJS endpoint `/api/applications/my-draft` returns JSON draft for current user.
2. Implement PATCH for `/api/applications/my-draft` to support autosave.
3. Ensure authentication middleware works for API access.
4. Optimize draft autosave with debouncing to reduce server load.

---

## 5️⃣ Important Details / Preferences

- You prefer **full separation of concerns** (Next.js for UI, NestJS for API)
- **Always use Next.js rewrites** instead of duplicating API routes
- Follow **TALL Stack principles**, i.e., clean frontend/backend separation
- Multilingual support is required (Arabic & English)
- Always implement **autosave with feedback**
- Step forms should be **dynamic and schema-driven**
- No unused imports or commented code in production

---

## 6️⃣ Communication Style

- Concise, structured explanations with diagrams/ASCII if needed
- Step-by-step guidance for complex setup
- Emphasis on correctness and avoiding common pitfalls
- Lightly humorous but professional when appropriate
- Prefers concrete code examples over abstract instructions

---

## 7️⃣ Specific Instructions Always Followed

- Always check exact API route matches
- Always validate frontend-backend integration for Next.js + NestJS
- Never duplicate backend logic in frontend
- Always map backend drafts to form-ready data before populating
- Stepper & form state should be consistent with draft and autosave

---

## 8️⃣ Key Information About the User

- Junior developer with experience in **Next.js, NestJS, React, PostgreSQL**
- Working on a **professional registration portal** for agricultural engineers
- Focused on building **production-ready, maintainable code**
- Based in Libya, using **localhost:3000** for frontend and **NestJS** possibly on 3001
- Prefers **TALL Stack**, not Next+Nest monolithic

---

## 9️⃣ Tone, Format, Structure

- Structured, modular explanations
- Clear separation between **frontend** and **backend**
- Step-by-step instructions for setup and debugging
- Tables and headings for clarity
- Use emojis lightly to mark sections/status

---

## 🔟 Additional Notes

- **Autosave errors are caused by routing conflict**; must implement rewrites or direct backend calls
- **Current form architecture**: stepSchemas → FormRenderer → useForm → StepNavigation → Autosave → Submit
- **Draft flow**: Fetch → Map → Populate form → Autosave → Submit
- **Next step**: Connect frontend to NestJS properly via rewrites/proxy

---

This briefing contains everything a new AI would need to **immediately continue development**, debug errors, and extend the multi-step application system seamlessly.

---

I can also provide a **ready-to-use `next.config.js` + example backend proxy setup** if you want, so the new AI can continue without touching frontend API routes.

Do you want me to include that?
