import formidable from 'formidable';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';

export const config = {
  api: {
    bodyParser: false,
  },
};

// --- MongoDB connection ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

// --- Mongoose Models (copied from express.js) ---
const userHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["audio", "image"], required: true },
  species: {
    name: { type: String, required: true },
    scientificName: { type: String, required: true }
  },
  confidence: { type: Number, required: true, min: 0, max: 100 },
  fileInfo: {
    originalName: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    duration: Number,
    dimensions: { width: Number, height: Number }
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  metadata: {
    weather: String,
    timeOfDay: String,
    season: String,
    habitat: String
  },
  aiAnalysis: {
    model: String,
    version: String,
    processingTime: Number,
    additionalSpecies: [{ name: String, confidence: Number }]
  },
  tags: [String],
  notes: String,
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });
const UserHistory = mongoose.models.UserHistory || mongoose.model("UserHistory", userHistorySchema);

const birdpediaSchema = new mongoose.Schema({
  name: {
    common: { type: String, required: true, index: true },
    scientific: { type: String, required: true, index: true },
    family: String,
    order: String
  },
  taxonomy: {
    kingdom: { type: String, default: 'Animalia' },
    phylum: { type: String, default: 'Chordata' },
    class: { type: String, default: 'Aves' },
    order: String,
    family: String,
    genus: String,
    species: String
  },
  description: {
    physical: String,
    behavior: String,
    habitat: String,
    diet: String,
    breeding: String,
    conservation: String
  },
  characteristics: {
    size: {
      length: { min: Number, max: Number, unit: String },
      wingspan: { min: Number, max: Number, unit: String },
      weight: { min: Number, max: Number, unit: String }
    },
    lifespan: { wild: Number, captivity: Number, unit: String },
    colors: [String],
    distinctiveFeatures: [String]
  },
  habitat: [String],
  range: {
    continents: [String],
    countries: [String],
    regions: [String]
  },
  tags: [String],
  isExtinct: { type: Boolean, default: false },
  extinctYear: Number,
  isPopular: { type: Boolean, default: false },
  searchCount: { type: Number, default: 0 }
}, { timestamps: true });
const Birdpedia = mongoose.models.Birdpedia || mongoose.model('Birdpedia', birdpediaSchema);

// --- Gemini setup ---
const genAI = new GoogleGenAI(process.env.GOOGLE_GENAI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'File upload error' });
    const file = files.audio;
    if (!file) return res.status(400).json({ error: 'No audio file uploaded' });
    const { userId, location, metadata } = fields;
    try {
      // Upload file to Gemini
      const uploadedFile = await genAI.files.upload({ file: file.filepath, config: { mimeType: file.mimetype } });
      const fileUri = uploadedFile.uri;
      // Prompt
      const prompt = `You are an expert ornithologist AI. Analyze the following bird audio recording and return a JSON object with these fields: commonName, scientificName, confidence (0-100), description, region, notes. If you cannot identify, set all fields to 'Unknown' or 0. Only return the JSON object.`;
      // Call Gemini
      const result = await genAI.generate({ prompt, file: fileUri });
      const aiResponse = result.data;
      // Save to user history
      const historyEntry = new UserHistory({
        userId,
        type: 'audio',
        species: {
          name: aiResponse.commonName,
          scientificName: aiResponse.scientificName
        },
        confidence: aiResponse.confidence,
        fileInfo: {
          originalName: file.originalFilename,
          fileName: file.newFilename,
          fileSize: file.size,
          mimeType: file.mimetype
        },
        location: location || {},
        metadata: metadata || {},
        aiAnalysis: {
          model: 'gemini-2.0-flash',
          version: '1.0',
          processingTime: 0,
          additionalSpecies: []
        },
        tags: [],
        notes: '',
        isFavorite: false
      });
      await historyEntry.save();
      // Add to Birdpedia if new species
      if (aiResponse.scientificName && aiResponse.commonName && aiResponse.scientificName !== 'Unknown') {
        const existing = await Birdpedia.findOne({ 'name.scientific': aiResponse.scientificName });
        if (!existing) {
          const newBird = new Birdpedia({
            name: {
              common: aiResponse.commonName,
              scientific: aiResponse.scientificName
            },
            description: {
              physical: aiResponse.description || '',
              behavior: '',
              habitat: '',
              diet: '',
              breeding: '',
              conservation: ''
            },
            range: { regions: [aiResponse.region || ''] },
            tags: [],
            isExtinct: false,
            isPopular: false
          });
          await newBird.save();
        }
      }
      fs.unlinkSync(file.filepath);
      res.status(200).json({ result: aiResponse, history: historyEntry });
    } catch (e) {
      res.status(500).json({ error: 'AI analysis or DB save failed', details: e.message });
    }
  });
} 