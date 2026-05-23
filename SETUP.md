# Gombe SS ICT Club — Cloudflare Deployment Guide

## 1. Set Up Supabase (Required for admin controls to work)

1. Go to https://supabase.com and create a free account
2. Create a new project (choose a region close to Nigeria, e.g. West Europe)
3. Once project is ready, go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## 2. Run the Database Setup SQL

1. In Supabase, go to **SQL Editor → New query**
2. Sign in to your deployed site as `hpro453176@gmail.com`
3. Go to Account page → Admin Controls → ⚙️ DB Setup tab
4. Copy the SQL and paste it into Supabase SQL Editor
5. Click **Run** — this creates all tables and permissions
6. All admin controls will now work!

## 3. Enable Supabase Auth

1. In Supabase, go to **Authentication → Providers**
2. Make sure **Email** provider is enabled
3. Optional: Enable Google OAuth if you want Google sign-in

## 4. Deploy to Cloudflare Pages

### Option A: Connect GitHub (Recommended)
1. Push this folder to a GitHub repository
2. Go to https://dash.cloudflare.com → Pages → Create a project
3. Connect your GitHub repo
4. Set build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
5. Add **Environment variables**:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Save and Deploy**

### Option B: Direct Upload
1. Install Node.js (v18+) on your computer
2. Run these commands in this folder:
   ```
   cp .env.example .env.local
   # Edit .env.local with your Supabase values
   npm install
   npm run build
   ```
3. Go to Cloudflare Pages → Create project → **Upload assets**
4. Upload the entire `dist` folder

## 5. Configure Supabase Auth Redirect URL

After deploying, add your Cloudflare domain to Supabase:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your Cloudflare Pages URL (e.g. `https://gombe-ict.pages.dev`)
3. Add the same URL to **Redirect URLs**

## Why Admin Controls Were Not Working on Replit

The admin panel requires:
1. ✅ Supabase env variables set (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
2. ✅ DB tables created via the SQL Setup script
3. ✅ Your account has `admin` or `super_admin` role in the `profiles` table

On Replit, the env variables were placeholder values, so no database connection was made.

## The Replit Badge

The Replit badge was injected by Replit's hosting at runtime — it's not in the source code.
Hosting on Cloudflare means no badge appears automatically.
