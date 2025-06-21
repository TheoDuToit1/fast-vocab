import fetch from 'node-fetch';

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3pyZm90eXpjc3hidGF4aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODMwMzQsImV4cCI6MjA2NjA1OTAzNH0.9ShDZeUPYRiJq0puV4uLeVuEJxk0lFBL2r77MCu_y7c';

async function createUser() {
  try {
    console.log('Creating user via REST API...');
    
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        email: 'savienglish@gmail.com',
        password: 'savi123',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error creating user:', data.error || data.msg);
      return;
    }
    
    console.log('User created successfully:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createUser()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
  }); 