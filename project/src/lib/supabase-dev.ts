import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3pyZm90eXpjc3hidGF4aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODMwMzQsImV4cCI6MjA2NjA1OTAzNH0.9ShDZeUPYRiJq0puV4uLeVuEJxk0lFBL2r77MCu_y7c';

// Create a client with development settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Direct sign in function that bypasses email verification
// This is for development purposes only!
export async function devSignIn(email: string, password: string) {
  try {
    // First try to sign in normally
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error && error.message.includes('Email not confirmed')) {
      console.log('Email not confirmed, attempting development workaround...');
      
      // For development: Sign up again and immediately try to sign in
      // This is a workaround and should not be used in production!
      await supabase.auth.signUp({
        email,
        password
      });
      
      // Wait a moment and try to sign in again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
    }
    
    return { data, error };
  } catch (err) {
    console.error('Error in devSignIn:', err);
    return { data: null, error: err as any };
  }
}

// Development helper to check if a user exists
export async function checkUserExists(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });
    
    // If we get an error about user not found, the user doesn't exist
    if (error && error.message.includes('User not found')) {
      return false;
    }
    
    // If we get here, the user likely exists
    return true;
  } catch (err) {
    console.error('Error checking if user exists:', err);
    return false;
  }
} 