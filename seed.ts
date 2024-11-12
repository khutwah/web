/**
 * ! Executing this script will delete all data in your database and seed it with 10 public_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat";
import { createServerClient } from "@supabase/ssr";

const main = async () => {
  const seed = await createSeedClient();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return null;
        },
        setAll() {},
      },
    }
  );

  // Truncate all tables in the database
  await seed.$resetDatabase();

  interface User {
    email: string;
    id: string;
  }

  let ustadz: User[] = [];
  let students: User[] = [];
  try {
    const _ustadz = await Promise.all([
      supabase.auth.signUp({
        email: `ustadz_1@${process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN!}`,
        password: "orq[s$^zgx6L",
      }),
      supabase.auth.signUp({
        email: `ustadz_2@${process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN!}`,
        password: "orq[s$^zgx6L",
      }),
    ]);
    const _students = await Promise.all([
      supabase.auth.signUp({
        email: `student_1@${process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN!}`,
        password: "orq[s$^zgx6L",
      }),
      supabase.auth.signUp({
        email: `student_2@${process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN!}`,
        password: "orq[s$^zgx6L",
      }),
    ]);

    ustadz = _ustadz.map((data) => ({
      email: data.data.user?.email ?? "",
      id: data.data.user?.id ?? "",
    }));
    students = _students.map((data) => ({
      email: data.data.user?.email ?? "",
      id: data.data.user?.id ?? "",
    }));
  } catch (e) {
    console.error(e);
  }

  // seed ustad
  await seed.public_users(
    (x) =>
      x(2, (ctx) => {
        return {
          sb_user_id: ustadz[ctx.index].id,
          email: ustadz[ctx.index].email,
        };
      }),
    {
      models: {
        public_users: {
          data: {
            name: (ctx) => copycat.fullName(ctx.seed),
            role: () => 2,
          },
        },
      },
    }
  );

  // seed student
  await seed.public_users(
    (x) =>
      x(2, (ctx) => {
        return {
          sb_user_id: students[ctx.index].id,
          email: students[ctx.index].email,
        };
      }),
    {
      models: {
        public_users: {
          data: {
            name: (ctx) => copycat.fullName(ctx.seed),
            role: () => 1,
          },
        },
      },
    }
  );

  await seed.halaqah((x) =>
    x(3, (ctx) => {
      return {
        name: `Halaqah ${ctx.index + 1}`,
        academic_year: 2024,
      };
    })
  );
  await seed.shifts(
    (x) =>
      x(2, (ctx) => {
        return {
          halaqah_id: ctx.index + 1,
          ustadz_id: ctx.index + 1,
          start_date: new Date().toISOString(),
          end_date: null,
        };
      }),
    { connect: true }
  );
  await seed.students((x) => x(10), {
    models: {
      students: {
        data: {
          name: (ctx) => copycat.fullName(ctx.seed),
          nisn: (ctx) => copycat.scramble(ctx.seed),
          nis: (ctx) => copycat.scramble(ctx.seed),
        },
      },
    },
    connect: true,
  });
  await seed.tags((x) => x(4));

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
