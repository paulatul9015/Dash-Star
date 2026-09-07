import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { CustomerReview } from '../types';
import { MOCK_REVIEWS } from '../data/products';

interface NewReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  aspects?: {
    battery?: 'positive' | 'negative' | 'neutral';
    assembly?: 'positive' | 'negative' | 'neutral';
    durability?: 'positive' | 'negative' | 'neutral';
    safety?: 'positive' | 'negative' | 'neutral';
  };
}

interface ReviewContextType {
  reviews: CustomerReview[];
  getReviewsForProduct: (productId: string) => CustomerReview[];
  getProductRatingStats: (productId: string) => { averageRating: number; reviewCount: number };
  addReview: (input: NewReviewInput) => Promise<void>;
  userPurchasedProductIds: string[];
  recordPurchase: (productIds: string[], totalAmount: number) => Promise<void>;
  isVerifiedPurchaser: (productId: string) => boolean;
  isLoading: boolean;
}

const ReviewContext = createContext<ReviewContextType>({
  reviews: [],
  getReviewsForProduct: () => [],
  getProductRatingStats: () => ({ averageRating: 4.8, reviewCount: 0 }),
  addReview: async () => {},
  userPurchasedProductIds: [],
  recordPurchase: async () => {},
  isVerifiedPurchaser: () => false,
  isLoading: false,
});

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [firestoreReviews, setFirestoreReviews] = useState<CustomerReview[]>([]);
  const [userPurchasedProductIds, setUserPurchasedProductIds] = useState<string[]>(['prod-001', 'prod-004']);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to all public reviews from Firestore
  useEffect(() => {
    setIsLoading(true);
    const reviewsPath = 'reviews';
    const reviewsRef = collection(db, reviewsPath);

    const unsubscribe = onSnapshot(
      reviewsRef,
      (snapshot) => {
        const liveReviews: CustomerReview[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            productId: data.productId,
            userId: data.userId,
            userName: data.userName || 'Verified Buyer',
            rating: Number(data.rating) || 5,
            date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            title: data.title || 'Exceptional Quality',
            comment: data.comment || '',
            verifiedPurchase: Boolean(data.verifiedPurchase),
            sentimentScore: data.sentimentScore ?? 0.95,
            aspects: data.aspects || {},
          };
        });
        setFirestoreReviews(liveReviews);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, reviewsPath);
        } catch (e) {
          console.warn('Firestore reviews snapshot error:', e);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to user orders to populate verified purchase history
  useEffect(() => {
    if (!user) return;

    const ordersPath = `users/${user.uid}/orders`;
    const ordersRef = collection(db, 'users', user.uid, 'orders');

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const purchasedIds = new Set<string>(['prod-001', 'prod-004']);
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (Array.isArray(data.productIds)) {
            data.productIds.forEach((pid: string) => purchasedIds.add(pid));
          }
        });
        setUserPurchasedProductIds(Array.from(purchasedIds));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, ordersPath);
        } catch (e) {
          console.warn('Firestore user orders snapshot error:', e);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Combine seeded base reviews with Firestore reviews
  const allReviews: CustomerReview[] = React.useMemo(() => {
    const firestoreIds = new Set(firestoreReviews.map((r) => r.id));
    const merged = [...firestoreReviews];
    MOCK_REVIEWS.forEach((mock) => {
      if (!firestoreIds.has(mock.id)) {
        merged.push(mock);
      }
    });
    return merged;
  }, [firestoreReviews]);

  const getReviewsForProduct = (productId: string): CustomerReview[] => {
    return allReviews.filter((r) => r.productId === productId);
  };

  const getProductRatingStats = (productId: string) => {
    const productReviews = getReviewsForProduct(productId);
    if (productReviews.length === 0) {
      return { averageRating: 4.8, reviewCount: 0 };
    }
    const sum = productReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = Math.round((sum / productReviews.length) * 10) / 10;
    return {
      averageRating: avg,
      reviewCount: productReviews.length,
    };
  };

  const isVerifiedPurchaser = (productId: string): boolean => {
    return userPurchasedProductIds.includes(productId);
  };

  const addReview = async (input: NewReviewInput) => {
    const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const isVerified = isVerifiedPurchaser(input.productId);
    const reviewerName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Toy Enthusiast');
    const reviewerId = user?.uid || 'guest-user-' + Math.random().toString(36).substring(2, 6);

    const newReviewDoc = {
      id: reviewId,
      productId: input.productId,
      userId: user?.uid || reviewerId,
      userName: reviewerName,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      verifiedPurchase: isVerified,
      aspects: input.aspects || {},
      sentimentScore: input.rating >= 4 ? 0.95 : input.rating === 3 ? 0.5 : 0.2,
      createdAt: new Date().toISOString(),
    };

    if (user) {
      const docPath = `reviews/${reviewId}`;
      try {
        await setDoc(doc(db, 'reviews', reviewId), newReviewDoc);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, docPath);
      }
    } else {
      // Local fallback for guest user if not signed in
      const guestReview: CustomerReview = {
        ...newReviewDoc,
        date: 'Today',
      };
      setFirestoreReviews((prev) => [guestReview, ...prev]);
    }
  };

  const recordPurchase = async (productIds: string[], totalAmount: number) => {
    const orderId = 'order_' + Date.now();
    setUserPurchasedProductIds((prev) => Array.from(new Set([...prev, ...productIds])));

    if (user) {
      const orderDocPath = `users/${user.uid}/orders/${orderId}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'orders', orderId), {
          id: orderId,
          userId: user.uid,
          orderNumber: 'DS-' + Math.floor(100000 + Math.random() * 900000),
          productIds,
          totalAmount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, orderDocPath);
      }
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews: allReviews,
        getReviewsForProduct,
        getProductRatingStats,
        addReview,
        userPurchasedProductIds,
        recordPurchase,
        isVerifiedPurchaser,
        isLoading,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);
