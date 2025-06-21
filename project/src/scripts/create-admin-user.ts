import { supabase } from '../lib/supabase';

/**
 * Create an admin user in Supabase
 * Run this script using ts-node: npx ts-node src/scripts/create-admin-user.ts
 */
async function createAdminUser() {
  console.log('Creating admin user...');
  
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: 'savienglish@gmail.com',
      password: 'savi',
    });
    
    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }
    
    console.log('User created successfully:', data);
    
    // Note: In a real application, you would also add this user to an admin role or table
    // For example:
    // const { error: roleError } = await supabase
    //   .from('admin_users')
    //   .insert([{ user_id: data.user.id, role: 'admin' }]);
    
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the function
createAdminUser()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
    process.exit(0);
  }); 