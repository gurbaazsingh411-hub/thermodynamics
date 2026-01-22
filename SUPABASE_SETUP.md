# Supabase Setup Guide for Thermoviz Studio

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose your organization
4. Enter project details:
   - **Project Name**: Thermoviz Studio
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Your Credentials

1. Once your project is ready, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (starts with https://)
   - **anon/public** key (long JWT token)

## Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=your_actual_project_url_here
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the schema

## Step 5: Enable Email Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Providers**
3. Find **Email** provider
4. Toggle it **ON**
5. You can customize email templates if desired

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open your browser to `http://localhost:8081`
3. You should see a "Sign In" button in the toolbar
4. Try creating an account to test the integration

## Troubleshooting

### Common Issues:

**"Supabase configuration missing" warning:**
- Make sure your `.env` file has the correct values
- Restart the development server after changing env vars
- Check that variables start with `VITE_` (required for Vite)

**Authentication errors:**
- Verify your Supabase project URL is correct
- Check that the anon key is properly copied
- Ensure email authentication is enabled in Supabase

**Database errors:**
- Make sure you ran the SQL schema successfully
- Check that all tables were created (profiles, test_cases)
- Verify RLS policies are enabled

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file shows the format without real credentials
- Row Level Security ensures users can only access their own data
- All passwords should be strong and unique

## Next Steps

Once everything is working:
1. Test creating and saving test cases
2. Verify data persists between sessions
3. Try signing in/out to test session management
4. Test the profile management features

Need help? Check the Supabase documentation or console logs for specific error messages.