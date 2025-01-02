## API Documentation

API documentation can be found in here https://khutwah.docs.apiary.io

## Tech Stack

1. NextJS
2. Tailwind CSS with [@shadcn/ui](https://ui.shadcn.com/)
3. Supabase as cloud database service

## Getting Started

First, prepare your .env file, example is on .env.example. Ask your peers for the key value if needed.

Three basic env key you can obtain by yourself

```
SUPABASE_API_URL=
SUPABASE_ANON_KEY=
STUDENTS_DEFAULT_PASSWORD=
SEED_DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

You can come up with your own STUDENTS_DEFAULT_PASSWORD that only work on your local. This is for system used only, student will be authenticated using mumtaz API, and session will be created in our system using this password. More Detail: https://github.com/khutwah/khutwah-web/tree/main/src/app/login

Then, run local supabase application:

```base
supabase start
```

If you already start the supabase before, always good practice to run `supabase migration up` in case there is new update to database
that you have not already apply to your local database.

Running supabase start will give you information about SUPABASE_API_URL and SUPABASE_ANON_KEY.

<img width="642" alt="Screenshot 2024-11-24 at 09 55 16" src="https://github.com/user-attachments/assets/45c0faf3-3d93-4834-8744-d79173afd3cf">

```
 SUPABASE_API_URL = API URL
 SUPABASE_ANON_KEY = anon key
```

Then, run the development server:

```bash
npm run dev
```

### Seed Local Database

Run this if you want to use seed data so you dont have to manually create one.

```bash
supabase migration up # Only if there are migrations not yet synchronized to local database.
npm run dbtypes:gen
npm run seed:sync
npm run seed
```

### Available Seeded Ustadz Users for Login

Please check [circles](./seed/fixtures/circles.ts) data.

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
