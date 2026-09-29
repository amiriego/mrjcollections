import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  LogOut,
  Upload,
  X,
  Database,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Category,
  Product,
  ProductInput,
  StockStatus,
  SUBCATEGORIES,
  VALIDATION_LIMITS,
  formatPrice,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    isAdminAuthenticated,
    adminEmail,
    authLoading,
    isUsingSeedFallback,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    changeAdminPassword,
    seedCatalogToFirestore,
    uploadProductImage,
    showToast,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [stockFilter, setStockFilter] = useState<'all' | StockStatus>('all');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState<Category>('male');
  const [subcategory, setSubcategory] = useState<string>(SUBCATEGORIES.male[0]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [hotSelling, setHotSelling] = useState(false);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const stats = useMemo(() => {
    return {
      total: products.length,
      male: products.filter((p) => p.category === 'male').length,
      female: products.filter((p) => p.category === 'female').length,
      unisex: products.filter((p) => p.category === 'unisex').length,
      hotSelling: products.filter((p) => p.hotSelling).length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (stockFilter !== 'all' && p.stockStatus !== stockFilter) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.subcategory.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  if (!authLoading && !isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDiscountPrice('');
    setCategory('male');
    setSubcategory(SUBCATEGORIES.male[0]);
    setDescription('');
    setImages([]);
    setImageUrlDraft('');
    setSizesInput('');
    setColorsInput('');
    setStockStatus('in_stock');
    setHotSelling(false);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setDiscountPrice(
      product.discountPrice !== null && product.discountPrice !== undefined
        ? String(product.discountPrice)
        : ''
    );
    setCategory(product.category);
    setSubcategory(
      SUBCATEGORIES[product.category].includes(product.subcategory)
        ? product.subcategory
        : SUBCATEGORIES[product.category][0]
    );
    setDescription(product.description);
    setImages(product.images || []);
    setImageUrlDraft('');
    setSizesInput(product.sizes ? product.sizes.join(', ') : '');
    setColorsInput(product.colors ? product.colors.join(', ') : '');
    setStockStatus(product.stockStatus);
    setHotSelling(product.hotSelling);
    setIsProductModalOpen(true);
  };

  const handleCategoryChange = (nextCat: Category) => {
    setCategory(nextCat);
    setSubcategory(SUBCATEGORIES[nextCat][0]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = VALIDATION_LIMITS.IMAGES_MAX - images.length;
    if (remainingSlots <= 0) {
      showToast(`Maximum ${VALIDATION_LIMITS.IMAGES_MAX} images allowed.`, 'error');
      return;
    }

    const filesArray = Array.from(fileList).slice(0, remainingSlots);
    setUploadingFiles(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of filesArray) {
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
      showToast(
        `Uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''}`
      );
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : 'Failed to upload image',
        'error'
      );
    } finally {
      setUploadingFiles(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlDraft.trim();
    if (!trimmed) return;
    if (images.length >= VALIDATION_LIMITS.IMAGES_MAX) {
      showToast(`Maximum ${VALIDATION_LIMITS.IMAGES_MAX} images allowed.`, 'error');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageUrlDraft('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      showToast('Please enter a valid price in GH₵.', 'error');
      return;
    }
    const parsedDiscount =
      discountPrice.trim() !== '' ? Number(discountPrice) : null;

    const parsedSizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedColors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: ProductInput = {
      name: name.trim().slice(0, VALIDATION_LIMITS.NAME_MAX),
      price: parsedPrice,
      discountPrice:
        parsedDiscount !== null && !isNaN(parsedDiscount) && parsedDiscount > 0
          ? parsedDiscount
          : null,
      category,
      subcategory,
      description: description.trim().slice(0, VALIDATION_LIMITS.DESCRIPTION_MAX),
      images,
      sizes: parsedSizes.length > 0 ? parsedSizes : null,
      colors: parsedColors.length > 0 ? parsedColors : null,
      stockStatus,
      hotSelling,
    };

    setSavingProduct(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsProductModalOpen(false);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : 'Error saving product',
        'error'
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : 'Error deleting product',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setUpdatingPassword(true);
    try {
      await changeAdminPassword(newPassword);
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : 'Could not update password.',
        'error'
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0A0A0A] pb-6">
        <div>
          <p className="text-xs font-mono-tabular text-[#9E7B32]">
            Signed in as {adminEmail || 'Administrator'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A0A0A]">
            "ADMIN DASHBOARD"
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isUsingSeedFallback && (
            <button
              type="button"
              onClick={seedCatalogToFirestore}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] rounded-none whitespace-nowrap transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#9E7B32]" />
              <span>Sync Seed Catalog to Firestore</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] rounded-none whitespace-nowrap transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#9E7B32]" />
            <span>Change Password</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] rounded-none whitespace-nowrap transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>"ADD PRODUCT"</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#52514E] hover:text-[#0A0A0A] bg-[#FFFFFF] border border-[#0A0A0A] rounded-none whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Counts */}
      <section aria-label="Inventory Overview">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Products', value: stats.total },
            { label: 'Male', value: stats.male },
            { label: 'Female', value: stats.female },
            { label: 'Unisex', value: stats.unisex },
            { label: 'Hot Selling', value: stats.hotSelling },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#FFFFFF] border border-[#0A0A0A] p-5 rounded-none space-y-1"
            >
              <p className="text-xs font-semibold text-[#52514E]">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] font-mono-tabular">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Management Section */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#0A0A0A] p-4 rounded-none">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#52514E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or subcategories..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | Category)}
              aria-label="Filter by category"
              className="px-3 py-2 text-xs font-medium bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
            >
              <option value="all">All Categories</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | StockStatus)}
              aria-label="Filter by stock status"
              className="px-3 py-2 text-xs font-medium bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#FFFFFF] border border-[#0A0A0A] rounded-none overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A] bg-[#F6F5F0] text-xs font-bold text-[#0A0A0A]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Hot Selling</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/15 text-sm">
              {filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F6F5F0]/60 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || ''}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-none border border-[#0A0A0A] bg-[#EAE8E1] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#0A0A0A] truncate max-w-[240px]">
                          "{item.name}"
                        </p>
                        <p className="text-xs text-[#52514E] truncate">
                          {item.sizes ? `Sizes: ${item.sizes.join(', ')}` : 'Standard sizing'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#52514E] capitalize whitespace-nowrap">
                    {item.category} · {item.subcategory}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular whitespace-nowrap">
                    <span className="font-bold text-[#0A0A0A]">
                      {formatPrice(item.discountPrice ?? item.price)}
                    </span>
                    {item.discountPrice !== null && (
                      <span className="ml-2 text-xs text-[#8C8982] line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold whitespace-nowrap">
                    {item.stockStatus === 'in_stock' ? (
                      <span className="text-[#1B7A43]">In Stock</span>
                    ) : (
                      <span className="text-[#C62828]">Out of Stock</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                    {item.hotSelling ? (
                      <span className="text-[#9E7B32] font-bold">Hot Selling</span>
                    ) : (
                      <span className="text-[#686662]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0A0A0A] bg-[#F6F5F0] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] rounded-none transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#C62828] bg-[#FFEBEE] hover:bg-[#C62828] hover:text-white border border-[#C62828] rounded-none transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-[#52514E]">
                    No products match your current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-4">
              <h2
                id="product-modal-title"
                className="font-display text-2xl font-extrabold text-[#0A0A0A]"
              >
                {editingProduct ? '"EDIT PRODUCT"' : '"ADD NEW PRODUCT"'}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#52514E] hover:text-[#0A0A0A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A0A0A]">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={VALIDATION_LIMITS.NAME_MAX}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monochrome Low-Top Leather Sneakers"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Regular Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={VALIDATION_LIMITS.PRICE_MAX}
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] font-mono-tabular"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Discount Price (GH₵, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={VALIDATION_LIMITS.PRICE_MAX}
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Leave blank if no discount"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Subcategory *
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  >
                    {SUBCATEGORIES[category].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A0A0A]">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, fit, and styling details..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Sizes (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="e.g. 40, 41, 42, 43 or S, M, L, XL"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Colors (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="e.g. Black, Gold, Bone White"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Stock Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="pt-5">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hotSelling}
                      onChange={(e) => setHotSelling(e.target.checked)}
                      className="w-4 h-4 accent-[#0A0A0A]"
                    />
                    <span className="text-sm font-bold text-[#0A0A0A]">
                      Feature in Hot Selling section
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 border-t border-[#0A0A0A] pt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0A0A0A]">
                    Product Images ({images.length}/{VALIDATION_LIMITS.IMAGES_MAX})
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] rounded-none cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingFiles ? 'Uploading...' : '"UPLOAD IMAGES"'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingFiles}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlDraft}
                    onChange={(e) => setImageUrlDraft(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="flex-1 px-3.5 py-2 text-xs bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 text-xs font-bold bg-[#F6F5F0] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] text-[#0A0A0A] border border-[#0A0A0A] rounded-none whitespace-nowrap"
                  >
                    Add URL
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                    {images.map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="relative aspect-square bg-[#EAE8E1] border border-[#0A0A0A] rounded-none overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Upload preview ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          aria-label="Remove image"
                          className="absolute top-1 right-1 w-6 h-6 bg-[#0A0A0A] text-[#F6F5F0] flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0A0A0A]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#0A0A0A] bg-[#F6F5F0] border border-[#0A0A0A] rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct || uploadingFiles}
                  className="px-6 py-2.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] disabled:opacity-50 rounded-none"
                >
                  {savingProduct
                    ? 'Saving...'
                    : editingProduct
                    ? '"UPDATE PRODUCT"'
                    : '"SAVE PRODUCT"'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-none w-full max-w-md p-6 sm:p-7 space-y-5">
            <h2
              id="delete-confirm-title"
              className="font-display text-2xl font-extrabold text-[#0A0A0A]"
            >
              "CONFIRM DELETION"
            </h2>
            <p className="text-sm text-[#3D3C39]">
              Are you sure you want to delete this product?{' '}
              <strong className="text-[#0A0A0A]">"{productToDelete.name}"</strong> will
              be permanently removed from the catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 text-xs font-bold text-[#0A0A0A] bg-[#F6F5F0] border border-[#0A0A0A] rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold tracking-wider bg-[#C62828] hover:bg-[#B71C1C] text-white border border-[#0A0A0A] rounded-none"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal Dialog */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-password-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-none w-full max-w-md p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-3">
              <h2
                id="change-password-title"
                className="font-display text-xl font-extrabold text-[#0A0A0A]"
              >
                "CHANGE PASSWORD"
              </h2>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#52514E] hover:text-[#0A0A0A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A0A0A]">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A0A0A]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#0A0A0A] bg-[#F6F5F0] border border-[#0A0A0A] rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-5 py-2.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] rounded-none"
                >
                  {updatingPassword ? 'Updating...' : '"UPDATE PASSWORD"'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
