// Database Connection Test
// Run this to verify Supabase connection is working

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rkwgjrlydhaoqjibrurh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrd2dqcmx5ZGhhb3FqaWJydXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODQyMTMsImV4cCI6MjA3MDg2MDIxM30.B4iXxdMLnZTiJHNdZBw8U7iswmRXM1oCJyYvvBzfIss';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Check tables exist
    console.log('📋 Checking if tables exist...');
    const tables = ['profiles', 'products', 'user_roles', 'internships'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('count').limit(1);
        if (tableError) {
          console.error(`❌ Table '${table}' not accessible:`, tableError.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
      }
    }
    
    // Test 3: Check functions exist
    console.log('🔧 Testing database functions...');
    try {
      const { data: hasRoleResult, error: hasRoleError } = await supabase
        .rpc('has_role', { _user_id: '00000000-0000-0000-0000-000000000000', _role: 'admin' });
      
      if (hasRoleError) {
        console.error('❌ has_role function error:', hasRoleError.message);
      } else {
        console.log('✅ has_role function working');
      }
    } catch (err) {
      console.error('❌ Function test failed:', err.message);
    }
    
    console.log('🎉 Database connection test completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('🚀 Database is ready to use!');
  } else {
    console.log('🔧 Database needs setup. Run the complete-database-setup.sql script in Supabase.');
  }
});