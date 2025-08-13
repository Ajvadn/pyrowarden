import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gluffcyjkrfrqvogljmf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdWZmY3lqa3JmcnF2b2dsam1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjkwMDcsImV4cCI6MjA3MDQwNTAwN30.1p5ZxEEmwHOoc5WCL6uMK3ePWaVXwnZtWXIKMw270CA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testAdminFix() {
  console.log('🔧 Testing Admin Fix...\n');
  
  try {
    // Test 1: Check if we can read products
    console.log('1. Testing product read access...');
    const { data: products, error: readError } = await supabase
      .from('products')
      .select('*')
      .limit(3);
    
    if (readError) {
      console.error('❌ Read error:', readError.message);
    } else {
      console.log(`✅ Read successful - Found ${products?.length || 0} products`);
    }
    
    // Test 2: Try to create a test product
    console.log('\n2. Testing product creation...');
    const testProduct = {
      name: 'Test Product - Admin Fix Test',
      description: 'Testing admin product creation functionality',
      price: 29.99,
      sku: 'TEST-ADMIN-CREATE-001',
      stock_quantity: 5,
      category: 'Test Category',
      tags: ['test', 'admin', 'creation'],
      status: 'active',
      featured: false,
      images: ['/assets/hardware-toolkit.webp']
    };
    
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Create error:', createError.message);
      console.log('   This confirms the RLS policy issue');
    } else {
      console.log('✅ Create successful!');
      console.log(`   Created product: ${newProduct.name}`);
      console.log(`   ID: ${newProduct.id}`);
      
      // Clean up - delete the test product
      console.log('\n3. Cleaning up test product...');
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', newProduct.id);
      
      if (deleteError) {
        console.error('❌ Delete error:', deleteError.message);
      } else {
        console.log('✅ Test product deleted successfully');
      }
    }
    
    // Test 3: Check internships
    console.log('\n4. Testing internship access...');
    const { data: internships, error: internshipError } = await supabase
      .from('internships')
      .select('*')
      .limit(3);
    
    if (internshipError) {
      console.error('❌ Internship error:', internshipError.message);
    } else {
      console.log(`✅ Internships accessible - Found ${internships?.length || 0} internships`);
    }
    
    console.log('\n📋 Summary:');
    console.log('- If you see "Create successful!" above, the fix worked!');
    console.log('- If you see "Create error", you need to run the quick-admin-fix.sql script');
    console.log('- The website admin panel should now work properly');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminFix();
