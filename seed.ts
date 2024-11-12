/**
 * ! Executing this script will delete all data in your database and seed it with 10 public_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat";

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 public_users
  await seed.public_users((x) => x(10), {
    models: {
      public_users: {
        data: {
          email: (ctx) =>
            copycat.email(ctx.seed, { domain: "app.minhajulhaq.sch.id" }),
          name: (ctx) => copycat.fullName(ctx.seed),
          role: () => 1,
        },
      },
    },
  });
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
      x(3, (ctx) => {
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
