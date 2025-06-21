const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3pyZm90eXpjc3hidGF4aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODMwMzQsImV4cCI6MjA2NjA1OTAzNH0.9ShDZeUPYRiJq0puV4uLeVuEJxk0lFBL2r77MCu_y7c';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // First, delete the user if it already exists (to avoid conflicts)
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: 'savienglish@gmail.com',
      password: 'savi123'
    });
    
    if (existingUser?.user) {
      console.log('User already exists, attempting to sign in with it...');
      return;
    }
    
    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email: 'savienglish@gmail.com',
      password: 'savi123',
      options: {
        data: {
          role: 'admin'
        },
        emailRedirectTo: 'http://localhost:5177/admin'
      }
    });
    
    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }
    
    console.log('User created successfully:', data);
    console.log('IMPORTANT: You need to verify the email before you can sign in.');
    console.log('Check your email for a verification link or check the Supabase dashboard to manually confirm the user.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createAdminUser()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
  }); 