This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, prepare your .env file, example is on .env.example. Ask your peers for the key value if needed.

Then, run local supabase application:

```base
supabase start
```

Then, run the development server:

```bash
npm run dev
```

### Seed Local Database

Run this if you want to use seed data so you dont have to manually create one.

```bash
npm run seed
```

### Available Seeded Users for Login

Password: `orq[s$^zgx6L`
| Users |
| -------- |
| ustadz_1@app.minhajulhaq.sch.id |
| ustadz_2@app.minhajulhaq.sch.id |
| student_1@app.minhajulhaq.sch.id |
| student_2@app.minhajulhaq.sch.id |

## Folder Structure

```
.
├── supabase
└── src
    ├── models
    ├── components
    ├── utils
    └── hooks
```

### supabase

Directory where we store supabase related code. e.g. migrations, seeds

### src/models

Directory where we store constants and typescript types

### src/components

Directory where we store React Components

### src/hooks

Directory where we store React Hooks

### src/utils

Directory where we store utilities function
