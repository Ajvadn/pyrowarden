# 🚀 Production Setup Guide - Pyrowarden

## Overview
This guide will help you set up the Pyrowarden application for production deployment.

## Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Domain name (optional)

## 🗄️ Database Setup

### 1. Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing: `rkwgjrlydhaoqjibrurh`
3. Note your project URL and anon key

### 2. Run Database Setup
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the entire content of `complete-database-setup.sql`
3. Click **Run** to create all tables and sample data

### 3. Make Yourself Admin
1. In SQL Editor, run the content of `make-admin.sql`
2. Or run this command (replace with your email):
```sql
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## 🔧 Application Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Test Locally
```bash
npm run dev
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Deploy

### Option 2: Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Add environment variables
4. Deploy

### Option 3: Static Hosting
1. Run `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Configure environment variables

## 🔐 Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://rkwgjrlydhaoqjibrurh.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📋 Features Checklist

### ✅ Core Features
- [x] User authentication (sign up/sign in)
- [x] Admin panel with role-based access
- [x] Product management (add/edit/delete)
- [x] Order management
- [x] User management
- [x] Internship management
- [x] Shopping cart functionality
- [x] Wishlist functionality

### ✅ Admin Features
- [x] Manage products (cybersecurity tools)
- [x] Manage users and roles
- [x] Manage orders and status
- [x] Manage internships and applications
- [x] View statistics and analytics

### ✅ User Features
- [x] Browse cybersecurity products
- [x] Add items to cart/wishlist
- [x] Apply for internships
- [x] View order history
- [x] Update profile information

## 🎨 Customization

### Branding
- Update `public/favicon.svg` for your logo
- Modify colors in `tailwind.config.ts`
- Update company information in components

### Content
- Add your own products in the admin panel
- Customize internship positions
- Update contact information and policies

## 🔍 Testing

### Admin Panel Testing
1. Sign in with admin account
2. Test all management features:
   - Add/edit products
   - Manage users
   - Process orders
   - Manage internships

### User Features Testing
1. Create a test user account
2. Test shopping cart
3. Test internship applications
4. Test order placement

## 🚨 Security Notes

### Database Security
- RLS policies are configured for data protection
- Admin roles are properly managed
- User data is isolated by user_id

### Application Security
- Environment variables for sensitive data
- Input validation on forms
- XSS protection with React
- CSRF protection with Supabase

## 📞 Support

### Common Issues
1. **Database connection errors**: Check Supabase URL and key
2. **Admin access issues**: Verify user_roles table setup
3. **Build errors**: Check Node.js version and dependencies

### Getting Help
- Check Supabase documentation
- Review React/Vite documentation
- Check browser console for errors

## 🎉 Launch Checklist

Before going live:
- [ ] Database setup completed
- [ ] Admin account created
- [ ] Sample data added
- [ ] Environment variables configured
- [ ] Build successful
- [ ] All features tested
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics tracking setup
- [ ] Backup strategy in place

---

**Your Pyrowarden application is now ready for production!** 🚀
