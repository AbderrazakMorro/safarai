/**
 * SafarAI Gemini Service — Waterfall Architecture
 * 
 * 4-Stage Pipeline:
 *   Stage 0: detectLanguage()        — Gemini detects user language + translates to English
 *   Stage 1: analyzeIntent()         — LLM classifies intent + extracts entities (no tools)
 *   Stage 2: executeTools()          — Native JS fetches real data (no LLM)
 *   Stage 3: generateFinalResponse() — LLM generates the final formatted response in user's language
 */

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const OPENROUTER_MODEL = 'google/gemma-3-27b-it:free';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// For backward compatibility in existing code
const API_KEY = GROQ_KEY || OPENROUTER_KEY;
const MODEL_NAME = GROQ_KEY ? GROQ_MODEL : OPENROUTER_MODEL;
const ENDPOINT = GROQ_KEY ? GROQ_ENDPOINT : OPENROUTER_ENDPOINT;


// ─── Translation Utility (via OpenRouter — Gemini quota exhausted) ────────────────
// Detects the user's language and translates to/from using OpenRouter LLM.

const callTranslation = async (prompt) => {
  try {
    const res = await callGroq({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: 'ROLE: You are a precise and expert translation engine.\\nCONTEXT: You are processing raw user text for a Moroccan travel application.\\nTASK: Translate the given text according to the user instructions, following them exactly.\\nFORMAT: Return ONLY the translated string. Do not include any explanations, markdown code blocks, or preamble.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });
    return res?.content?.trim() || null;
  } catch (e) {
    console.error('[Translation] API call failed:', e);
    return null;
  }
};

/**
 * Stage 0: Detect language and translate user input to English if needed.
 * Returns { detectedLang, originalInput, englishInput }
 */
const detectAndTranslate = async (userInput) => {
  console.log('[Waterfall] Stage 0: Detecting language...');

  const prompt = `ROLE: You are a multilingual language detection and translation engine for SafarAI.
CONTEXT: We need to determine the user's language to translate their input into English for backend processing. Moroccan users might use Arabizi (Latin-script Moroccan Arabic) or formal Arabic.
TASK: Analyze the provided user text, detect the exact language, and translate it to English if it is not already in English.
FORMAT: Respond ONLY with a standard JSON object, without any markdown fences or explanation. Use this structure:
{
  "language": "ISO language code (en, fr, ar, darija, es, etc.)",
  "language_name": "Full name of the language (English, French, Darija, Arabic, etc.)",
  "english_translation": "The English translation of the text, or the original text if already in English"
}

IMPORTANT for Darija:
- If the text contains Arabizi (e.g., 'kifach', 'wach', 'salam', 'labas', 'fin'), classify it as "darija".
- If the text is Arabic-dialect specific to Morocco, classify it as "darija".

Text to process: "${userInput}"`;

  const result = await callTranslation(prompt);

  if (result) {
    try {
      const cleaned = result.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('[Waterfall] Stage 0: Detected language:', parsed.language_name || parsed.language);
        return {
          detectedLang: parsed.language || 'en',
          langName: parsed.language_name || 'English',
          originalInput: userInput,
          englishInput: parsed.english_translation || userInput
        };
      }
    } catch (e) {
      console.warn('[Waterfall] Stage 0 parse failed:', e.message);
    }
  }

  // Fallback: assume English
  return { detectedLang: 'en', langName: 'English', originalInput: userInput, englishInput: userInput };
};

/**
 * Translate the final response text back to the user's language using Gemini.
 * This is the GUARANTEE layer — even if Stage 3 ignored the language instruction,
 * this step will always force-translate the output.
 */
const translateResponse = async (text, targetLang, targetLangName) => {
  if (targetLang === 'en') return text; // No translation needed

  console.log(`[Waterfall] Force-translating response to ${targetLangName}...`);

  let langInstruction = `Translate the following text to ${targetLangName}.`;

  if (targetLang === 'darija') {
    langInstruction = `Translate the following text to Darija (Moroccan Arabic). 
You MUST write the translation in Arabizi (Latin script, like: "salam, kifach nta? labas 3lik?").
Do NOT use Arabic script. Use numbers for Arabic sounds: 3=ع, 7=ح, 9=ق, 5=خ, 2=ء.
Use natural everyday Moroccan dialect, not formal Arabic.`;
  } else if (targetLang === 'fr') {
    langInstruction = `Translate the following text to French. Use natural, conversational French.`;
  } else if (targetLang === 'ar') {
    langInstruction = `Translate the following text to Modern Standard Arabic (MSA). Use Arabic script.`;
  }

  const prompt = `ROLE: You are a professional translator specializing in natural, conversational localization.
CONTEXT: A Moroccan travel concierge AI has generated a response. We need to present this response to the user in their requested language while preserving all original formatting.
TASK: ${langInstruction}
FORMAT: Keep all Markdown formatting (bold, bullets, emojis) intact. Do NOT add any explanation or preamble, just return the translated text directly.

Text to translate:
${text}`;

  const translated = await callTranslation(prompt);
  return translated || text; // Fallback to original if translation fails
};

/**
 * Translate an array of suggestion strings to the user's language.
 */
const translateSuggestions = async (suggestions, targetLang, targetLangName) => {
  if (targetLang === 'en' || !suggestions || suggestions.length === 0) return suggestions;

  const prompt = `ROLE: You are a professional text localizer.
CONTEXT: We have quick-reply suggestions for a chat interface that need to match the user's language.
TASK: Translate each of these suggestions to ${targetLangName}. ${targetLang === 'darija' ? 'Use Arabizi (Latin script Moroccan Arabic with numbers: 3=ع, 7=ح, 9=ق).' : ''}
FORMAT: Return ONLY a valid JSON array of translated strings. Do not include any explanations or markdown fences.

Suggestions to translate:
${JSON.stringify(suggestions)}`;

  const result = await callTranslation(prompt);
  if (result) {
    try {
      const cleaned = result.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
  }
  return suggestions;
};

// ─── City Coordinates Lookup ────────────────────────────────────────────────
// Dynamic lookup table for Moroccan cities. The LLM extracts the city name,
// and we resolve coordinates natively — no hallucinated lat/lon.
const CITY_COORDS = {
  'ifrane': { lat: 33.5333, lon: -5.1167 },
  'fes': { lat: 34.0331, lon: -5.0003 },
  'fez': { lat: 34.0331, lon: -5.0003 },
  'marrakech': { lat: 31.6295, lon: -7.9811 },
  'marrakesh': { lat: 31.6295, lon: -7.9811 },
  'casablanca': { lat: 33.5731, lon: -7.5898 },
  'rabat': { lat: 34.0209, lon: -6.8416 },
  'tangier': { lat: 35.7595, lon: -5.8340 },
  'tanger': { lat: 35.7595, lon: -5.8340 },
  'chefchaouen': { lat: 35.1688, lon: -5.2636 },
  'chaouen': { lat: 35.1688, lon: -5.2636 },
  'essaouira': { lat: 31.5085, lon: -9.7595 },
  'agadir': { lat: 30.4278, lon: -9.5981 },
  'meknes': { lat: 33.8935, lon: -5.5473 },
  'ouarzazate': { lat: 30.9189, lon: -6.8936 },
  'merzouga': { lat: 31.0801, lon: -4.0133 },
  'tetouan': { lat: 35.5785, lon: -5.3684 },
  'volubilis': { lat: 34.0724, lon: -5.5546 },
  'moulay idriss': { lat: 34.0565, lon: -5.5230 },
  'asilah': { lat: 35.4653, lon: -6.0345 },
  'el jadida': { lat: 33.2549, lon: -8.5007 },
  'safi': { lat: 32.2994, lon: -9.2372 },
  'nador': { lat: 35.1681, lon: -2.9287 },
  'oujda': { lat: 34.6814, lon: -1.9086 },
  'kenitra': { lat: 34.2610, lon: -6.5802 },
  'beni mellal': { lat: 32.3373, lon: -6.3498 },
  'errachidia': { lat: 31.9314, lon: -4.4288 },
  'dakhla': { lat: 23.6848, lon: -15.9580 },
  'taroudant': { lat: 30.4727, lon: -8.8748 },
  'azrou': { lat: 33.4342, lon: -5.2214 },
  'midelt': { lat: 32.6799, lon: -4.7345 },
  'taza': { lat: 34.2133, lon: -4.0100 },
  'al hoceima': { lat: 35.2517, lon: -3.9372 },
  'tiznit': { lat: 29.6974, lon: -9.7316 },
  'zagora': { lat: 30.3302, lon: -5.8381 },
  'tinghir': { lat: 31.5147, lon: -5.5327 },
};

// Default fallback coordinates (Ifrane)
const DEFAULT_COORDS = { lat: 33.5333, lon: -5.1167 };

/**
 * Resolve city name to coordinates.
 * Supports fuzzy matching by normalizing input.
 */
const resolveCityCoords = (cityName) => {
  if (!cityName) return DEFAULT_COORDS;
  const normalized = cityName.toLowerCase().trim();

  // Direct lookup
  if (CITY_COORDS[normalized]) return CITY_COORDS[normalized];

  // Partial match (e.g., "fes el bali" → "fes")
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized)) return coords;
  }

  return null; // Unknown city — Stage 2 will use LLM-extracted lat/lon if available
};


// ─── 1. Tool Call Handlers ──────────────────────────────────────────────────

export const fetchOpenTripMapData = async (lat, lon, kinds) => {
  const OPENTRIPMAP_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
  if (!OPENTRIPMAP_KEY) return { error: "OpenTripMap API Key missing" };
  try {
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${lon}&lat=${lat}&kinds=${kinds}&format=json&limit=5&apikey=${OPENTRIPMAP_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return { error: "Failed to fetch map data" };
    return await response.json();
  } catch (err) {
    return { error: err.message };
  }
};


// ─── 2. Input Handlers ─────────────────────────────────────────────────────

export const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim();
};

export const validateInput = (text) => {
  return text.length > 0;
};


// ─── 3. Context Builder ────────────────────────────────────────────────────

export const buildContext = () => {
  // Basic preference extraction (can be expanded)
  const preferences = {
    budget: null,
    duration: null,
    interests: [],
    destination: null
  };

  return { preferences };
};


// ─── 4. API Caller ─────────────────────────────────────────────────────────

export const callGroq = async (payload) => {
  let lastError = null;

  // --- ATTEMPT 1: GROQ (Primary & Fastest) ---
  if (GROQ_KEY) {
    try {
      console.log('[AI] Attempting Groq (llama-3.3-70b)...');
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          ...payload,
          model: GROQ_MODEL
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices?.[0]?.message) return data.choices[0].message;
      } else {
        const err = await response.json().catch(() => ({}));
        console.warn('[AI] Groq failed:', err.error?.message || response.status);
      }
    } catch (e) {
      console.warn('[AI] Groq fetch error:', e.message);
      lastError = e;
    }
  }

  // --- ATTEMPT 2: OPENROUTER (Secondary Fallback) ---
  if (OPENROUTER_KEY) {
    try {
      console.log('[AI] Falling back to OpenRouter (gemma-3)...');
      
      // OpenRouter free models often require system -> user message conversion
      const safeMessages = payload.messages.map(m => {
        if (m.role === 'system') {
          return { role: 'user', content: `[SYSTEM INSTRUCTION]\n${m.content}\n[END SYSTEM INSTRUCTION]` };
        }
        return m;
      });

      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`
        },
        body: JSON.stringify({
          ...payload,
          model: OPENROUTER_MODEL,
          messages: safeMessages
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices?.[0]?.message) return data.choices[0].message;
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('[AI] OpenRouter fallback failed:', err.error?.message || response.status);
        lastError = new Error(err.error?.message || `HTTP ${response.status}`);
      }
    } catch (e) {
      console.error('[AI] OpenRouter fetch error:', e.message);
      lastError = e;
    }
  }

  // --- FALLBACK TO DIRECT GOOGLE GEMINI ---
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (GEMINI_KEY && openRouterError) {
    console.log('[Fallback] OpenRouter failed, calling Google Gemini direct API...');
    try {
      const systemPrompt = payload.messages.find(m => m.role === 'system')?.content || '';
      const userMsgs = payload.messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const geminiPayload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: userMsgs,
        generationConfig: {
          temperature: payload.temperature || 0.1
        }
      };
      if (payload.response_format?.type === 'json_object') {
        geminiPayload.generationConfig.responseMimeType = "application/json";
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
      const gRes = await fetch(geminiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(geminiPayload) });

      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.candidates && gData.candidates[0].content.parts[0].text) {
          return { content: gData.candidates[0].content.parts[0].text };
        }
      } else {
        const gErr = await gRes.json().catch(() => ({}));
        console.error('Gemini Fallback Error Response:', gErr);
      }
    } catch (gem_err) {
      console.error('Gemini Fallback Exception:', gem_err);
    }
  }

  throw openRouterError;
};

// Keep legacy alias for any external imports
export const callGemini = callGroq;


// ─── 5. Response Parser ────────────────────────────────────────────────────

export const parseResponse = (rawText) => {
  console.log('[Waterfall] parseResponse raw input:', rawText?.substring(0, 300));

  try {
    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    let cleaned = rawText;
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      cleaned = fenceMatch[1].trim();
    }

    // Attempt to extract JSON if there's any surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned;
    let parsed = JSON.parse(jsonString);

    // Handle nested schema wrapper: if the LLM echoed { type, schema: {...} }, unwrap it
    if (parsed.schema && typeof parsed.schema === 'object' && !parsed.text) {
      console.log('[Waterfall] parseResponse: Unwrapping nested schema wrapper');
      parsed = parsed.schema;
    }

    console.log('[Waterfall] parseResponse parsed successfully, text length:', (parsed.text || '').length);

    return {
      intent: parsed.intent || 'general',
      destination: parsed.destination || '',
      duration: parsed.duration || '',
      budget: parsed.budget || '',
      weather: parsed.weather || null,
      monuments: Array.isArray(parsed.monuments) ? parsed.monuments : [],
      itinerary: Array.isArray(parsed.itinerary) ? parsed.itinerary : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      text: parsed.text || parsed.message || rawText || "I'm here to help! Ask me anything about Morocco 🇲🇦"
    };
  } catch (error) {
    console.warn('[Waterfall] parseResponse JSON parse failed:', error.message);

    // Attempt fallback regex to extract "text" field if it looks like JSON
    let textFallback = rawText;
    try {
      const textMatch = rawText?.match(/"text"\s*:\s*(?:"|")([\s\S]*?)(?:"|")\s*(?:,|})/);
      if (textMatch) {
        textFallback = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      } else {
        // Also handle unescaped JSON text block failures if possible
        const blockMatch = rawText?.match(/"text"\s*:\s*"?([\s\S]*?)”?\n\s*}/);
        if (blockMatch) {
          textFallback = blockMatch[1].trim();
        }
      }
    } catch (e) {
      // Ignore inner errors
    }

    // If it's not JSON, treat it as plain text
    return {
      intent: 'general',
      text: textFallback || "I'm here to help! Ask me anything about Morocco 🇲🇦",
      weather: null,
      monuments: [],
      itinerary: [],
      suggestions: []
    };
  }
};


// ─── STAGE 1: Intent Analysis ──────────────────────────────────────────────
// A lightweight LLM call with NO tools. Classifies intent and extracts entities.

const analyzeIntent = async (userInput) => {
  console.log('[Waterfall] Stage 1: Analyzing intent...');

  const payload = {
    model: MODEL_NAME,
    messages: [
      {
        role: 'system',
        content: `ROLE: You are an expert intent classifier for SafarAI, a Moroccan travel assistant.
CONTEXT: The user's input has been translated to English. We need to route their request to the correct data-fetching tool.
TASK: Classify the user's intent into a specific category, and extract any relevant location or search keywords based on their English meaning.
FORMAT: Return ONLY a raw JSON object (no markdown fences) with the exact structure below:

{
  "intent": "EXPLORE" | "WEATHER" | "CULTURE" | "CHAT",
  "city": "string (the extracted city/town name, or null if none)",
  "lat": "number (extract explicit latitude, or null)",
  "lon": "number (extract explicit longitude, or null)",
  "kinds": "string (comma-separated OpenTripMap categories, or null)"
}

RULES:
- For "kinds": Use OpenTripMap categories like "historic", "cultural", "natural", "architecture", "foods", "shops", "amusements", "interesting_places". Combine with commas. Set null for CHAT/CULTURE.
- Return ONLY the JSON object, nothing else.`
      },
      {
        role: 'user',
        content: userInput
      }
    ],
    temperature: 0.1, // Low temperature for deterministic classification
    max_tokens: 200
    // NO tools — this call is purely for classification
  };

  try {
    const message = await callGroq(payload);
    const content = message.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      console.log('[Waterfall] Stage 1 Result:', result);
      return {
        intent: result.intent || 'CHAT',
        city: result.city || null,
        lat: result.lat || null,
        lon: result.lon || null,
        kinds: result.kinds || 'interesting_places'
      };
    }
  } catch (err) {
    console.warn('[Waterfall] Stage 1 parse failed, defaulting to CHAT:', err.message);
  }

  // Safe fallback
  return { intent: 'CHAT', city: null, lat: null, lon: null, kinds: null };
};


// ─── STAGE 2: Tool Execution (Native JS — No LLM) ─────────────────────────
// Deterministic data fetching based on the classified intent.

const executeTools = async (intentResult) => {
  console.log('[Waterfall] Stage 2: Executing tools for intent:', intentResult.intent);

  // Only EXPLORE and WEATHER intents need external data
  if (intentResult.intent !== 'EXPLORE' && intentResult.intent !== 'WEATHER') {
    console.log('[Waterfall] Stage 2: Skipped (no tools needed for', intentResult.intent, ')');
    return null;
  }

  // Resolve coordinates: city lookup → LLM-extracted coords → default
  let coords = null;

  if (intentResult.city) {
    coords = resolveCityCoords(intentResult.city);
  }

  if (!coords && intentResult.lat && intentResult.lon) {
    coords = { lat: intentResult.lat, lon: intentResult.lon };
  }

  if (!coords) {
    coords = DEFAULT_COORDS; // Fallback to Ifrane
    console.log('[Waterfall] Stage 2: No city resolved, using default (Ifrane)');
  }

  const kinds = intentResult.kinds || 'interesting_places,historic,cultural,natural';

  console.log(`[Waterfall] Stage 2: Fetching OpenTripMap → lat:${coords.lat}, lon:${coords.lon}, kinds:${kinds}`);
  const toolData = await fetchOpenTripMapData(coords.lat, coords.lon, kinds);

  return {
    source: 'opentripmap',
    city: intentResult.city || 'Ifrane',
    coordinates: coords,
    results: toolData
  };
};


// ─── STAGE 3: Final Response Generation ────────────────────────────────────
// Second LLM call with the full persona. Receives tool data as context.
// NO tools attached — the model focuses purely on generating the JSON response.

const generateFinalResponse = async (userInput, intentResult, toolData, context, langInfo, isAuthenticated = true) => {
  console.log('[Waterfall] Stage 3: Generating final response... (auth:', isAuthenticated, ')');

  const systemPrompt = `ROLE: You are SafarAI, the digital concierge and expert travel companion for Moroccan travelers.
CONTEXT: You assist travelers with authentic, expert-level travel advice for Morocco. You must act as a natural, local human expert. The user's detected language is **${langInfo?.langName || 'English'}**. 
${toolData ? `REAL-TIME DATA: You fetched the following places near (${toolData.coordinates.lat}, ${toolData.coordinates.lon}) for ${toolData.city}:
${JSON.stringify(toolData.results, null, 2)}` : 'REAL-TIME DATA: No external data fetched. Answer using your internal knowledge.'}
DETECTED INTENT: ${intentResult.intent}

TASK: Generate a final response based on the user's input and preferences. Provide local secrets (e.g., if asked about Ifrane, mention the Al Akhawayn campus or Stone Lion). Use real place names from the data provided—do not hallucinate fictional places.
You MUST write all your responses in **${langInfo?.langName || 'English'}**. If the language is Darija, write exclusively in Arabizi.

FORMAT: You MUST return ONLY a raw JSON object (NO markdown fences or schema wrappers). The 'text' field must contain your main conversation properly formatted with markdown (bold, lists, emojis), with newlines properly escaped as \\\\n.

{
  "intent": "string (the conversation state, e.g., recommendation)",
  "text": "string (Your full proper Markdown response. Give brief teaser if guest user. Add 🔐 Sign up for free at the end if guest.)",
  "destination": "string (City name or empty)",
  "duration": "string (e.g., 3 days or empty)",
  "budget": "string (e.g., 500 MAD or empty)",
  "weather": { "condition": "Sunny", "temperature": "22°C" },
  "monuments": [{ "name": "Place Name", "description": "Brief description" }],
  "itinerary": [{ "day": 1, "activities": ["Activity 1"], "estimated_cost": "200 MAD", "notes": "Tip" }],
  "suggestions": ["Follow-up suggestion 1", "Follow-up suggestion 2"]
}

RULES:
- Leave arrays empty [] if not directly applicable.
- Leave objects null if not directly applicable.
- The "text" field is ALWAYS required.
- Do NOT wrap the response in any schema/type envelope.
${!isAuthenticated ? `
- GUEST USER: Limit text to 2-3 sentences. Limit monuments to 1. Leave itinerary empty. Append "\\n\\n🔐 **Sign up for free** to unlock full itineraries!" to the text.` : ''}`;

  const payload = {
    model: MODEL_NAME,
    messages: [
      {
        role: 'system',
        content: `${systemPrompt}\n\nUser Context:\n- Preferences: ${JSON.stringify(context.preferences)}\n\nTask: The user can insert a question or statement in ANY format. You must ALWAYS respond properly and naturally based on the input. ONLY fill out the 'weather', 'monuments', and 'itinerary' JSON fields if the user explicitly asks for a destination, recommendation, or city details. For any other input (e.g., greetings, general questions, weird formatting), leave those arrays/objects empty and reply naturally using ONLY the 'text' field.`
      },
      {
        role: 'user',
        content: userInput
      }
    ]
    // NO tools — pure generation
  };

  const message = await callGroq(payload);
  const rawContent = message.content || '';
  console.log('[Waterfall] Stage 3 raw response length:', rawContent.length);
  console.log('[Waterfall] Stage 3 raw response preview:', rawContent.substring(0, 500));
  return rawContent;
};


// ─── 7. Orchestrator (Main Export) — Waterfall Pipeline ─────────────────────

export const getGeminiResponse = async (userInput, { isAuthenticated = true } = {}) => {
  // ── Sanitize & Validate ──
  const sanitized = sanitizeInput(userInput);
  if (!validateInput(sanitized)) throw new Error('User input cannot be empty');

  const context = buildContext();

  try {
    // ── Stage 0: Detect Language & Translate ──
    const langInfo = await detectAndTranslate(sanitized);
    console.log(`[Waterfall] Language: ${langInfo.langName} (${langInfo.detectedLang})`);

    // ── Stage 1: Classify Intent (using English input) ──
    const intentResult = await analyzeIntent(langInfo.englishInput);

    // ── Stage 2: Execute Tools (native JS, no LLM) ──
    const toolData = await executeTools(intentResult);

    // ── Stage 3: Generate Final Response (LLM, no tools) ──
    const rawResponse = await generateFinalResponse(langInfo.originalInput, intentResult, toolData, context, langInfo, isAuthenticated);

    // ── Parse & Return ──
    const parsed = parseResponse(rawResponse);

    // ── Post-process: ALWAYS translate to user's language ──
    if (langInfo.detectedLang !== 'en') {
      const [translatedText, translatedSuggestions] = await Promise.all([
        translateResponse(parsed.text, langInfo.detectedLang, langInfo.langName),
        translateSuggestions(parsed.suggestions, langInfo.detectedLang, langInfo.langName)
      ]);
      parsed.text = translatedText;
      parsed.suggestions = translatedSuggestions;
    }

    console.log(`[Waterfall] Pipeline complete. Lang: ${langInfo.langName}, Intent: ${intentResult.intent} → Parsed: ${parsed.intent}`);
    return parsed;

  } catch (error) {
    console.error('[Waterfall] Pipeline error:', error);

    // Graceful fallback — try a direct single-shot call without the waterfall
    console.log('[Waterfall] Attempting direct fallback...');
    try {
      const fallbackPayload = {
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: 'ROLE: You are SafarAI, a friendly Moroccan travel assistant.\\nCONTEXT: The user is requesting travel help.\\nTASK: Answer intelligently and assist the user.\\nFORMAT: Respond naturally in JSON format with at minimum a "text" field containing your response, and an "intent" field. Keep it brief and helpful.'
          },
          { role: 'user', content: sanitized }
        ]
      };
      const fallbackMsg = await callGroq(fallbackPayload);
      return parseResponse(fallbackMsg.content || '');
    } catch (fallbackError) {
      console.error('[Waterfall] Fallback also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

/**
 * Roadtrip Planner Engine
 * Generates an itinerary including days, stops, and activities between origin and destination.
 */
export const generateRoadtripItinerary = async (origin, destination, days = 3) => {
  if (!API_KEY) {
    console.error('[Roadtrip] OpenRouter API key missing.');
    return null;
  }

  const prompt = `You are a Moroccan travel concierge. The human wants to take a roadtrip from ${origin} to ${destination} over ${days} days.
Please generate a realistic, sequential itinerary including logical stops between these two locations.
Return ONLY a strictly valid JSON array of objects, with NO markdown code blocks, NO markdown syntax and NO extra text.
Format example:
[
  {
    "day": "Day 1",
    "dateInfo": "Start the journey",
    "stopName": "City or Region Name",
    "lat": 31.6295,
    "lng": -7.9811,
    "description": "Why stop here? What is the vibe?",
    "activities": ["Activity 1", "Activity 2"]
  }
]
Constraints:
- Focus on actual Moroccan cities, villages, or scenic spots along the route from ${origin} to ${destination}.
- VERY IMPORTANT: estimate the realistic latitude (lat) and longitude (lng) for each stop so we can plot it on a map.
- Keep descriptions brief and enticing.
- The first stop should be the departure or nearby, the last should be near the destination or the destination itself.`;

  try {
    const payload = {
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: 'ROLE: You are a Moroccan travel itinerary API.\nCONTEXT: The user needs a multi-day route planner.\nTASK: Generate realistic roadtrip stops and activities.\nFORMAT: Output perfectly valid JSON arrays only without markdown formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    };

    const message = await callGroq(payload);
    const content = message.content?.trim();
    if (!content) return null;

    // Robust JSON extraction: look for [ ... ]
    const startBracket = content.indexOf('[');
    const endBracket = content.lastIndexOf(']');
    if (startBracket === -1 || endBracket === -1) {
      console.error('[Roadtrip] No JSON array found in response:', content);
      return null;
    }
    const jsonStr = content.substring(startBracket, endBracket + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[Roadtrip] Itinerary generation failed:', e);
    return null;
  }
};

/**
 * City Explorer Engine
 * Generates points of interest within a single city, with coordinates and categories.
 */
export const generateCityExplorer = async (cityName) => {
  if (!API_KEY) {
    console.error('[CityExplorer] OpenRouter API key missing.');
    return null;
  }

  const prompt = `You are a Moroccan local expert with encyclopedic knowledge. The human wants to FULLY explore ${cityName}, Morocco.
Generate 20-25 places to visit and things to do WITHIN the city. Include EVERYTHING worth seeing — from the most iconic, world-famous landmarks down to lesser-known local favorites and hidden gems.
Return ONLY a strictly valid JSON array of objects, with NO markdown code blocks, NO markdown syntax and NO extra text.
Order them from MOST POPULAR / MOST VISITED to LEAST KNOWN / HIDDEN GEM.
Format:
[
  {
    "name": "Place Name",
    "lat": 31.6295,
    "lng": -7.9811,
    "category": "one of: landmark, food, market, culture, nature, nightlife, shopping, religion",
    "popularity": 10,
    "description": "A brief, exciting 1-2 sentence description of why to visit.",
    "tips": "One practical tip for visitors."
  }
]
Constraints:
- "popularity" is a score from 1 (hidden gem, very few tourists know it) to 10 (world-famous, millions of visitors per year). Be realistic and varied.
- Focus on REAL, actual places and attractions within ${cityName}.
- VERY IMPORTANT: provide realistic, accurate latitude and longitude so we can plot them on a map.
- Cover a WIDE mix of categories: landmarks, restaurants, souks/markets, cultural sites, mosques, nature spots, viewpoints, gardens, museums, nightlife, cafés, etc.
- Keep descriptions vivid and enticing.
- Include at least 3-4 hidden gems (popularity 1-3) that only locals know about.`;

  try {
    const payload = {
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: 'ROLE: You are a Moroccan city exploration API.\nCONTEXT: The user is exploring an individual city and needs a comprehensive catalog of landmarks.\nTASK: Curate a diverse and expansive list of locations.\nFORMAT: Output perfectly valid JSON arrays only without markdown formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 4000
    };

    const message = await callGroq(payload);
    const content = message.content?.trim();
    if (!content) return null;

    // Robust JSON extraction: look for [ ... ]
    const startBracket = content.indexOf('[');
    const endBracket = content.lastIndexOf(']');
    if (startBracket === -1 || endBracket === -1) {
      console.error('[CityExplorer] No JSON array found in response:', content);
      return null;
    }
    const jsonStr = content.substring(startBracket, endBracket + 1);
    const parsed = JSON.parse(jsonStr);

    // Sort by popularity descending (most seen first)
    return parsed.sort((a, b) => (b.popularity || 5) - (a.popularity || 5));
  } catch (e) {
    console.error('[CityExplorer] Generation failed:', e);
    return null;
  }
};
