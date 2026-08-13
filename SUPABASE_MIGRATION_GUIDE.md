# Supabase Migration Guide

## Overview
This project has been migrated from Docker PostgreSQL to Supabase cloud database for simpler setup and reliable deployment.

## What Changed
- ❌ Removed: `docker-compose.yml` (Docker PostgreSQL setup)
- ✅ Updated: `.env.example` now uses Supabase connection string format
- ✅ Updated: All documentation reflects Supabase instead of local PostgreSQL
- ✅ Updated: README badges show Supabase instead of PostgreSQL

## Quick Setup Steps

### 1. Create Supabase Account (Free)
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project (takes ~2 minutes)

### 2. Get Your Database URL
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **URI** format connection string
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres`

### 3. Update Your Local Environment
1. In the `backend` folder, copy `.env.example` to `.env`
2. Replace the DATABASE_URL with your Supabase connection string
3. Your `.env` should look like:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@db.abc123.supabase.co:5432/postgres
   ```

### 4. Setup Database Schema
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run Your Application
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm install
npm run dev
```

## Benefits of This Change

### For Local Development
- ✅ No Docker installation needed
- ✅ No PostgreSQL installation needed
- ✅ Works on any laptop with just Node.js
- ✅ Same database for local and production
- ✅ No database setup issues

### For Deployment
- ✅ Zero database configuration changes needed
- ✅ Same DATABASE_URL works everywhere
- ✅ Cloud database is always available
- ✅ Professional reliability and performance
- ✅ Free tier covers most use cases

### Cost
- ✅ Supabase free tier: 500MB database, 2 API requests/second
- ✅ Perfect for development and small production apps
- ✅ No credit card required for free tier

## Deployment Made Simple

When you deploy your app:
1. Set the same `DATABASE_URL` environment variable in your hosting platform
2. Run `npx prisma generate` (one-time setup)
3. Deploy your code
4. That's it! No database migration or setup needed

## FAQ

**Q: Do I need internet for local development?**
A: Yes, since you're using Supabase cloud, you need internet connection. This is normal for modern development.

**Q: Can I still use local PostgreSQL if I want?**
A: Yes! The `.env.example` includes both options. Just use the local PostgreSQL connection string format instead.

**Q: Is my data safe in Supabase free tier?**
A: Yes, Supabase provides automated backups and professional-grade security even on free tier.

**Q: What happens if I exceed free tier limits?**
A: Supabase will notify you. For a hackathon project, free tier is more than sufficient.

**Q: Can I export my data from Supabase?**
A: Yes, you can export your data anytime from the Supabase dashboard.

## Next Steps

1. Create your Supabase account
2. Set up your DATABASE_URL
3. Run the setup commands above
4. Start developing with your cloud database!

## Support

If you encounter any issues:
- Check Supabase documentation: https://supabase.com/docs
- Verify your DATABASE_URL is correct
- Ensure you have internet connection
- Check that Prisma client is generated (`npx prisma generate`)
