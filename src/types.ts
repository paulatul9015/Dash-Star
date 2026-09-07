export type ProductCategory = 'Cars' | 'EV' | 'Ride Ons' | 'Scooters' | 'Trikes' | 'Walkers';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  ageRange: string;
  batterySpec?: string;
  maxWeightKg: number;
  colors: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isSpotlight?: boolean;
  description: string;
  features: string[];
  dimensions: string;
  image: string;
  gallery?: string[];
  tags: string[];
  safetyCertifications: string[];
  material: string;
  bisCode: string;
  // ML analytics metadata
  salesVelocityPerMonth: number;
  predictedDemandNextMonth: number;
  sentimentSummary?: {
    positiveRatio: number;
    topPraises: string[];
    topConcerns: string[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  sentimentScore: number; // 0 to 1
  aspects: {
    battery?: 'positive' | 'negative' | 'neutral';
    assembly?: 'positive' | 'negative' | 'neutral';
    durability?: 'positive' | 'negative' | 'neutral';
    safety?: 'positive' | 'negative' | 'neutral';
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedProducts?: Product[];
  actionType?: 'filter' | 'view_product' | 'track_order' | 'b2b_enquiry';
}

export interface AISearchParsedFilters {
  category?: ProductCategory;
  maxPrice?: number;
  minPrice?: number;
  ageGroup?: string;
  color?: string;
  features?: string[];
  intentSummary: string;
}

export interface MLForecastData {
  sku: string;
  productName: string;
  historicalMonthly: { month: string; units: number }[];
  predictedNext3Months: { month: string; predictedUnits: number; lowerBound: number; upperBound: number }[];
  seasonalFactor: string;
  reorderAlert: boolean;
  recommendedSafetyStock: number;
}

export interface RFMCustomerSegment {
  segmentName: 'Champions' | 'Loyal Customers' | 'Potential Loyalists' | 'At Risk' | 'Price Sensitive';
  description: string;
  customerPercentage: number;
  averageOrderValue: number;
  recommendedAction: string;
  suggestedPromotion: string;
}

export interface DynamicPricingInsight {
  sku: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  currentInventory: number;
  daysOfInventory: number;
  elasticityCoefficient: number;
  recommendedDiscount: number;
  projectedRevenueLiftPercent: number;
  rationale: string;
}
