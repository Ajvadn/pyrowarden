# Complete Fix Guide - Products and Internships Issues

## 🚨 **Current Problem**
The database has RLS (Row Level Security) policy issues that prevent adding products and internships. The error "infinite recursion detected in policy for relation 'profiles'" indicates a circular dependency in the security policies.

## 🔧 **Solution: Complete Database Reset and Fix**

### **Step 1: Access Supabase Dashboard**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `gluffcyjkrfrqvogljmf`

### **Step 2: Run the Complete Fix Script**

1. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy and Paste the Fix Script**
   - Open the file: `fix-database-issues.sql`
   - Copy the **ENTIRE** contents
   - Paste it into the SQL Editor

3. **Execute the Script**
   - Click "Run" to execute
   - Wait for all steps to complete
   - You should see success messages for each step

### **Step 3: Verify the Fix**

1. **Check Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see:
     - `products` table
     - `internships` table
     - `internship_applications` table

2. **Check Data Added**
   - Click on each table to verify data was added
   - Products table should have 12 cybersecurity products
   - Internships table should have 5 sample internships

### **Step 4: Test the Website**

1. **Test Products Page**
   - Visit: `http://localhost:8080/products`
   - Should display cybersecurity products

2. **Test Internships Page**
   - Visit: `http://localhost:8080/internships`
   - Should display sample internships

3. **Test Admin Panel**
   - Visit: `http://localhost:8080/admin`
   - Login with admin credentials
   - Check products and internships management

## 📋 **What the Fix Script Does**

### **1. Creates Missing Tables**
- Creates `products` table if it doesn't exist
- Creates `internships` table if it doesn't exist
- Creates `internship_applications` table if it doesn't exist
- Creates necessary indexes for performance

### **2. Fixes RLS Policies**
- Disables problematic RLS policies temporarily
- Creates new, simple policies that don't cause recursion
- Re-enables RLS with working policies

### **3. Adds Sample Data**
- Adds 12 cybersecurity products (ESP32, USB tools, RFID, etc.)
- Adds 5 sample internships (Cybersecurity, ESP32, IoT, etc.)
- All data is properly formatted and categorized

### **4. Creates Triggers**
- Sets up `updated_at` triggers for all tables
- Ensures timestamps are automatically updated

## 🛠️ **Alternative: Manual Fix (If Script Fails)**

If the complete script doesn't work, try this step-by-step approach:

### **Step 1: Disable RLS**
```sql
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications DISABLE ROW LEVEL SECURITY;
```

### **Step 2: Drop Problematic Policies**
```sql
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view open internships" ON public.internships;
DROP POLICY IF EXISTS "Admins can manage all internships" ON public.internships;
```

### **Step 3: Add Data**
```sql
-- Add products (copy from fix-database-issues.sql)
INSERT INTO public.products (name, description, price, ...) VALUES (...);

-- Add internships (copy from fix-database-issues.sql)
INSERT INTO public.internships (title, description, ...) VALUES (...);
```

### **Step 4: Re-enable RLS with Simple Policies**
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view open internships" ON public.internships
    FOR SELECT USING (status = 'open');
```

## 🧪 **Testing After Fix**

### **Run the Test Script**
```bash
node test-database-connection.js
```

This should show:
- ✅ Supabase connection successful
- ✅ Products table accessible
- ✅ Internships table accessible
- ✅ Sample data found

### **Test Website Functionality**
1. **Products**: `http://localhost:8080/products`
2. **Internships**: `http://localhost:8080/internships`
3. **Admin Panel**: `http://localhost:8080/admin`

## 📊 **Expected Results**

After running the fix:

### **Products Table**
- 12 cybersecurity products
- Categories: Microcontrollers, USB Tools, RFID Tools, etc.
- Featured products highlighted
- Proper pricing and stock quantities

### **Internships Table**
- 5 sample internships
- Departments: Cybersecurity, Hardware Security, IoT Security, etc.
- Types: Remote, On-site, Hybrid
- All status: 'open'

### **Admin Panel**
- Can view all products and internships
- Can add/edit/delete items
- Can manage applications
- Full CRUD functionality

## 🆘 **If Issues Persist**

### **Check Supabase Logs**
1. Go to Supabase Dashboard
2. Click "Logs" in the left sidebar
3. Check for any error messages

### **Verify Project Settings**
1. Go to "Settings" → "API"
2. Verify the project URL and keys
3. Check if RLS is enabled/disabled as expected

### **Reset Database (Last Resort)**
If nothing else works:
1. Go to "Settings" → "Database"
2. Click "Reset Database"
3. Re-run the complete fix script

## 📞 **Support**

If you continue to have issues:
1. Check the Supabase documentation
2. Verify your project settings
3. Ensure you have admin access to the project
4. Try the manual fix steps above

---

**Note**: The fix script is designed to be safe and will not delete existing data unless specifically clearing duplicates. It will create tables if they don't exist and add sample data for testing.
