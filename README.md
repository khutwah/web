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
