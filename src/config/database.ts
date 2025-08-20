// Database Configuration
// This file centralizes all database connection settings

export const DATABASE_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
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
