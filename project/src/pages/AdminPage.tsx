import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Lock, Unlock, Upload, Save, X, Edit, Trash2, LogOut } from 'lucide-react';
import { 
  fetchCategories, 
  updateCategoryStatus, 
  uploadCategoryImage, 
  createCategory,
  createCategoryItem,
  CategoryRecord
} from '../lib/supabase';
import CategoryItemsManager from '../components/CategoryItemsManager';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut, isAdmin } = useAuth();
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'bg-blue-200',
    image_url: '',
    is_active: true
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      loadCategories();
    }
  }, [user, isAdmin]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (category: CategoryRecord) => {
    try {
      await updateCategoryStatus(category.id, !category.is_active);
      setCategories(categories.map(c => 
        c.id === category.id ? { ...c, is_active: !c.is_active } : c
      ));
      setSuccess(`Category "${category.name}" ${category.is_active ? 'moved to Coming Soon' : 'activated'}`);
    } catch (err) {
      console.error('Failed to update category status', err);
      setError('Failed to update category status. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCategoryImage(e.target.files[0]);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewCategory({
            ...newCategory,
            image_url: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    
    try {
      if (!categoryImage) {
        throw new Error('Please select a category image');
      }
      
      // Upload the image first
      const timestamp = new Date().getTime();
      const path = `category-banners/${timestamp}-${categoryImage.name}`;
      const imageUrl = await uploadCategoryImage(categoryImage, path);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      
      // Create the category
      const category = await createCategory({
        ...newCategory,
        image_url: imageUrl
      });
      
      if (category) {
        setCategories([category, ...categories]);
        setShowNewCategoryModal(false);
        setNewCategory({
          name: '',
          description: '',
          icon: '📚',
          color: 'bg-blue-200',
          image_url: '',
          is_active: true
        });
        setCategoryImage(null);
        setSuccess(`Category "${category.name}" created successfully`);
      }
    } catch (err: any) {
      console.error('Failed to create category', err);
      setError(err.message || 'Failed to create category. Please try again.');
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

  // If loading auth, show loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated or not admin, show login form
  if (!user || !isAdmin) {
    return <LoginForm />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <Home className="w-5 h-5 text-blue-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Category Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNewCategoryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Category</span>
            </button>
            <button
              onClick={() => signOut()}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification area */}
      {(success || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
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

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCategoryId ? (
          <div className="mb-8">
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to Categories
            </button>
            <CategoryItemsManager categoryId={selectedCategoryId} />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Manage Categories</h2>
              <p className="text-sm text-gray-500">Toggle categories between active and coming soon</p>
            </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No categories found. Create your first category!
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                            <span className="text-xl">{category.icon}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{category.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Coming Soon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleCategoryStatus(category)}
                          className={`mr-2 p-2 rounded-full ${
                            category.is_active 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={category.is_active ? 'Move to Coming Soon' : 'Make Active'}
                        >
                          {category.is_active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setSelectedCategoryId(category.id)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 mr-2"
                          title="Edit Category Items"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        )}
      </div>

      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Create New Category</h3>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Category Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., Animals, Colors"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., Learn animal names"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                  Icon (Emoji)
                </label>
                <input
                  id="icon"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 🦓, 🎨"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                  Color
                </label>
                <select
                  id="color"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  required
                >
                  <option value="bg-blue-200">Blue</option>
                  <option value="bg-red-200">Red</option>
                  <option value="bg-green-200">Green</option>
                  <option value="bg-yellow-200">Yellow</option>
                  <option value="bg-purple-200">Purple</option>
                  <option value="bg-pink-200">Pink</option>
                  <option value="bg-orange-200">Orange</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Banner Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {newCategory.image_url ? (
                      <div>
                        <img
                          src={newCategory.image_url}
                          alt="Category preview"
                          className="mx-auto h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="mt-2 text-sm text-red-600 hover:text-red-500"
                          onClick={() => {
                            setCategoryImage(null);
                            setNewCategory({ ...newCategory, image_url: '' });
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
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={newCategory.is_active}
                    onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-700">Active (uncheck for Coming Soon)</span>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowNewCategoryModal(false)}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      <span>Create Category</span>
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

export default AdminPage;