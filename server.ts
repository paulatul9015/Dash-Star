import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { executeHybridSearch, StructuredFilters, getSupabaseClient } from './src/server/supabaseVectorService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. AI Shopping Assistant "StarBot"
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], productContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message is required' });
    }

    const ai = getGenAI();
    const systemPrompt = `You are "StarBot", the expert AI Ride-On Toy Consultant & Shopping Assistant for "Dash Star" (dashstartoys.com) — India's premier manufacturer of kids' ride-on toys, electric vehicles (EVs), kick & tilt scooters, 3-in-1 trikes, baby walkers, and swing cars since the 1980s.

Company & Product Knowledge:
- Factory & Headquarters: 18/38, Sahibabad Industrial Area Site-4, Ghaziabad, Uttar Pradesh - 201010.
- Certifications: ISO 9001:2015 certified, Bureau of Indian Standards (BIS IS 9873 compliant), non-toxic virgin ABS/PP plastics.
- Phones: +91-9599811712, +91-9599811713, Email: sales.dashstar@gmail.com
- Catalog Products (IDs and details):
  1. ID: "ducatti-01" | Name: DUCATTI | Category: EV | ₹5,630 | 12V Superbike, age 3-8, training wheels, engine sounds, LED lights, dual motor.
  2. ID: "humr-ev-02" | Name: HUMR EV | Category: EV | ₹3,965 | 12V 4x4 Off-roader Jeep, age 2-7, 2.4G parental remote + manual pedal.
  3. ID: "bunny-03" | Name: BUNNY | Category: Ride Ons | ₹2,365 | Magic Swing/Twist Car, age 1.5-5, no battery/pedals needed, silent PU wheels, 65kg payload.
  4. ID: "smart-04" | Name: SMART | Category: Ride Ons | ₹2,655 | 3-in-1 Push Ride-On & Stroller, age 1-4, parent steering handle, guard rail.
  5. ID: "noddy-05" | Name: NODDY | Category: Scooters | ₹2,275 | Foldable Kick Scooter with LED flashing PU wheels, age 3-7, adjustable T-bar.
  6. ID: "ranger-06" | Name: RANGER | Category: Scooters | ₹3,038 | Pro Urban Scooter with dual suspension & disc brake, age 5-12, 100kg weight limit.
  7. ID: "victor-07" | Name: VICTOR | Category: Trikes | ₹2,595 | Canopy Steering Trike with UV sunshade, EVA silent tyres, age 1.5-4.
  8. ID: "apache-08" | Name: APACHE | Category: Trikes | ₹2,210 | Heavy-Duty Military Trike with rear tipper bucket, age 2-5.
  9. ID: "gt-ev-09" | Name: GT EV | Category: EV | ₹3,810 | Super Sportster with scissor butterfly doors, age 2-6, LED dashboard.
  10. ID: "jeep-ev-10" | Name: JEEP EV | Category: EV | ₹3,990 | Sahara 4x4 Off-roader with roof spotlight rack, age 3-8.
  11. ID: "panda-11" | Name: PANDA | Category: Walkers | ₹1,850 | Musical baby walker with 3-position height adjust & meal tray, age 6-18 months.
  12. ID: "titan-12" | Name: TITAN | Category: Trikes | ₹3,450 | 360° Reversible Stroller Trike with push bar, age 1-5.

Guidelines:
- Give fresh, direct, friendly, and comprehensive answers tailored directly to what the customer asks.
- Never output generic static boilerplate. Focus on safety, age suitability, battery maintenance tips (first charge 6-8 hrs, do not overcharge >12 hrs), BIS quality standards, and genuine parent recommendations.
- When recommending toys, always cite specific toy names and prices so the customer has clear facts.`;

    const chatMessages = [
      ...history
        .filter((h: any) => Boolean((h.content || h.text || '').trim()))
        .map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content || h.text) }],
        })),
      {
        role: 'user',
        parts: [{
          text: productContext
            ? `[Currently viewing toy: ${JSON.stringify(productContext)}]\nUser Question: ${message}`
            : message,
        }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I would be delighted to help you choose the safest and most exciting Dash Star ride-on toy for your child!';

    // Extract matched product IDs
    const matchedProducts: string[] = [];
    const lower = (replyText + ' ' + message).toLowerCase();
    if (lower.includes('ducatti') || lower.includes('superbike') || lower.includes('bike')) matchedProducts.push('ducatti-01');
    if (lower.includes('humr') || lower.includes('hummer') || lower.includes('jeep') || lower.includes('sahara')) {
      if (lower.includes('sahara') || lower.includes('jeep ev')) matchedProducts.push('jeep-ev-10');
      else matchedProducts.push('humr-ev-02');
    }
    if (lower.includes('bunny') || lower.includes('swing') || lower.includes('twist')) matchedProducts.push('bunny-03');
    if (lower.includes('smart') || lower.includes('push car') || lower.includes('stroller car')) matchedProducts.push('smart-04');
    if (lower.includes('noddy') || lower.includes('kick scooter') || lower.includes('foldable scooter')) matchedProducts.push('noddy-05');
    if (lower.includes('ranger') || lower.includes('disc brake') || lower.includes('suspension')) matchedProducts.push('ranger-06');
    if (lower.includes('victor') || lower.includes('canopy')) matchedProducts.push('victor-07');
    if (lower.includes('apache') || lower.includes('military') || lower.includes('tipper')) matchedProducts.push('apache-08');
    if (lower.includes('gt ev') || lower.includes('sportster') || lower.includes('scissor door')) matchedProducts.push('gt-ev-09');
    if (lower.includes('panda') || lower.includes('walker') || lower.includes('baby walker')) matchedProducts.push('panda-11');
    if (lower.includes('titan') || lower.includes('360')) matchedProducts.push('titan-12');

    res.json({
      reply: replyText,
      matchedProductIds: Array.from(new Set(matchedProducts)),
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat query',
      details: error.message,
    });
  }
});

// 2. AI Semantic & Hybrid Search: LLM Query Parsing + Supabase pgvector
app.post('/api/ai/semantic-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const ai = getGenAI();

    // Stage 1: LLM Natural Language Query Parser (Extracts structured filters)
    const prompt = `You are the specialized NLP Query Parser for Dash Star kids' ride-on toys ecommerce.
The customer typed this natural language search: "${query}"

Available Categories: ["Cars", "EV", "Ride Ons", "Scooters", "Trikes", "Walkers"]

Extract exact structured filters for SQL WHERE conditions, plus a semantic embedding prompt:
- category: The exact category ("Cars", "EV", "Ride Ons", "Scooters", "Trikes", "Walkers") or null if unspecified.
- maxPrice: Maximum price budget in INR (₹) or null.
- minPrice: Minimum price budget in INR (₹) or null.
- color: Specific color keyword (e.g. "red", "yellow", "blue", "pink", "black", "green") or null.
- ageGroup: Age bracket (e.g. "3-5 years", "1-4 years") or null.
- features: Array of specific functional features (e.g. ["parental remote", "led wheels", "training wheels", "canopy", "dual motor"]).
- semanticSearchPrompt: A rich, descriptive semantic summary of the desired toy to compute vector cosine distance against product embeddings.
- reasoning: A crisp 1-2 sentence human-readable explanation of how the query was parsed and which filters were activated.`;

    let structuredFilters: StructuredFilters;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'One of: Cars, EV, Ride Ons, Scooters, Trikes, Walkers, or null',
              },
              maxPrice: {
                type: Type.NUMBER,
                description: 'Maximum budget in INR (₹) or null',
              },
              minPrice: {
                type: Type.NUMBER,
                description: 'Minimum budget in INR (₹) or null',
              },
              color: {
                type: Type.STRING,
                description: 'Color keyword e.g. "red", "blue" or null',
              },
              ageGroup: {
                type: Type.STRING,
                description: 'Age range extracted or null',
              },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of extracted feature requirements',
              },
              semanticSearchPrompt: {
                type: Type.STRING,
                description: 'Refined descriptive prompt for vector embedding model',
              },
              reasoning: {
                type: Type.STRING,
                description: 'Crisp explanation of parsed intent and filters',
              },
            },
            required: ['semanticSearchPrompt', 'reasoning'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      structuredFilters = {
        category: parsed.category || null,
        maxPrice: typeof parsed.maxPrice === 'number' ? parsed.maxPrice : null,
        minPrice: typeof parsed.minPrice === 'number' ? parsed.minPrice : null,
        color: parsed.color || null,
        ageGroup: parsed.ageGroup || null,
        features: Array.isArray(parsed.features) ? parsed.features : [],
        semanticSearchPrompt: parsed.semanticSearchPrompt || query,
        reasoning: parsed.reasoning || `Extracted semantic intent for: "${query}"`,
      };
    } catch (llmErr) {
      console.warn('LLM parsing fallback engaged:', llmErr);
      const q = query.toLowerCase();
      structuredFilters = {
        category: q.includes('car') ? 'Cars' : q.includes('ev') || q.includes('electric') || q.includes('bike') ? 'EV' : q.includes('scooter') ? 'Scooters' : q.includes('trike') ? 'Trikes' : q.includes('walker') ? 'Walkers' : null,
        maxPrice: q.includes('3000') ? 3000 : q.includes('4000') ? 4000 : q.includes('5000') ? 5000 : q.includes('6000') ? 6000 : null,
        minPrice: null,
        color: q.includes('red') ? 'red' : q.includes('pink') ? 'pink' : q.includes('blue') ? 'blue' : q.includes('yellow') ? 'yellow' : null,
        ageGroup: null,
        features: [],
        semanticSearchPrompt: query,
        reasoning: `Rule-based filter extraction for "${query}"`,
      };
    }

    // Stage 2: Hybrid Search combining Vector Similarity & SQL Filtering
    const hybridResponse = await executeHybridSearch(query, structuredFilters, ai);

    res.json(hybridResponse);
  } catch (error: any) {
    console.error('Semantic search error:', error);
    res.status(500).json({
      error: 'Failed to process semantic search',
      details: error.message,
    });
  }
});

// Supabase pgvector Connection & Schema Status
app.get('/api/ai/supabase-status', (req, res) => {
  const supabase = getSupabaseClient();
  const url = process.env.SUPABASE_URL || '';

  res.json({
    connected: Boolean(supabase),
    configured: Boolean(url),
    supabaseUrl: url ? url.replace(/(https?:\/\/)([^@]+@)?([^\/]+).*/, '$1$3') : null,
    vectorDimensions: 768,
    pgvectorExtension: 'vector',
    targetTable: 'products',
    hnswIndex: 'products_embedding_hnsw_idx',
    rpcFunction: 'hybrid_search_products',
    embeddingModel: 'gemini-embedding-2-preview',
    localFallbackReady: true,
  });
});

// 3. AI Review Sentiment & Aspect-Based Opinion Mining
app.post('/api/ai/sentiment-analysis', async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    const ai = getGenAI();

    const prompt = `Analyze this customer review for a Dash Star kids ride-on toy:
Rating: ${rating} Stars
Review Text: "${reviewText}"

Provide fine-grained aspect sentiment analysis across Battery Life, Assembly Ease, Durability/Safety, and Fun Factor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSentiment: {
              type: Type.STRING,
              description: '"Positive", "Mixed", or "Negative"',
            },
            sentimentScore: {
              type: Type.NUMBER,
              description: 'Score from 0.0 to 1.0',
            },
            aspects: {
              type: Type.OBJECT,
              properties: {
                battery: { type: Type.STRING, description: '"positive", "neutral", "negative", or "not_mentioned"' },
                assembly: { type: Type.STRING, description: '"positive", "neutral", "negative", or "not_mentioned"' },
                durability: { type: Type.STRING, description: '"positive", "neutral", "negative", or "not_mentioned"' },
                safety: { type: Type.STRING, description: '"positive", "neutral", "negative", or "not_mentioned"' },
              },
            },
            keyHighlight: { type: Type.STRING },
            actionableFeedbackForManufacturer: { type: Type.STRING },
          },
          required: ['overallSentiment', 'sentimentScore', 'keyHighlight'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ analysis: parsed });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to analyze sentiment', details: error.message });
  }
});

// 4. AI Image Auto-Tagging & Metadata Generation for Admin Uploads
app.post('/api/ai/auto-tag', async (req, res) => {
  try {
    const { toyName, categoryHint, descriptionNotes } = req.body;
    const ai = getGenAI();

    const prompt = `You are Dash Star's AI Catalog Onboarding Assistant.
Generate complete ecommerce metadata for a new toy being uploaded:
Toy Name: ${toyName}
Category: ${categoryHint || 'Ride Ons'}
Notes: ${descriptionNotes || 'Kids outdoor toy with high durability and safety certification.'}

Generate:
1. Recommended SEO title & Meta description
2. 6-8 search discovery tags
3. Recommended Age Bracket
4. BIS standard code recommendation (e.g. IS 9873:2019 compliant)
5. Safety warning bullet points
6. Alt-text for image accessibility`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedAge: { type: Type.STRING },
            safetyWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPriceBandINR: { type: Type.STRING },
            imageAltText: { type: Type.STRING },
          },
          required: ['seoTitle', 'metaDescription', 'tags', 'recommendedAge'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ metadata: parsed });
  } catch (error: any) {
    res.status(500).json({ error: 'Auto-tag failed', details: error.message });
  }
});

// 5. Razorpay Simulated Order Creation & Verification
app.post('/api/orders/create', (req, res) => {
  const { items, totalAmount, customerInfo } = req.body;
  const orderId = 'DS-ORD-' + Math.floor(100000 + Math.random() * 900000);
  const razorpayOrderId = 'order_DS_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  res.json({
    success: true,
    orderId,
    razorpayOrderId,
    amount: totalAmount,
    currency: 'INR',
    customer: customerInfo,
    estimatedDeliveryDays: 3,
    dispatchCenter: 'Dash Star Sahibabad Hub, Ghaziabad',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dash Star Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

