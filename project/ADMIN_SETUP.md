# Savi Vocab Admin Setup Guide

This guide will help you set up the Supabase backend for the Savi Vocab admin panel.

## Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Once your project is created, go to the SQL Editor and run the following SQL to create the necessary tables:

```sql
-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  color VARCHAR,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create category_items table
CREATE TABLE public.category_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  image_path TEXT NOT NULL,
  difficulty VARCHAR NOT NULL CHECK (difficulty IN ('starter', 'mover', 'flyer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to select category_items" ON public.category_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert category_items" ON public.category_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update category_items" ON public.category_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete category_items" ON public.category_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policy for public access to storage
CREATE POLICY "Allow public access to category images" ON storage.objects
  FOR SELECT USING (bucket_id = 'category-images');

CREATE POLICY "Allow authenticated users to upload category images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'category-images' AND auth.role() = 'authenticated');
```

3. Set up authentication:
   - Go to the Authentication section in your Supabase dashboard
   - Configure Email authentication
   - Create an admin user with email and password

4. Get your API keys:
   - Go to Project Settings > API
   - Copy the URL and anon key

5. Update the Supabase configuration in your project:
   - Open `src/lib/supabase.ts`
   - Replace the placeholder values with your actual Supabase URL and anon key:

```typescript
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
```

## Importing Existing Categories

To import your existing categories and items into Supabase, you can use the following approach:

1. Create a script that reads your existing category data
2. Upload the images to Supabase storage
3. Insert the category and item records into the database

Here's a sample script that demonstrates how to do this:

```typescript
import { supabase, createCategory, createCategoryItem, uploadCategoryImage } from '../lib/supabase';
import { categories } from '../data/categories';
import fs from 'fs';
import path from 'path';

async function importCategories() {
  for (const category of Object.values(categories)) {
    // Create the category
    const newCategory = await createCategory({
      name: category.name,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      image_url: '', // You would upload and set this
      is_active: true
    });
    
    if (newCategory) {
      console.log(`Created category: ${newCategory.name}`);
      
      // Import items for this category
      // This would depend on your data structure
    }
  }
}

importCategories().catch(console.error);
```

## Running the Admin Panel

1. Start the development server:

```
npm run dev
```

2. Navigate to `http://localhost:5173/admin` in your browser
3. Log in with your Supabase admin credentials
4. You can now manage categories and items through the admin panel

## Features

The admin panel allows you to:

- Create, update, and delete categories
- Toggle categories between active and "coming soon" status
- Add, update, and delete items within categories
- Organize items by difficulty level (starter, mover, flyer)
- Upload images for categories and items

## Security Considerations

- The admin panel should only be accessible to authorized users
- Consider implementing additional authentication checks on the frontend
- For production, set up proper environment variables for Supabase credentials
- Review and adjust the RLS policies as needed for your specific security requirements 