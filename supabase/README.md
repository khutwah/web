# Migration Guide

1. Install Supabase CLI
   Ensure you have the Supabase CLI installed. If not, follow the installation instructions tailored to your platform here: https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos#installing-the-supabase-cli.

2. Login to Supabase CLI
   Authenticate with Supabase CLI by running:

   ```
   supabase login
   ```

3. Link Supabase CLI to Your Project
   Connect the Supabase CLI to your project using the following command:

   ```
   supabase link --project-ref <PROJECT_ID>
   ```

4. Check Migration Status
   To see which migrations have been pushed to the remote origin, run:

   ```
   supabase migration list
   ```

5. Perform a Dry-Run Migration
   Before applying any changes, you can run a dry-run migration to preview the effects:

   ```
   supabase db push --dry-run
   ```

6. Run the Actual Migration
   To apply the migration and push the changes to the remote origin, use:
   ```
   supabase db push
   ```
