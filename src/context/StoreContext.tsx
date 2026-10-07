import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updatePassword,
  User,
} from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  Product,
  ProductInput,
  VALIDATION_LIMITS,
  SUBCATEGORIES,
} from '../types';
import { INITIAL_SEED_PRODUCTS, BRAND_ASSETS } from '../data/seedProducts';

interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'error' | 'info';
}

interface RegisteredAccount {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface ActiveLocalSession {
  name: string;
  email: string;
}

interface StoreContextValue {
  products: Product[];
  loadingProducts: boolean;
  isUsingSeedFallback: boolean;
  backgroundImage: string;
  updateBackgroundImage: (file: File) => Promise<void>;
  resetBackgroundImage: () => void;
  user: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  currentUserEmail: string | null;
  currentUserName: string | null;
  adminEmail: string | null;
  authLoading: boolean;
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ role: 'admin' | 'user' }>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ role: 'admin' | 'user' }>;
  loginWithGoogle: () => Promise<{ role: 'admin' | 'user' }>;
  logout: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (newPassword: string) => Promise<void>;
  addProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedCatalogToFirestore: () => Promise<void>;
  syncAllToFirestore: () => Promise<void>;
  firestoreProductCount: number;
  uploadProductImage: (file: File) => Promise<string>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const LOCAL_PRODUCTS_STORAGE_KEY = 'mrj_collections_catalog_v1';
const LOCAL_ADMIN_SESSION_KEY = 'mrj_collections_admin_session_v1';
const LOCAL_ADMIN_PASS_KEY = 'mrj_collections_admin_pass_v1';
const LOCAL_BG_STORAGE_KEY = 'mrj_collections_bg_v1';
const LOCAL_REGISTERED_USERS_KEY = 'mrj_collections_registered_users_v1';
const LOCAL_USER_SESSION_KEY = 'mrj_collections_user_session_v1';

const ADMIN_EMAILS = ['admin@mrjcollections.com', 'amiri3x3@gmail.com'];

export function isEmailAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

function sanitizeProductInput(input: ProductInput): ProductInput {
  const category = ['male', 'female', 'unisex'].includes(input.category)
    ? input.category
    : 'unisex';
  const validSubcategories = SUBCATEGORIES[category];
  const subcategory = (input.subcategory || validSubcategories[0])
    .trim()
    .slice(0, VALIDATION_LIMITS.SUBCATEGORY_MAX);

  const cleanImages = (input.images || [])
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .slice(0, VALIDATION_LIMITS.IMAGES_MAX);

  const cleanSizes =
    input.sizes && input.sizes.length > 0
      ? input.sizes
          .map((s) => s.trim().slice(0, 40))
          .filter((s) => s.length > 0)
          .slice(0, VALIDATION_LIMITS.SIZES_MAX)
      : null;

  const cleanColors =
    input.colors && input.colors.length > 0
      ? input.colors
          .map((c) => c.trim().slice(0, 40))
          .filter((c) => c.length > 0)
          .slice(0, VALIDATION_LIMITS.COLORS_MAX)
      : null;

  const price = Math.max(
    0,
    Math.min(VALIDATION_LIMITS.PRICE_MAX, Number(input.price) || 0)
  );
  const discountPrice =
    input.discountPrice !== null &&
    input.discountPrice !== undefined &&
    Number(input.discountPrice) > 0
      ? Math.max(
          0,
          Math.min(VALIDATION_LIMITS.PRICE_MAX, Number(input.discountPrice))
        )
      : null;

  return {
    name: input.name.trim().slice(0, VALIDATION_LIMITS.NAME_MAX) || 'Untitled Item',
    price,
    discountPrice,
    category,
    subcategory: subcategory || validSubcategories[0],
    description:
      input.description.trim().slice(0, VALIDATION_LIMITS.DESCRIPTION_MAX) ||
      'Quality fashion item from Mr. J Collections in Tarkwa.',
    images:
      cleanImages.length > 0
        ? cleanImages
        : [INITIAL_SEED_PRODUCTS[0].images[0]],
    sizes: cleanSizes && cleanSizes.length > 0 ? cleanSizes : null,
    colors: cleanColors && cleanColors.length > 0 ? cleanColors : null,
    stockStatus:
      input.stockStatus === 'out_of_stock' ? 'out_of_stock' : 'in_stock',
    hotSelling: Boolean(input.hotSelling),
  };
}

function formatFirestoreTimestamp(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (val && typeof val === 'object' && 'seconds' in val) {
    const sec = (val as { seconds: number }).seconds;
    return new Date(sec * 1000).toISOString();
  }
  if (typeof val === 'string') {
    return val;
  }
  return new Date().toISOString();
}

async function compressFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const renderScaled = (maxDim: number, quality: number): string => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return (event.target?.result as string) || '';
          }
          ctx.drawImage(img, 0, 0, width, height);
          return canvas.toDataURL('image/jpeg', quality);
        };

        // Pass 1: crisp 750px at 0.72 quality (~80-140KB)
        let output = renderScaled(750, 0.72);
        // Pass 2: if high density and string > 220,000 chars, scale to 620px at 0.62 quality
        if (output.length > 220000) {
          output = renderScaled(620, 0.62);
        }
        // Pass 3: emergency safety cap for huge photographic details
        if (output.length > 350000) {
          output = renderScaled(500, 0.52);
        }
        resolve(output);
      };
      img.onerror = () => reject(new Error('Failed to decode image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [hasLocalEdits, setHasLocalEdits] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(LOCAL_PRODUCTS_STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const [localProducts, setLocalProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SEED_PRODUCTS;
  });

  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [localAdminEmail, setLocalAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    } catch {
      return null;
    }
  });
  const [localUserSession, setLocalUserSession] =
    useState<ActiveLocalSession | null>(() => {
      try {
        const raw = localStorage.getItem(LOCAL_USER_SESSION_KEY);
        if (raw) {
          return JSON.parse(raw) as ActiveLocalSession;
        }
      } catch {
        // ignore
      }
      return null;
    });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>(() => {
    try {
      const savedBg = localStorage.getItem(LOCAL_BG_STORAGE_KEY);
      if (savedBg && savedBg.trim().length > 0) {
        return savedBg;
      }
    } catch {
      // ignore storage errors
    }
    return BRAND_ASSETS.backgroundBanner;
  });

  const showToast = useCallback(
    (title: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateBackgroundImage = useCallback(
    async (file: File) => {
      const dataUrl = await compressFileToDataUrl(file);
      setBackgroundImage(dataUrl);
      try {
        localStorage.setItem(LOCAL_BG_STORAGE_KEY, dataUrl);
      } catch {
        // ignore quota errors
      }
      try {
        await setDoc(doc(db, 'settings', 'store'), {
          backgroundImage: dataUrl,
          updatedAt: serverTimestamp(),
        });
        showToast('Background banner saved live for all visitors!');
      } catch (err: unknown) {
        showToast('Background banner updated (cloud sync pending)', 'info');
      }
    },
    [showToast]
  );

  const resetBackgroundImage = useCallback(async () => {
    setBackgroundImage(BRAND_ASSETS.backgroundBanner);
    try {
      localStorage.removeItem(LOCAL_BG_STORAGE_KEY);
      await deleteDoc(doc(db, 'settings', 'store'));
    } catch {
      // ignore
    }
    showToast('Restored default streetwear background', 'info');
  }, [showToast]);

  // Listen to Firestore /settings/store for real-time background banner changes
  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'store'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.backgroundImage && typeof data.backgroundImage === 'string') {
            setBackgroundImage(data.backgroundImage);
            try {
              localStorage.setItem(LOCAL_BG_STORAGE_KEY, data.backgroundImage);
            } catch {
              // ignore
            }
          }
        }
      },
      () => {
        // keep local fallback if offline
      }
    );
    return () => unsubSettings();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore /products collection
  useEffect(() => {
    const path = 'products';
    const productsQuery = collection(db, path);
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ''),
            price: Number(data.price || 0),
            discountPrice:
              data.discountPrice !== null && data.discountPrice !== undefined
                ? Number(data.discountPrice)
                : null,
            category:
              data.category === 'male' ||
              data.category === 'female' ||
              data.category === 'unisex'
                ? data.category
                : 'unisex',
            subcategory: String(data.subcategory || ''),
            description: String(data.description || ''),
            images: Array.isArray(data.images) ? data.images.map(String) : [],
            sizes: Array.isArray(data.sizes) ? data.sizes.map(String) : null,
            colors: Array.isArray(data.colors) ? data.colors.map(String) : null,
            stockStatus:
              data.stockStatus === 'out_of_stock' ? 'out_of_stock' : 'in_stock',
            hotSelling: Boolean(data.hotSelling),
            createdAt: formatFirestoreTimestamp(data.createdAt),
            updatedAt: formatFirestoreTimestamp(data.updatedAt),
          };
        });

        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFirestoreProducts(items);
        setLoadingProducts(false);

        // Auto-seed initial catalog into Cloud Firestore if collection is empty
        if (snapshot.empty && items.length === 0) {
          (async () => {
            try {
              for (const item of INITIAL_SEED_PRODUCTS) {
                const sanitized = sanitizeProductInput(item);
                await setDoc(doc(db, 'products', item.id), {
                  ...sanitized,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
              }
            } catch {
              // ignore
            }
          })();
        }
      },
      (error) => {
        setLoadingProducts(false);
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch {
          // Structured error logged via handleFirestoreError; keep fallback catalog active
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const saveLocalProducts = useCallback((next: Product[]) => {
    setLocalProducts(next);
    setHasLocalEdits(true);
    try {
      localStorage.setItem(LOCAL_PRODUCTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }, []);

  const currentUserEmail =
    user?.email || localAdminEmail || localUserSession?.email || null;
  const currentUserName =
    user?.displayName ||
    localUserSession?.name ||
    (isEmailAdmin(currentUserEmail) ? 'Administrator' : null);

  const isAuthenticated = Boolean(user || localAdminEmail || localUserSession);
  const isAdminAuthenticated = Boolean(
    (user && isEmailAdmin(user.email)) ||
      (localAdminEmail && isEmailAdmin(localAdminEmail)) ||
      (localUserSession && isEmailAdmin(localUserSession.email))
  );
  const adminEmail = isAdminAuthenticated ? currentUserEmail : null;
  const canWriteToFirestore = isAdminAuthenticated;

  // Automatically sync any locally created admin products to Cloud Firestore so all visitors see them
  useEffect(() => {
    if (!canWriteToFirestore || loadingProducts) return;
    const firestoreIds = new Set(firestoreProducts.map((p) => p.id));
    const unsynced = localProducts.filter(
      (p) =>
        !firestoreIds.has(p.id) &&
        (hasLocalEdits || firestoreProducts.length === 0)
    );
    if (unsynced.length === 0) return;

    let cancelled = false;
    (async () => {
      for (const item of unsynced) {
        if (cancelled) break;
        try {
          const sanitized = sanitizeProductInput(item);
          await setDoc(doc(db, 'products', item.id), {
            ...sanitized,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch {
          // ignore individual sync errors
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    canWriteToFirestore,
    loadingProducts,
    firestoreProducts,
    localProducts,
    hasLocalEdits,
  ]);

  const getLocalRegisteredAccounts = useCallback((): RegisteredAccount[] => {
    try {
      const saved = localStorage.getItem(LOCAL_REGISTERED_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }, []);

  const saveLocalRegisteredAccount = useCallback(
    (account: RegisteredAccount) => {
      const existing = getLocalRegisteredAccounts().filter(
        (u) => u.email.toLowerCase() !== account.email.toLowerCase()
      );
      const updated = [account, ...existing];
      try {
        localStorage.setItem(
          LOCAL_REGISTERED_USERS_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
    },
    [getLocalRegisteredAccounts]
  );

  const activateLocalSession = useCallback(
    (name: string, email: string) => {
      const normalized = email.trim().toLowerCase();
      const session: ActiveLocalSession = {
        name: name.trim() || normalized.split('@')[0],
        email: normalized,
      };
      setLocalUserSession(session);
      try {
        localStorage.setItem(LOCAL_USER_SESSION_KEY, JSON.stringify(session));
      } catch {
        // ignore
      }
      if (isEmailAdmin(normalized)) {
        setLocalAdminEmail(normalized);
        try {
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, normalized);
        } catch {
          // ignore
        }
      } else {
        setLocalAdminEmail(null);
        try {
          localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
        } catch {
          // ignore
        }
      }
    },
    []
  );

  const registerWithEmail = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ role: 'admin' | 'user' }> => {
      const normalizedEmail = email.trim().toLowerCase();
      const cleanName = name.trim() || normalizedEmail.split('@')[0];
      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const role: 'admin' | 'user' = isEmailAdmin(normalizedEmail)
        ? 'admin'
        : 'user';

      saveLocalRegisteredAccount({
        name: cleanName,
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      });

      if (normalizedEmail === 'admin@mrjcollections.com') {
        try {
          localStorage.setItem(LOCAL_ADMIN_PASS_KEY, password);
        } catch {
          // ignore
        }
      }

      activateLocalSession(cleanName, normalizedEmail);

      if (role === 'admin') {
        showToast(`Signed in as ${normalizedEmail}`);
      } else {
        showToast(`Welcome to Mr. J Collections, ${cleanName}!`);
      }

      return { role };
    },
    [activateLocalSession, saveLocalRegisteredAccount, showToast]
  );

  const loginWithEmail = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ role: 'admin' | 'user' }> => {
      const normalizedEmail = email.trim().toLowerCase();
      const role: 'admin' | 'user' = isEmailAdmin(normalizedEmail)
        ? 'admin'
        : 'user';

      // 1. Check seeded admin credentials first (zero failed network calls)
      const expectedSeedPass =
        localStorage.getItem(LOCAL_ADMIN_PASS_KEY) || 'Joe123collections';
      if (
        normalizedEmail === 'admin@mrjcollections.com' &&
        password === expectedSeedPass
      ) {
        activateLocalSession('Administrator', normalizedEmail);
        showToast('Signed in to Admin Dashboard');
        return { role: 'admin' };
      }

      // 2. Check registered accounts (Users or Admins registered via Sign Up form)
      const registeredAccounts = getLocalRegisteredAccounts();
      const matchedAccount = registeredAccounts.find(
        (acc) =>
          acc.email.toLowerCase() === normalizedEmail &&
          acc.password === password
      );

      if (matchedAccount) {
        activateLocalSession(matchedAccount.name, matchedAccount.email);
        showToast(
          role === 'admin'
            ? 'Signed in to Admin Dashboard'
            : `Welcome back, ${matchedAccount.name}!`
        );
        return { role };
      }

      throw new Error(
        'Invalid email or password. Please check your credentials or switch to "SIGN UP" to create a new account.'
      );
    },
    [activateLocalSession, getLocalRegisteredAccounts, showToast]
  );

  const loginWithGoogle = useCallback(async (): Promise<{
    role: 'admin' | 'user';
  }> => {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user?.email || '';
    const name = result.user?.displayName || email.split('@')[0] || 'Member';
    const role: 'admin' | 'user' = isEmailAdmin(email) ? 'admin' : 'user';
    if (email) {
      activateLocalSession(name, email);
    }
    showToast(
      role === 'admin'
        ? `Signed in to Admin Dashboard`
        : `Signed in as ${name}`
    );
    return { role };
  }, [activateLocalSession, showToast]);

  const logout = useCallback(async () => {
    if (user) {
      await signOut(auth);
    }
    setLocalAdminEmail(null);
    setLocalUserSession(null);
    try {
      localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
      localStorage.removeItem(LOCAL_USER_SESSION_KEY);
    } catch {
      // ignore
    }
    showToast('Signed out successfully', 'info');
  }, [user, showToast]);

  const logoutAdmin = logout;

  const changeAdminPassword = useCallback(
    async (newPassword: string) => {
      if (newPassword.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (
        auth.currentUser &&
        auth.currentUser.providerData.some((p) => p.providerId === 'password')
      ) {
        await updatePassword(auth.currentUser, newPassword.trim());
      }
      try {
        localStorage.setItem(LOCAL_ADMIN_PASS_KEY, newPassword.trim());
      } catch {
        // ignore
      }
      showToast('Admin password updated successfully');
    },
    [showToast]
  );

  const uploadProductImage = useCallback(async (file: File): Promise<string> => {
    return await compressFileToDataUrl(file);
  }, []);

  const seedCatalogToFirestore = useCallback(async () => {
    if (!canWriteToFirestore) {
      saveLocalProducts(INITIAL_SEED_PRODUCTS);
      showToast('Sample catalog restored');
      return;
    }

    const path = 'products';
    try {
      for (const item of INITIAL_SEED_PRODUCTS) {
        const sanitized = sanitizeProductInput(item);
        const docRef = doc(db, path, item.id);
        await setDoc(docRef, {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      showToast('Seeded sample catalog to Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }, [canWriteToFirestore, saveLocalProducts, showToast]);

  const activeCatalog =
    firestoreProducts.length > 0 ? firestoreProducts : localProducts;

  const addProduct = useCallback(
    async (input: ProductInput) => {
      const sanitized = sanitizeProductInput(input);
      const docId = `prod-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const nowIso = new Date().toISOString();

      const newProduct: Product = {
        id: docId,
        ...sanitized,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Always keep local catalog in sync optimistically
      saveLocalProducts([newProduct, ...activeCatalog]);

      const path = `products/${docId}`;
      try {
        await setDoc(doc(db, 'products', docId), {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showToast(`Published "${sanitized.name}" live & permanent!`);
      } catch (error) {
        showToast(`Saved locally (Cloud sync: ${error instanceof Error ? error.message : 'pending'})`, 'info');
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [activeCatalog, saveLocalProducts, showToast]
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput) => {
      if (!VALIDATION_LIMITS.ID_PATTERN.test(id)) {
        throw new Error('Invalid product ID format.');
      }
      const sanitized = sanitizeProductInput(input);
      const nowIso = new Date().toISOString();

      const updatedList = activeCatalog.map((item) =>
        item.id === id
          ? {
              ...item,
              ...sanitized,
              updatedAt: nowIso,
            }
          : item
      );
      saveLocalProducts(updatedList);

      const path = `products/${id}`;
      try {
        if (firestoreProducts.some((item) => item.id === id)) {
          await updateDoc(doc(db, 'products', id), {
            ...sanitized,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(doc(db, 'products', id), {
            ...sanitized,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        showToast(`Updated "${sanitized.name}" live & permanent!`);
      } catch (error) {
        showToast(`Updated locally (Cloud sync: ${error instanceof Error ? error.message : 'pending'})`, 'info');
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [
      firestoreProducts,
      activeCatalog,
      saveLocalProducts,
      showToast,
    ]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!VALIDATION_LIMITS.ID_PATTERN.test(id)) {
        throw new Error('Invalid product ID format.');
      }
      const target = activeCatalog.find((item) => item.id === id);
      const filtered = activeCatalog.filter((item) => item.id !== id);
      saveLocalProducts(filtered);

      const path = `products/${id}`;
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast(
          target ? `Deleted "${target.name}" permanently from Cloud` : 'Product deleted from catalog'
        );
      } catch (error) {
        showToast(`Deleted locally (Cloud sync: ${error instanceof Error ? error.message : 'pending'})`, 'info');
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    },
    [activeCatalog, saveLocalProducts, showToast]
  );

  const syncAllToFirestore = useCallback(async () => {
    let synced = 0;
    const path = 'products';
    for (const item of activeCatalog) {
      try {
        const sanitized = sanitizeProductInput(item);
        await setDoc(doc(db, path, item.id), {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        synced++;
      } catch (err) {
        console.error('Error syncing item to cloud:', item.id, err);
      }
    }
    showToast(`Successfully synced ${synced} products live to Cloud Firestore!`);
  }, [activeCatalog, showToast]);

  const products = activeCatalog;
  const isUsingSeedFallback = firestoreProducts.length === 0;

  return (
    <StoreContext.Provider
      value={{
        products,
        loadingProducts,
        isUsingSeedFallback,
        backgroundImage,
        updateBackgroundImage,
        resetBackgroundImage,
        user,
        isAuthenticated,
        isAdminAuthenticated,
        currentUserEmail,
        currentUserName,
        adminEmail,
        authLoading,
        toasts,
        showToast,
        dismissToast,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        logoutAdmin,
        changeAdminPassword,
        addProduct,
        updateProduct,
        deleteProduct,
        seedCatalogToFirestore,
        syncAllToFirestore,
        firestoreProductCount: firestoreProducts.length,
        uploadProductImage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
