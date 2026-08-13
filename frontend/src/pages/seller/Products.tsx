import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  imageUrl: string | null;
  adminFeedback: string | null;
  createdAt: string;
  updatedAt: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
  });

  const SELLER_ID_KEY = 'sellerIdForProducts';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const sellerId = localStorage.getItem(SELLER_ID_KEY);
      if (!sellerId) {
        setError('No seller ID found. Please complete your application first.');
        return;
      }

      // Check if seller is approved before allowing product management
      try {
        const appResponse = await api.get(`/sellers/applications/status?email=${user?.email || ''}`);
        if (appResponse.data.data?.status !== 'APPROVED') {
          setError('Your seller application must be approved before you can manage products.');
          return;
        }
      } catch (err) {
        console.error('Failed to check seller status:', err);
      }

      const response = await api.get(`/products/seller/${sellerId}`);
      setProducts(response.data.data.products || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return <span className="text-xs text-[#6B6660]">{status}</span>;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const sellerId = localStorage.getItem(SELLER_ID_KEY);
      await api.post('/products', {
        sellerId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl || null,
      });
      setShowAddModal(false);
      setFormData({ name: '', category: '', description: '', price: '', stock: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      setError('Failed to add product');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/products/${selectedProduct?.id}`, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl || null,
      });
      setShowEditModal(false);
      setSelectedProduct(null);
      setFormData({ name: '', category: '', description: '', price: '', stock: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      setError('Failed to update product');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error:', err);
    }
  };

  const handleResubmitProduct = async (productId: string) => {
    try {
      await api.patch(`/products/${productId}/resubmit`);
      fetchProducts();
    } catch (err) {
      setError('Failed to resubmit product');
      console.error('Error:', err);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B7AB8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#2D2A26] mb-2">Products</h1>
          <p className="text-[#6B6660]">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Product</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Category</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Price</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Stock</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Updated</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#2D2A26]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#6B6660]">
                  <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No products yet. Add your first product to get started.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#2D2A26]">{product.name}</p>
                        {product.adminFeedback && product.status === 'REJECTED' && (
                          <p className="text-xs text-rose-600 mt-1">{product.adminFeedback}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6660]">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-[#2D2A26]">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-[#2D2A26]">{product.stock}</td>
                  <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                  <td className="px-6 py-4 text-sm text-[#6B6660]">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#6B6660]" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                      {product.status === 'REJECTED' && (
                        <button
                          onClick={() => handleResubmitProduct(product.id)}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Resubmit"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[#2D2A26] mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Product Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Category *</label>
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Image URL</label>
                <input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-[#2D2A26] mb-4">Edit Product</h2>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Product Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Category *</label>
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Image URL</label>
                <input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setFormData({ name: '', category: '', description: '', price: '', stock: '', imageUrl: '' });
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;