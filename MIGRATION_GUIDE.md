# Database Migration Guide - Internship Management System

## 🚀 **Step-by-Step Migration Instructions**

### **1. Access Supabase Dashboard**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `gluffcyjkrfrqvogljmf`

### **2. Apply the Migration**

1. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy and Paste the Migration SQL**
   - Open the file: `supabase/migrations/20250812000000_internship_management.sql`
   - Copy the entire contents
   - Paste it into the SQL Editor

3. **Execute the Migration**
   - Click "Run" to execute the SQL
   - Wait for the migration to complete
   - You should see success messages for each step

### **3. Verify the Migration**

1. **Check Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `internships`
     - `internship_applications`

2. **Check Enums Created**
   - Go to "Database" → "Types"
   - You should see: `internship_status`

### **4. Add Sample Internships**

After the migration is applied, run the sample data script:

```bash
node add-sample-internships.js
```

## 📋 **Sample Internships to be Added**

### **1. Cybersecurity Penetration Testing Intern**
- **Department**: Cybersecurity
- **Duration**: 3 months
- **Type**: Hybrid
- **Salary**: $18-25/hour
- **Focus**: Ethical hacking, penetration testing, security assessments

### **2. ESP32 WiFi Security Research Intern**
- **Department**: Hardware Security
- **Duration**: 4 months
- **Type**: On-site
- **Salary**: $20-28/hour
- **Focus**: ESP32 development, WiFi deauthentication tools, wireless security

### **3. IoT Security Assessment Intern**
- **Department**: IoT Security
- **Duration**: 3 months
- **Type**: Remote
- **Salary**: $16-22/hour
- **Focus**: IoT device security, firmware analysis, vulnerability research

## 🔧 **Troubleshooting**

### **If Migration Fails:**

1. **Check for Existing Tables**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name LIKE '%internship%';
   ```

2. **Drop Existing Tables (if needed)**
   ```sql
   DROP TABLE IF EXISTS public.internship_applications CASCADE;
   DROP TABLE IF EXISTS public.internships CASCADE;
   DROP TYPE IF EXISTS public.internship_status CASCADE;
   ```

3. **Re-run Migration**
   - Copy the migration SQL again
   - Execute in SQL Editor

### **If Sample Data Fails:**

1. **Check Table Access**
   ```sql
   SELECT * FROM public.internships LIMIT 1;
   ```

2. **Check RLS Policies**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'internships';
   ```

## ✅ **Verification Checklist**

After completing the migration:

- [ ] `internships` table exists
- [ ] `internship_applications` table exists
- [ ] `internship_status` enum exists
- [ ] RLS policies are active
- [ ] Triggers are created
- [ ] Sample internships are added
- [ ] Website displays internships at `/internships`
- [ ] Admin can manage internships at `/admin/internships`

## 🌐 **Website Testing**

Once migration is complete:

1. **Public Internships Page**
   - Visit: `http://localhost:8080/internships`
   - Should display the sample internships

2. **Admin Internship Management**
   - Visit: `http://localhost:8080/admin/internships`
   - Should show internship management interface

3. **Application Process**
   - Click "Apply Now" on any internship
   - Should redirect to application form

## 📞 **Support**

If you encounter issues:

1. Check the Supabase logs in the dashboard
2. Verify all SQL commands executed successfully
3. Ensure you have admin access to the Supabase project
4. Check that the project reference is correct: `gluffcyjkrfrqvogljmf`

---

**Note**: The migration only needs to be applied once. After successful migration, the internship system will be fully functional on the website.
