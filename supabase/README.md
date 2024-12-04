# Creating a New Migration

When creating a new migration, follow these steps:

1. **Create a Migration File**

   ```bash
   supabase migration new <migration_name>
   ```

2. **Edit Your Migration File**
   Open the newly created migration file and add the necessary SQL changes.

3. **Apply Migration to Your Local Machine**

   ```bash
   supabase migration up
   ```

4. **Update TypeScript Definitions for the Database**

   ```bash
   npm run db-types
   ```

5. **Sync Snaplet Seed with the Latest Database Structure**

   ```bash
   npm run seed:sync
   ```

6. **Repopulate Database Data with Seed (Optional)**
   If needed, repopulate the database data with the seed:

   ```bash
   npm run seed
   ```

7. **Commit and Merge Changes**

   - Commit your changes to version control.
   - Open a pull request for code review and merge once approved.

8. **Switch to the Main Branch**
   After merging, checkout the main branch:

   ```bash
   git checkout main
   ```

9. **Refer to the Migration Guide for the Next Steps**
   Follow the steps outlined in the Migration Guide below to finalize your migration.

---

# Migration Guide

1. **Install Supabase CLI**
   Ensure the Supabase CLI is installed. If not, follow the installation instructions for your platform: [Supabase CLI Installation Guide](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos#installing-the-supabase-cli).

2. **Log in to Supabase CLI**
   Authenticate using the Supabase CLI:

   ```bash
   supabase login
   ```

3. **Link Supabase CLI to Your Project**
   Connect the CLI to your Supabase project:

   ```bash
   supabase link --project-ref <PROJECT_ID>
   ```

4. **Check Migration Status**
   View the migration status to check which migrations have been pushed to the remote origin:

   ```bash
   supabase migration list
   ```

5. **Perform a Dry-Run Migration**
   Preview the effects of your migration before applying it:

   ```bash
   supabase db push --dry-run
   ```

6. **Run the Actual Migration**
   Apply the migration and push changes to the remote origin:
   ```bash
   supabase db push
   ```
