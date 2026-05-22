## 1. Architecture Design
```mermaid
graph TD
    subgraph Frontend ["Next.js 15 (App Router)"]
        UI["React Server Components & Client Components"]
        Hooks["Custom Hooks (SWR/React Query)"]
    end
    subgraph Services ["External Services"]
        Supabase["Supabase (Auth, Postgres DB, Storage, Edge Functions)"]
        Resend["Resend (Email Automation)"]
        YouTube["YouTube (Video Hosting)"]
    end
    UI --> Hooks
    Hooks --> Supabase
    UI --> Supabase
    Supabase --> Resend
```

## 2. Technology Description
- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- **Backend/Database/Auth**: Supabase (PostgreSQL, GoTrue, Storage)
- **Deployment**: Vercel
- **Email**: Resend

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/about` | About Us page |
| `/vacancies` | Careers portal and job listings |
| `/contact` | Contact page |
| `/login`, `/signup` | Authentication pages |
| `/dashboard` | Student portal main view |
| `/dashboard/lessons/[id]` | Video learning view |
| `/dashboard/quizzes/[id]` | Quiz taking interface |
| `/admin` | Admin management routes |

## 4. API Definitions
Most data access will occur directly via Supabase Client (RLS secured) in Server Components and Server Actions.
Email automation will utilize Server Actions:
```typescript
type ApplicationPayload = {
  vacancyId: string;
  candidateName: string;
  email: string;
  cvUrl: string;
}
// POST /api/apply or Server Action: submitApplication(data: ApplicationPayload)
```

## 5. Server Architecture Diagram
```mermaid
graph TD
    A["Client Action"] --> B["Next.js Server Action"]
    B --> C["Supabase Client"]
    C --> D["PostgreSQL Database"]
    C --> E["Supabase Storage"]
    B --> F["Resend API"]
```

## 6. Data Model
### 6.1 Data Model Definition
```mermaid
erDiagram
    users ||--o{ profiles : has
    profiles ||--o{ lesson_progress : tracks
    profiles ||--o{ quiz_attempts : makes
    courses ||--o{ modules : contains
    modules ||--o{ lessons : contains
    lessons ||--o{ quizzes : tests
    quizzes ||--o{ quiz_questions : has
    vacancies ||--o{ job_applications : receives
    profiles ||--o{ job_applications : submits
```

### 6.2 Data Definition Language
Supabase schema will include standard tables (simplified for architecture overview):
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'student',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT
);
-- Additional tables: modules, lessons, quizzes, quiz_questions, quiz_attempts, lesson_progress, certificates, announcements, resources, vacancies, job_applications, support_tickets.
```
