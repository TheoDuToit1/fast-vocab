import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ezwzrfotyzcsxbtaxiln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3pyZm90eXpjc3hidGF4aWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODMwMzQsImV4cCI6MjA2NjA1OTAzNH0.9ShDZeUPYRiJq0puV4uLeVuEJxk0lFBL2r77MCu_y7c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryItemRecord = {
  id: string;
  category_id: string;
  name: string;
  image_path: string;
  difficulty: 'starter' | 'mover' | 'flyer';
  created_at: string;
};

// Helper functions for category management
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data as CategoryRecord[];
}

export async function fetchCategoryItems(categoryId: string) {
  const { data, error } = await supabase
    .from('category_items')
    .select('*')
    .eq('category_id', categoryId)
    .order('difficulty', { ascending: true });
  
  if (error) {
    console.error('Error fetching category items:', error);
    return [];
  }
  
  return data as CategoryItemRecord[];
}

export async function updateCategoryStatus(categoryId: string, isActive: boolean) {
  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', categoryId);
  
  if (error) {
    console.error('Error updating category status:', error);
    return false;
  }
  
  return true;
}

export async function uploadCategoryImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('category-images')
    .upload(path, file);
  
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  
  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('category-images')
    .getPublicUrl(path);
  
  return publicUrl;
}

export async function createCategory(category: Omit<CategoryRecord, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select();
  
  if (error) {
    console.error('Error creating category:', error);
    return null;
  }
  
  return data[0] as CategoryRecord;
}

export async function createCategoryItem(item: Omit<CategoryItemRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('category_items')
    .insert([item])
    .select();
  
  if (error) {
    console.error('Error creating category item:', error);
    return null;
  }
  
  return data[0] as CategoryItemRecord;
} 