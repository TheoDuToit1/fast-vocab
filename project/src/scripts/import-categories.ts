import { supabase, createCategory, createCategoryItem } from '../lib/supabase';
import { categories } from '../data/categories';
import { animals } from '../data/animals';
import { classroom } from '../data/classroom';
import { colors } from '../data/colors';

/**
 * Import existing categories and items into Supabase
 * Run this script using ts-node: npx ts-node src/scripts/import-categories.ts
 */
async function importCategories() {
  console.log('Starting category import...');
  
  // Map of category IDs to their data
  const categoryData: Record<string, any> = {
    'animals': animals,
    'classroom': classroom,
    'colors': colors,
  };
  
  // Process each category
  for (const [id, category] of Object.entries(categories)) {
    if (!categoryData[id]) {
      console.log(`Skipping category ${id} - no data found`);
      continue;
    }
    
    console.log(`Processing category: ${category.name}`);
    
    try {
      // Create the category
      const newCategory = await createCategory({
        name: category.name,
        description: category.description || `Learn ${category.name.toLowerCase()} vocabulary`,
        icon: category.icon,
        color: category.color,
        image_url: '', // Would need to upload an image for each category
        is_active: true
      });
      
      if (!newCategory) {
        console.error(`Failed to create category: ${category.name}`);
        continue;
      }
      
      console.log(`Created category: ${newCategory.name} with ID: ${newCategory.id}`);
      
      // Get the items for this category
      const items = categoryData[id];
      
      // Import starter items
      if (items.starter && items.starter.length > 0) {
        console.log(`Importing ${items.starter.length} starter items for ${category.name}`);
        await importItems(newCategory.id, items.starter, 'starter');
      }
      
      // Import mover items
      if (items.mover && items.mover.length > 0) {
        console.log(`Importing ${items.mover.length} mover items for ${category.name}`);
        await importItems(newCategory.id, items.mover, 'mover');
      }
      
      // Import flyer items
      if (items.flyer && items.flyer.length > 0) {
        console.log(`Importing ${items.flyer.length} flyer items for ${category.name}`);
        await importItems(newCategory.id, items.flyer, 'flyer');
      }
      
      console.log(`Completed import for category: ${category.name}`);
    } catch (error) {
      console.error(`Error processing category ${category.name}:`, error);
    }
  }
  
  console.log('Category import completed!');
}

/**
 * Import items for a specific category and difficulty level
 */
async function importItems(categoryId: string, items: any[], difficulty: 'starter' | 'mover' | 'flyer') {
  for (const item of items) {
    try {
      const newItem = await createCategoryItem({
        category_id: categoryId,
        name: item.name,
        image_path: item.image, // This assumes the path is already in the correct format
        difficulty
      });
      
      if (newItem) {
        console.log(`  Added item: ${newItem.name}`);
      } else {
        console.error(`  Failed to add item: ${item.name}`);
      }
    } catch (error) {
      console.error(`  Error adding item ${item.name}:`, error);
    }
  }
}

// Run the import
importCategories()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution completed');
    process.exit(0);
  }); 