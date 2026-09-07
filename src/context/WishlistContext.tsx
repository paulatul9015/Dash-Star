import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => Promise<boolean>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  isLoading: boolean;
}

const LOCAL_STORAGE_KEY = 'dashstar_guest_wishlist';

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  wishlistProducts: [],
  wishlistCount: 0,
  toggleWishlist: async () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearWishlist: async () => {},
  isWishlisted: () => false,
  isLoading: false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      return local ? JSON.parse(local) : ['prod-001', 'prod-004'];
    } catch {
      return ['prod-001', 'prod-004'];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      // Save to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistIds));
      } catch (e) {
        console.warn('Failed to save wishlist to local storage:', e);
      }
      return;
    }

    setIsLoading(true);
    const wishlistCollectionPath = `users/${user.uid}/wishlist`;
    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');

    const unsubscribe = onSnapshot(
      wishlistRef,
      (snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        setWishlistIds(ids);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, wishlistCollectionPath);
        } catch (e) {
          console.warn('Firestore wishlist snapshot error:', e);
        }
      }
    );

    // Initial migration of local guest items to Firestore
    const syncLocalToFirestore = async () => {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        const localIds: string[] = local ? JSON.parse(local) : [];
        if (localIds.length > 0) {
          for (const prodId of localIds) {
            const product = PRODUCTS.find((p) => p.id === prodId);
            if (product) {
              const itemDoc = doc(db, 'users', user.uid, 'wishlist', prodId);
              await setDoc(itemDoc, {
                id: prodId,
                userId: user.uid,
                productId: prodId,
                productName: product.name,
                productPrice: product.price,
                productImage: product.image,
                productCategory: product.category,
                addedAt: new Date().toISOString(),
              });
            }
          }
        }
      } catch (err) {
        console.warn('Error syncing guest wishlist to cloud:', err);
      }
    };
    syncLocalToFirestore();

    return () => unsubscribe();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (wishlistIds.includes(productId)) return;

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    if (user) {
      const docPath = `users/${user.uid}/wishlist/${productId}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'wishlist', productId), {
          id: productId,
          userId: user.uid,
          productId,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          productCategory: product.category,
          addedAt: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, docPath);
      }
    } else {
      setWishlistIds((prev) => {
        const updated = [...prev, productId];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      const docPath = `users/${user.uid}/wishlist/${productId}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      setWishlistIds((prev) => {
        const updated = prev.filter((id) => id !== productId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    const exists = wishlistIds.includes(productId);
    if (exists) {
      await removeFromWishlist(productId);
      return false; // Removed
    } else {
      await addToWishlist(productId);
      return true; // Added
    }
  };

  const clearWishlist = async () => {
    if (user) {
      try {
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'wishlist'));
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/wishlist`);
      }
    } else {
      setWishlistIds([]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const wishlistProducts = wishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
