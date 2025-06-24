import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const birds = await Birdpedia.find({}).sort({ 'name.common': 1 });
      res.status(200).json({ birds });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch birds', details: e.message });
    }
  } else if (req.method === 'POST') {
    try {
      const bird = new Birdpedia(req.body);
      await bird.save();
      res.status(201).json({ bird });
    } catch (e) {
      res.status(500).json({ error: 'Failed to add bird', details: e.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 