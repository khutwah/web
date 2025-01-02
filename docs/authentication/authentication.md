# Authentication Overview

We use Supabase Authentication to manage user roles and access. The login process varies slightly between roles: **Santri** and **Ustadz**. The system includes fallback mechanisms and custom APIs to accommodate role-specific authentication requirements.

---

## Login Flow

![login-flow](./login-flow.png)

### 1. Santri Login

- **Primary Authentication**:
  Santri users first authenticate through the **Mumtaz Auth API**. If successful:

  - An authentication session is created in our system using the provided username and a default password (`STUDENTS_DEFAULT_PASSWORD`), which is securely stored in the environment variables.

- **Fallback Authentication**:
  If Mumtaz Auth API authentication fails, the system falls back to **PIN login**, which is a personal PIN set during the user’s initial login. The PIN is stored in the `students` table.

### 2. Ustadz Login

- Ustadz users authenticate directly with our system using Supabase Authentication.
- Upon successful authentication, an active session is created.

---

## Retrieving Current User Data

To retrieve the authenticated user's data, you can use the following code:

```typescript
import { createClient } from '@/utils/supabase/server'

const supabase = await createClient()
const {
  data: { user }
} = await supabase.auth.getUser()

// `user` contains details about the currently authenticated user
```

---

## Authorization and Access Control

- **Logged-In Check**:
  For every request, we verify if the user is logged in. If not, they are redirected to the `/login` page.
- **Authentication Bypass**:
  Specific endpoints, like `/api/v1/activities/automation`, bypass authentication to allow access for scheduled tasks (e.g., cron jobs).
  Details about this API can be found in the [draft-automation documentation](../draft-automation/draft-automation.md).

---

## User Roles

User roles are defined in `@/models/auth`. Currently, the system supports two roles:

1. **Santri**:

   - Prioritizes authentication via Mumtaz Auth API.
   - Fallback to PIN-based login recorded in the `students` table.

2. **Ustadz**:
   - Authenticated directly via Supabase Authentication.

---

## Environment Variables

- **STUDENTS_DEFAULT_PASSWORD**: Used to initialize sessions for Santri users authenticated via Mumtaz Auth API.

Ensure all environment variables are securely managed and not exposed in public repositories.
