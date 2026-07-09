require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const axios = require('axios');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) cb(null, true);
    else cb(new Error('Only CSV files allowed'));
  }
});

function isValidRecord(record) {
  const allValues = Object.entries(record).map(([k, v]) => ({ k: k.toLowerCase(), v: String(v).trim() }));
  const hasEmail = allValues.some(({ k, v }) => (k.includes('email') || k.includes('mail')) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const hasMobile = allValues.some(({ k, v }) => (k.includes('phone') || k.includes('mobile') || k.includes('contact') || k.includes('number') || k.includes('cell') || k.includes('tel')) && v.replace(/[\s\-\+\(\)]/g, '').length >= 7);
  return hasEmail || hasMobile;
}

function buildPrompt(records) {
  return `You are an expert CRM data extraction assistant for GrowEasy CRM.

Your job: Map the provided CSV records to the GrowEasy CRM schema. The CSV may have any column names, layouts, or structures.

=== GROWEASY CRM SCHEMA ===
{
  "created_at": "ISO 8601 date string parseable by new Date() — use current time if missing",
  "name": "Full name of the lead",
  "email": "Primary email address",
  "country_code": "Country dialing code like +91, +1 etc.",
  "mobile_without_country_code": "Mobile number digits only, NO country code, 10 digits preferred",
  "company": "Company or organization name",
  "city": "City name",
  "state": "State or province name",
  "country": "Country name",
  "lead_owner": "Person responsible for this lead (email or name)",
  "crm_status": "One of the EXACT allowed values below",
  "crm_note": "Extra emails, phones, remarks, follow-up notes, comments",
  "data_source": "One of the EXACT allowed values below or empty string",
  "possession_time": "Property possession timeline if mentioned",
  "description": "Any additional useful description"
}

=== ALLOWED crm_status VALUES (use EXACTLY one) ===
- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE
If unclear or missing, use: GOOD_LEAD_FOLLOW_UP

=== STRICT RULES ===
1. Intelligently map columns even if names differ (e.g., "Phone" → mobile, "Full Name" → name, "Status" → crm_status).
2. Strip country codes from mobile numbers (e.g., "+91 9876543210" → mobile="9876543210", country_code="+91").
3. Put all remarks, comments, notes, and extra info into crm_note.
4. created_at MUST be parseable by JavaScript's new Date().
5. If a record has NEITHER a valid email NOR a mobile number, set action to "skip".
6. Return ONLY a valid JSON object. No markdown, no explanation, no code fences.

=== INPUT RECORDS ===
${JSON.stringify(records, null, 2)}

=== OUTPUT FORMAT ===
Return a JSON OBJECT with a single key "leads" containing an array where each object has:
- "_action": "import" or "skip"
- "_skip_reason": reason if skipped (else omit)
- All CRM fields listed above

Example:
{
  "leads": [
    {"_action":"import","created_at":"2026-05-13 14:20:48","name":"John Doe","email":"john@example.com","country_code":"+91","mobile_without_country_code":"9876543210","company":"Acme","city":"Mumbai","state":"Maharashtra","country":"India","lead_owner":"","crm_status":"GOOD_LEAD_FOLLOW_UP","crm_note":"","data_source":"","possession_time":"","description":""},
    {"_action":"skip","_skip_reason":"No email or mobile found"}
  ]
}`;
}

async function callOpenAI(records) {
  const url = `https://api.openai.com/v1/chat/completions`;
  const body = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: buildPrompt(records) }],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  };
  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    timeout: 60000
  });
  const raw = response.data?.choices?.[0]?.message?.content || '{"leads":[]}';
  const clean = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(clean).leads || []; } catch { throw new Error('OpenAI invalid JSON'); }
}

async function callGemini(records) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(records) }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
  };
  const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 60000 });
  const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"leads":[]}';
  const clean = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(clean).leads || []; } catch { throw new Error('Gemini invalid JSON'); }
}

async function callAIWithRetry(records, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (OPENAI_API_KEY && !OPENAI_API_KEY.includes('sk-mnopabcd')) {
        return await callOpenAI(records);
      } else if (GEMINI_API_KEY) {
        return await callGemini(records);
      } else {
        throw new Error('No valid API keys configured.');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (attempt === retries) throw err;
      const waitMs = status === 429 ? 8000 * (attempt + 1) : 2000 * (attempt + 1);
      console.log(`Retry ${attempt + 1} after ${waitMs}ms (status: ${status})...`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No CSV file provided' });
  if (!OPENAI_API_KEY && !GEMINI_API_KEY) return res.status(500).json({ error: 'No API keys set in backend/.env' });

  const rows = [];
  const stream = Readable.from(req.file.buffer);

  stream
    .pipe(csv())
    .on('data', d => rows.push(d))
    .on('end', async () => {
      const validRows = rows.filter(isValidRecord);
      const invalidRows = rows.filter(r => !isValidRecord(r));

      const imported = [];
      const skipped = invalidRows.map(r => ({ ...r, skip_reason: 'Missing email and mobile number' }));

      for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
        const batch = validRows.slice(i, i + BATCH_SIZE);
        try {
          const results = await callAIWithRetry(batch);
          results.forEach((item, idx) => {
            const { _action, _skip_reason, ...fields } = item;
            if (_action === 'skip' || _action === 'SKIP') skipped.push({ ...(batch[idx] || {}), skip_reason: _skip_reason || 'Skipped by AI' });
            else imported.push(fields);
          });
        } catch (err) {
          const status = err?.response?.status;
          console.error(`Batch ${i}–${i + BATCH_SIZE} error (${status}):`, err.message);
          if (status === 429) {
            console.log('Rate limit hit — waiting 15s before retrying batch...');
            await new Promise(r => setTimeout(r, 15000));
            try {
              const retryResult = await callAIWithRetry(batch, 0); // 0 retries on the fallback attempt
              retryResult.forEach((item) => {
                const { _action, _skip_reason, ...fields } = item;
                if (_action === 'skip' || _action === 'SKIP') skipped.push({ ...fields, skip_reason: _skip_reason || 'Skipped by AI' });
                else imported.push(fields);
              });
            } catch {
              batch.forEach(r => skipped.push({ ...r, skip_reason: 'Rate limit exceeded – try with smaller CSV' }));
            }
          } else {
            batch.forEach(r => skipped.push({ ...r, skip_reason: 'AI processing error' }));
          }
        }
        if (i + BATCH_SIZE < validRows.length) await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
      }

      res.json({ total: rows.length, imported_count: imported.length, skipped_count: skipped.length, imported, skipped });
    })
    .on('error', err => res.status(500).json({ error: 'CSV parse error: ' + err.message }));
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', openai: !!OPENAI_API_KEY && !OPENAI_API_KEY.includes('sk-mnopabcd'), gemini: !!GEMINI_API_KEY }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
