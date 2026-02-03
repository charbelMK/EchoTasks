# Deployment Guide for EchoTasks

## Prerequisites
- **GitHub Repository**: Push this code to a GitHub repository.
- **Vercel Account**: Connect your GitHub account to Vercel.
- **Supabase Project**: You should have this set up already (URL and Anon Key).

## Environment Variables
Ensure the following variables are set in your Vercel Project Settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

*Note: The `SUPABASE_SERVICE_ROLE_KEY` is critical for the Admin Panel's "Create Client" feature.*

## Deployment Steps
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Import the repository.
   - Framework Preset: `Next.js`.
   - Build Command: `npm run build` (default).
   - Install Command: `npm install` (default).
   - **Environment Variables**: Add the keys mentioned above.
   - Click **Deploy**.

## Post-Deployment
- **Create Admin User**:
  - Sign up a new user via the `/login` page (or use an existing one).
  - Go to your Supabase Dashboard > Table Editor > `profiles`.
  - Find your user row and change the `role` column from `client` to `admin`.
  - Log out and log back in to access `/admin`.

## Verification
- Visit your Vercel URL.
- Log in as Admin.
- Create a Test Client.
- Create a Test Project assigned to that client.
- Post an update.
- Log in as the Test Client (in an Incognito window) and verify they see the project and update.
