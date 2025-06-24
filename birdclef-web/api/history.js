import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const entry = new UserHistory(req.body);
      await entry.save();
      res.status(201).json({ history: entry });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save history', details: e.message });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    try {
      const history = await UserHistory.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ history });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch history', details: e.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 