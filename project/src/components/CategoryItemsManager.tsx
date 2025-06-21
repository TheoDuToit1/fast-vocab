import React, { useState, useEffect } from 'react';
import { Upload, Save, X, Trash2, Plus } from 'lucide-react';
import { fetchCategoryItems, createCategoryItem, uploadCategoryImage, CategoryItemRecord } from '../lib/supabase';

interface CategoryItemsManagerProps {
  categoryId: string;
}

const CategoryItemsManager: React.FC<CategoryItemsManagerProps> = ({ categoryId }) => {
  const [items, setItems] = useState<CategoryItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    difficulty: 'starter' as 'starter' | 'mover' | 'flyer',
    image_path: ''
  });
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) {
      loadItems();
    }
  }, [categoryId]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchCategoryItems(categoryId);
      setItems(data);
    } catch (err) {
      console.error('Failed to load category items', err);
      setError('Failed to load category items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewItem({
            ...newItem,
            image_path: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    
    try {
      if (!itemImage) {
        throw new Error('Please select an item image');
      }
      
      // Upload the image first
      const timestamp = new Date().getTime();
      const path = `category-items/${categoryId}/${newItem.difficulty}/${timestamp}-${itemImage.name}`;
      const imageUrl = await uploadCategoryImage(itemImage, path);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      
      // Create the item
      const item = await createCategoryItem({
        category_id: categoryId,
        name: newItem.name,
        difficulty: newItem.difficulty,
        image_path: path
      });
      
      if (item) {
        setItems([...items, item]);
        setShowNewItemModal(false);
        setNewItem({
          name: '',
          difficulty: 'starter',
          image_path: ''
        });
        setItemImage(null);
        setSuccess(`Item "${item.name}" created successfully`);
      }
    } catch (err: any) {
      console.error('Failed to create item', err);
      setError(err.message || 'Failed to create item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Category Items</h2>
          <p className="text-sm text-gray-500">Manage items in this category</p>
        </div>
        <button
          onClick={() => setShowNewItemModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>
      
      {/* Notification area */}
      {(success || error) && (
        <div className="px-6 py-4">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{success}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setSuccess(null)}
              >
                <X className="h-5 w-5 text-green-500" />
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading items...</p>
        </div>
      ) : (
        <div className="px-6 py-4">
          {/* Difficulty Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                {['starter', 'mover', 'flyer'].map((difficulty) => (
                  <button
                    key={difficulty}
                    className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm capitalize
                      ${difficulty === 'starter' 
                        ? 'border-blue-500 text-blue-600' 
                        : difficulty === 'mover'
                          ? 'border-green-500 text-green-600'
                          : 'border-purple-500 text-purple-600'
                      }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items
              .filter(item => item.difficulty === 'starter')
              .map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    <img 
                      src={`/images/${item.image_path}`} 
                      alt={item.name}
                      className="max-h-full max-w-full object-contain p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {item.difficulty}
                      </span>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {items.filter(item => item.difficulty === 'starter').length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No items in this category yet.</p>
              <p>Click "Add Item" to get started.</p>
            </div>
          )}
        </div>
      )}
      
      {/* New Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add New Item</h3>
              <button
                onClick={() => setShowNewItemModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateItem} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Item Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., Lion, Apple"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newItem.difficulty}
                  onChange={(e) => setNewItem({ ...newItem, difficulty: e.target.value as 'starter' | 'mover' | 'flyer' })}
                  required
                >
                  <option value="starter">Starter</option>
                  <option value="mover">Mover</option>
                  <option value="flyer">Flyer</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Item Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {newItem.image_path ? (
                      <div>
                        <img
                          src={newItem.image_path}
                          alt="Item preview"
                          className="mx-auto h-32 object-contain rounded-md"
                        />
                        <button
                          type="button"
                          className="mt-2 text-sm text-red-600 hover:text-red-500"
                          onClick={() => {
                            setItemImage(null);
                            setNewItem({ ...newItem, image_path: '' });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowNewItemModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      <span>Add Item</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItemsManager; 