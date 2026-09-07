-- =========================================================================
-- Dash Star - Supabase pgvector Extension & Hybrid Search Schema
-- =========================================================================

-- 1. Enable the pgvector extension to work with product embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create products table with vector embedding column (768 dimensions for Gemini embedding)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percent INT DEFAULT 0,
  colors TEXT[] DEFAULT '{}',
  age_range TEXT,
  features TEXT[] DEFAULT '{}',
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  image TEXT,
  embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create high-performance HNSW vector index for cosine similarity searches
CREATE INDEX IF NOT EXISTS products_embedding_hnsw_idx 
ON products 
USING hnsw (embedding vector_cosine_ops);

-- Index frequently filtered relational columns for fast combined SQL evaluation
CREATE INDEX IF NOT EXISTS idx_products_category ON products (LOWER(category));
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);

-- 4. Stored Procedure: Hybrid Search (Vector Cosine Distance + SQL Filter Constraints)
CREATE OR REPLACE FUNCTION hybrid_search_products(
  query_embedding VECTOR(768),
  filter_category TEXT DEFAULT NULL,
  filter_max_price NUMERIC DEFAULT NULL,
  filter_min_price NUMERIC DEFAULT NULL,
  filter_color TEXT DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.20,
  match_count INT DEFAULT 12
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  category TEXT,
  price NUMERIC,
  original_price NUMERIC,
  discount_percent INT,
  colors TEXT[],
  age_range TEXT,
  features TEXT[],
  description TEXT,
  specifications JSONB,
  rating NUMERIC,
  review_count INT,
  image TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.category,
    p.price,
    p.original_price,
    p.discount_percent,
    p.colors,
    p.age_range,
    p.features,
    p.description,
    p.specifications,
    p.rating,
    p.review_count,
    p.image,
    (1 - (p.embedding <=> query_embedding))::FLOAT AS similarity
  FROM products p
  WHERE
    -- SQL Relational Constraint Filters (extracted via LLM)
    (filter_category IS NULL OR LOWER(p.category) = LOWER(filter_category))
    AND (filter_max_price IS NULL OR p.price <= filter_max_price)
    AND (filter_min_price IS NULL OR p.price >= filter_min_price)
    AND (
      filter_color IS NULL
      OR EXISTS (
        SELECT 1 FROM unnest(p.colors) c WHERE LOWER(c) LIKE '%' || LOWER(filter_color) || '%'
      )
      OR LOWER(p.description) LIKE '%' || LOWER(filter_color) || '%'
      OR LOWER(p.name) LIKE '%' || LOWER(filter_color) || '%'
    )
    -- Vector Cosine Similarity Threshold
    AND (1 - (p.embedding <=> query_embedding)) >= match_threshold
  ORDER BY (1 - (p.embedding <=> query_embedding)) DESC
  LIMIT match_count;
END;
$$;
