import express from "express";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { GoogleGenAI, createUserContent } from "@google/genai";
import { resolve } from "path";
import { unlinkSync } from "fs";

const app = express();
const PORT = 3000;
const MONGODB_URI="mongodb+srv://Kamal:Premakanth%40123@database.ca2mjix.mongodb.net/BirdClef?retryWrites=true&w=majority&appName=DATABASEE";

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

// --- MONGOOSE MODELS ---
const userSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  preferences: {
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    notifications: { type: Boolean, default: true }
  },
  stats: {
    totalIdentifications: { type: Number, default: 0 },
    uniqueSpecies: { type: Number, default: 0 },
    audioRecordings: { type: Number, default: 0 },
    imagesUploaded: { type: Number, default: 0 },
    averageConfidence: { type: Number, default: 0 }
  }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

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

// --- BIRDPEDIA MODEL ---
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

// --- CONNECT TO MONGODB ---
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- USER ROUTES ---
// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    if (await User.findOne({ email })) return res.status(409).json({ error: "Email already exists" });
    const user = new User({ name, email, password });
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ user: userObj });
  } catch {
    res.status(500).json({ error: "Signup failed" });
  }
});
// Signin
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ user: userObj });
  } catch {
    res.status(500).json({ error: "Signin failed" });
  }
});
// Get all users
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, "-password");
  res.json({ users });
});
// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});
// --- USER HISTORY ROUTES ---
// Create history entry
app.post("/api/history", async (req, res) => {
  try {
    console.log('HISTORY POST BODY:', req.body);
    const { userId, type, species, confidence, fileInfo, location, metadata, aiAnalysis } = req.body;
    if (!userId || !type || !species || confidence === undefined) {
      console.log('HISTORY POST ERROR: Missing required fields');
      return res.status(400).json({ error: "Missing required fields" });
    }
    const entry = new UserHistory({ userId, type, species, confidence, fileInfo, location, metadata, aiAnalysis });
    await entry.save();
    console.log('HISTORY ENTRY CREATED:', entry);
    // --- Add to Birdpedia if new species ---
    if (species && species.scientificName && species.name && species.scientificName !== 'Unknown') {
      const existing = await Birdpedia.findOne({ 'name.scientific': species.scientificName });
      if (!existing) {
        const newBird = new Birdpedia({
          name: {
            common: species.name,
            scientific: species.scientificName
          },
          description: {
            physical: '',
            behavior: '',
            habitat: '',
            diet: '',
            breeding: '',
            conservation: ''
          },
          isPopular: false,
          searchCount: 0
        });
        await newBird.save();
        console.log('NEW BIRD ADDED TO BIRDPEDIA:', newBird);
      }
    }
    res.status(201).json({ history: entry });
  } catch (err) {
    console.error('HISTORY POST ERROR:', err);
    res.status(500).json({ error: "Failed to create history", details: err.message });
  }
});
// Get user history
app.get("/api/history", async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const history = await UserHistory.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
  const total = await UserHistory.countDocuments({ userId });
  res.json({ history, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
});
// Get user stats
app.get("/api/user/stats", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const stats = await UserHistory.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        totalIdentifications: { $sum: 1 },
        uniqueSpecies: { $addToSet: '$species.name' },
        averageConfidence: { $avg: '$confidence' },
        audioRecordings: { $sum: { $cond: [{ $eq: ['$type', 'audio'] }, 1, 0] } },
        imagesUploaded: { $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] } }
      }
    },
    {
      $project: {
        totalIdentifications: 1,
        uniqueSpecies: { $size: '$uniqueSpecies' },
        averageConfidence: { $round: ['$averageConfidence', 1] },
        audioRecordings: 1,
        imagesUploaded: 1
      }
    }
  ]);
  res.json({ stats: stats[0] || {
    totalIdentifications: 0,
    uniqueSpecies: 0,
    averageConfidence: 0,
    audioRecordings: 0,
    imagesUploaded: 0
  }});
});
// --- (Your /predict route and other AI routes can stay as is) ---
// Google GenAI setup (keep your existing /predict route)
const API_KEY = "AIzaSyD7awi7Hi6W2KL6iMTr6J9QGKBj0YM_MTI"; // replace with your actual key
const ai = new GoogleGenAI({ apiKey: API_KEY });
app.post("/predict", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }
    const filePath = resolve(req.file.path);
    const mimeType = req.file.mimetype;
    console.log("Received file:", filePath);
    // Upload the file to Google
    const uploadedFile = await ai.files.upload({
      file: filePath,
      config: { mimeType: mimeType },
    });
    console.log("File uploaded to Google:", uploadedFile.uri);
    // Improved prompt for Gemini
    const prompt = `You are an expert ornithologist AI. Analyze the following bird audio recording and return a JSON object with the following fields: 
{
  \"commonName\": string, // The most likely common name of the bird (e.g., 'Northern Cardinal')
  \"scientificName\": string, // The scientific name (e.g., 'Cardinalis cardinalis')
  \"confidence\": number, // Confidence in identification (0-100)
  \"description\": string, // One-line description of the bird
  \"region\": string, // Likely region or country
  \"notes\": string // Any extra notes or uncertainty
}
If you cannot identify the bird, set all fields to 'Unknown' or 0. Only return the JSON object, nothing else. Here is the audio:`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        prompt,
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
      ]),
    });
    console.log("Gemini Response:", response.text);
    unlinkSync(filePath);
    res.json({ gemini_response: response.text });
  } catch (err) {
    console.error("Error in /predict:", err);
    res.status(500).json({ error: "Failed to process the audio" });
  }
});

// --- IMAGE PREDICTION ROUTE ---
app.post("/predict-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }
    const filePath = resolve(req.file.path);
    const mimeType = req.file.mimetype;
    console.log("Received image file:", filePath);
    // Upload the file to Google
    const uploadedFile = await ai.files.upload({
      file: filePath,
      config: { mimeType: mimeType },
    });
    console.log("Image file uploaded to Google:", uploadedFile.uri);
    // Improved prompt for Gemini
    const prompt = `You are an expert ornithologist AI. Analyze the following bird image and return a JSON object with the following fields: 
{
  \"commonName\": string, // The most likely common name of the bird (e.g., 'Northern Cardinal')
  \"scientificName\": string, // The scientific name (e.g., 'Cardinalis cardinalis')
  \"confidence\": number, // Confidence in identification (0-100)
  \"description\": string, // One-line description of the bird
  \"region\": string, // Likely region or country
  \"notes\": string // Any extra notes or uncertainty
}
If you cannot identify the bird, set all fields to 'Unknown' or 0. Only return the JSON object, nothing else. Here is the image:`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        prompt,
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
      ]),
    });
    console.log("Gemini Image Response:", response.text);
    unlinkSync(filePath);
    res.json({ gemini_response: response.text });
  } catch (err) {
    console.error("Error in /predict-image:", err);
    res.status(500).json({ error: "Failed to process the image" });
  }
});

// --- BIRDPEDIA ROUTES ---
// Get all birds (with optional search)
app.get('/api/birdpedia', async (req, res) => {
  try {
    const { q, limit = 50 } = req.query;
    let query = {};
    if (q) {
      query = {
        $or: [
          { 'name.common': { $regex: q, $options: 'i' } },
          { 'name.scientific': { $regex: q, $options: 'i' } },
          { 'description.physical': { $regex: q, $options: 'i' } }
        ]
      };
    }
    const birds = await Birdpedia.find(query).limit(parseInt(limit));
    res.json({ birds });
  } catch {
    res.status(500).json({ error: 'Failed to fetch birds' });
  }
});
// Get single bird by ID
app.get('/api/birdpedia/:id', async (req, res) => {
  try {
    const bird = await Birdpedia.findById(req.params.id);
    if (!bird) return res.status(404).json({ error: 'Bird not found' });
    res.json({ bird });
  } catch {
    res.status(500).json({ error: 'Failed to fetch bird' });
  }
});
// Add new bird
app.post('/api/birdpedia', async (req, res) => {
  try {
    const bird = new Birdpedia(req.body);
    await bird.save();
    res.status(201).json({ bird });
  } catch {
    res.status(500).json({ error: 'Failed to add bird' });
  }
});
// Update bird
app.put('/api/birdpedia/:id', async (req, res) => {
  try {
    const bird = await Birdpedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bird) return res.status(404).json({ error: 'Bird not found' });
    res.json({ bird });
  } catch {
    res.status(500).json({ error: 'Failed to update bird' });
  }
});
// Delete bird
app.delete('/api/birdpedia/:id', async (req, res) => {
  try {
    const bird = await Birdpedia.findByIdAndDelete(req.params.id);
    if (!bird) return res.status(404).json({ error: 'Bird not found' });
    res.json({ message: 'Bird deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete bird' });
  }
});

// --- CLERK USER SYNC ROUTE ---
app.post('/api/users/sync', async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;
    console.log('SYNC REQUEST:', { clerkId, email, name });
    if (!clerkId || !email || !name) {
      return res.status(400).json({ error: 'clerkId, email, and name are required' });
    }
    let user = await User.findOne({ _id: clerkId });
    if (!user) {
      user = new User({ _id: clerkId, email, name, password: 'clerk-oauth' }); // password is a dummy value
      await user.save();
      console.log('USER CREATED:', user);
    } else {
      console.log('USER EXISTS:', user);
    }
    res.json({ user });
  } catch (err) {
    console.error('SYNC ERROR:', err);
    res.status(500).json({ error: 'Failed to sync user', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
