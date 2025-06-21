import fetch from 'node-fetch';

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';

// For this operation, we need the service role key
// This is a placeholder - you need to replace this with your actual service role key
// You can find it in your Supabase dashboard under Project Settings > API > Project API keys
const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY'; // Replace with your actual service role key

async function disableEmailConfirmation() {
  if (serviceRoleKey === 'YOUR_SERVICE_ROLE_KEY') {
    console.error('Please replace the placeholder with your actual service role key');
    console.log('You can find it in your Supabase dashboard under Project Settings > API > Project API keys');
    return;
  }

  try {
    console.log('Attempting to disable email confirmation requirement...');
    
    // Get the current auth settings
    const getSettingsResponse = await fetch(`${supabaseUrl}/auth/v1/admin/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
    });
    
    if (!getSettingsResponse.ok) {
      const errorData = await getSettingsResponse.json();
      console.error('Error getting auth settings:', errorData);
      return;
    }
    
    const settings = await getSettingsResponse.json();
    console.log('Current auth settings:', settings);
    
    // Update the settings to disable email confirmation
    const updateSettingsResponse = await fetch(`${supabaseUrl}/auth/v1/admin/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        ...settings,
        mailer_autoconfirm: true,
      }),
    });
    
    if (!updateSettingsResponse.ok) {
      const errorData = await updateSettingsResponse.json();
      console.error('Error updating auth settings:', errorData);
      return;
    }
    
    const updatedSettings = await updateSettingsResponse.json();
    console.log('Updated auth settings:', updatedSettings);
    console.log('Email confirmation requirement has been disabled successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Alternative approach: Create a user directly with email_confirmed=true
async function createConfirmedUser() {
  if (serviceRoleKey === 'YOUR_SERVICE_ROLE_KEY') {
    console.error('Please replace the placeholder with your actual service role key');
    return;
  }

  try {
    console.log('Creating a pre-confirmed user...');
    
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        email: 'savienglish@gmail.com',
        password: 'savi123',
        email_confirm: true,
        user_metadata: {
          name: 'Savi Admin'
        },
        app_metadata: {
          provider: 'email',
          providers: ['email'],
          role: 'admin'
        }
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error creating user:', data);
      return;
    }
    
    console.log('User created successfully with email pre-confirmed:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the functions
console.log('Choose an approach:');
console.log('1. Disable email confirmation requirement globally');
console.log('2. Create a new pre-confirmed user');

// For now, we'll try both approaches
disableEmailConfirmation()
  .then(() => createConfirmedUser())
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
  }); 