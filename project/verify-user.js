import fetch from 'node-fetch';

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3pyZm90eXpjc3hidGF4aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODMwMzQsImV4cCI6MjA2NjA1OTAzNH0.9ShDZeUPYRiJq0puV4uLeVuEJxk0lFBL2r77MCu_y7c';

// First, we need to get service role key to perform admin operations
// For security, this should be stored in environment variables in production
// For this example, we'll use a placeholder - you need to replace this with your actual service role key
// You can find it in your Supabase dashboard under Project Settings > API
const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY'; // Replace with your actual service role key

async function verifyUserEmail() {
  try {
    console.log('Attempting to verify user email...');
    
    // First, let's try to sign in to get the user ID
    const signInResponse = await fetch(`${supabaseUrl}/auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        email: 'savienglish@gmail.com',
        password: 'savi123',
        gotrue_meta_security: {}
      }),
    });
    
    const signInData = await signInResponse.json();
    
    if (!signInResponse.ok) {
      console.error('Error signing in:', signInData.error || signInData.msg);
      
      // If we can't sign in, let's try to get the user by email using the service role key
      if (serviceRoleKey !== 'YOUR_SERVICE_ROLE_KEY') {
        console.log('Trying to get user by email...');
        
        const getUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=savienglish@gmail.com`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
        });
        
        const userData = await getUserResponse.json();
        
        if (!getUserResponse.ok) {
          console.error('Error getting user:', userData.error || userData.msg);
          return;
        }
        
        if (userData.users && userData.users.length > 0) {
          const userId = userData.users[0].id;
          console.log(`Found user with ID: ${userId}`);
          
          // Update the user to mark email as verified
          const updateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({
              email_confirm: true,
              app_metadata: { email_confirmed_at: new Date().toISOString() }
            }),
          });
          
          const updateData = await updateResponse.json();
          
          if (!updateResponse.ok) {
            console.error('Error updating user:', updateData.error || updateData.msg);
            return;
          }
          
          console.log('User email verified successfully!');
        } else {
          console.error('No user found with that email');
        }
      } else {
        console.log('Service role key not provided. Cannot verify email directly.');
        console.log('Please check your Supabase dashboard and update the verification settings.');
      }
      
      return;
    }
    
    console.log('User signed in successfully:', signInData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
verifyUserEmail()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
  }); 