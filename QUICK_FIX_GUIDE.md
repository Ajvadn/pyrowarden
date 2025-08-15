# 🚀 Quick Database Fix Guide

## The Problem
You can't add products and internships because of database RLS (Row Level Security) policy issues.

## The Solution
Run the `fix-database-issues.sql` script in your Supabase dashboard.

## Steps to Fix:

### 1. Open Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Sign in to your account
- Select your project: `rkwgjrlydhaoqjibrurh`

### 2. Navigate to SQL Editor
- In the left sidebar, click on "SQL Editor"
- Click "New query"

### 3. Copy and Paste the Fix Script
- Open the file `fix-database-issues.sql` in your project
- Copy ALL the contents (it's about 485 lines)
- Paste it into the SQL Editor

### 4. Run the Script
- Click the "Run" button (or press Ctrl+Enter)
- Wait for it to complete (should take a few seconds)

### 5. Verify the Fix
After running the script, you should see:
- ✅ Products table created with 12 sample cybersecurity products
- ✅ Internships table created with 5 sample internships
- ✅ All RLS policies fixed
- ✅ Sample data inserted

## What This Fix Does:
1. **Creates missing tables** (products, internships, internship_applications)
2. **Fixes RLS policies** that were causing infinite recursion
3. **Adds sample cybersecurity products** (ESP32 tools, USB Rubber Ducky, RFID kits, etc.)
4. **Adds sample internships** (Cybersecurity, ESP32 development, IoT security, etc.)
5. **Sets up proper triggers** for automatic timestamp updates

## After the Fix:
- You'll be able to add/edit products in the admin panel
- You'll be able to add/edit internships in the admin panel
- The shop will display the sample cybersecurity products
- The internships page will show the sample internships

## Need Help?
If you encounter any errors when running the script, the error message will tell you exactly what went wrong. Most likely it will work perfectly on the first try!

---

**Ready to fix it? Just follow steps 1-4 above! 🎯**
