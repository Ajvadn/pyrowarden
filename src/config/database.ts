// Database Configuration
// This file centralizes all database connection settings

export const DATABASE_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: "https://rkwgjrlydhaoqjibrurh.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrd2dqcmx5ZGhhb3FqaWJydXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODQyMTMsImV4cCI6MjA3MDg2MDIxM30.B4iXxdMLnZTiJHNdZBw8U7iswmRXM1oCJyYvvBzfIss",
  
  // Project Information
  PROJECT_ID: "rkwgjrlydhaoqjibrurh",
  
  // Database Tables
  TABLES: {
    PROFILES: "profiles",
    PRODUCTS: "products", 
    ORDERS: "orders",
    CART_ITEMS: "cart_items",
    WISHLIST_ITEMS: "wishlist_items",
    INTERNSHIPS: "internships",
    INTERNSHIP_APPLICATIONS: "internship_applications"
  },
  
  // RLS Policies
  POLICIES: {
    // Products
    PRODUCTS_VIEW: "Anyone can view active products",
    PRODUCTS_MANAGE: "Admins can manage all products",
    
    // Internships  
    INTERNSHIPS_VIEW: "Anyone can view open internships",
    INTERNSHIPS_MANAGE: "Admins can manage all internships",
    
    // Applications
    APPLICATIONS_OWN: "Users can manage their own applications",
    APPLICATIONS_MANAGE: "Admins can manage all applications"
  }
};

// Helper function to get table name
export const getTableName = (tableKey: keyof typeof DATABASE_CONFIG.TABLES): string => {
  return DATABASE_CONFIG.TABLES[tableKey];
};

// Helper function to get policy name
export const getPolicyName = (policyKey: keyof typeof DATABASE_CONFIG.POLICIES): string => {
  return DATABASE_CONFIG.POLICIES[policyKey];
};
