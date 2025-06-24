import mongoose from 'mongoose';

const birdpediaSchema = new mongoose.Schema({
  name: {
    common: {
      type: String,
      required: true,
      index: true
    },
    scientific: {
      type: String,
      required: true,
      index: true
    },
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
      length: {
        min: Number,
        max: Number,
        unit: { type: String, default: 'cm' }
      },
      wingspan: {
        min: Number,
        max: Number,
        unit: { type: String, default: 'cm' }
      },
      weight: {
        min: Number,
        max: Number,
        unit: { type: String, default: 'g' }
      }
    },
    lifespan: {
      wild: Number,
      captivity: Number,
      unit: { type: String, default: 'years' }
    },
    colors: [String],
    distinctiveFeatures: [String]
  },
  habitat: {
    type: [String], // e.g., ['forest', 'wetland', 'grassland']
    range: {
      continents: [String],
      countries: [String],
      regions: [String]
    },
    elevation: {
      min: Number,
      max: Number,
      unit: { type: String, default: 'm' }
    },
    climate: [String] // e.g., ['temperate', 'tropical', 'arctic']
  },
  behavior: {
    social: {
      type: String,
      enum: ['solitary', 'pair', 'flock', 'colony', 'mixed']
    },
    migration: {
      type: String,
      enum: ['resident', 'migratory', 'partial', 'nomadic']
    },
    activity: {
      type: String,
      enum: ['diurnal', 'nocturnal', 'crepuscular']
    },
    nesting: {
      type: String,
      enum: ['ground', 'tree', 'cavity', 'cliff', 'water']
    }
  },
  diet: {
    type: [String], // e.g., ['insects', 'seeds', 'fruits', 'fish']
    feeding: {
      method: [String], // e.g., ['foraging', 'hunting', 'scavenging']
      location: [String] // e.g., ['ground', 'water', 'air', 'trees']
    }
  },
  breeding: {
    season: {
      start: String,
      end: String
    },
    clutchSize: {
      min: Number,
      max: Number
    },
    incubationPeriod: {
      value: Number,
      unit: { type: String, default: 'days' }
    },
    fledgingPeriod: {
      value: Number,
      unit: { type: String, default: 'days' }
    }
  },
  conservation: {
    status: {
      type: String,
      enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD'],
      default: 'LC'
    },
    population: {
      trend: {
        type: String,
        enum: ['increasing', 'decreasing', 'stable', 'unknown']
      },
      estimate: {
        value: Number,
        unit: String
      }
    },
    threats: [String]
  },
  media: {
    images: [{
      url: String,
      caption: String,
      credit: String,
      type: { type: String, enum: ['male', 'female', 'juvenile', 'habitat', 'behavior'] }
    }],
    sounds: [{
      url: String,
      type: { type: String, enum: ['song', 'call', 'alarm', 'display'] },
      duration: Number,
      description: String
    }],
    videos: [{
      url: String,
      caption: String,
      duration: Number
    }]
  },
  identification: {
    fieldMarks: [String],
    similarSpecies: [{
      name: String,
      differences: String
    }],
    voice: String,
    flight: String
  },
  distribution: {
    mapUrl: String,
    coordinates: [{
      latitude: Number,
      longitude: Number,
      region: String
    }]
  },
  research: {
    studies: [{
      title: String,
      authors: [String],
      year: Number,
      journal: String,
      doi: String
    }],
    data: {
      sightings: { type: Number, default: 0 },
      identifications: { type: Number, default: 0 },
      averageConfidence: { type: Number, default: 0 }
    }
  },
  tags: [String],
  isExtinct: {
    type: Boolean,
    default: false
  },
  extinctYear: Number,
  isPopular: {
    type: Boolean,
    default: false
  },
  searchCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better search performance
birdpediaSchema.index({ 'name.common': 'text', 'name.scientific': 'text', 'description.physical': 'text' });
birdpediaSchema.index({ 'taxonomy.family': 1 });
birdpediaSchema.index({ 'taxonomy.order': 1 });
birdpediaSchema.index({ 'habitat.type': 1 });
birdpediaSchema.index({ 'conservation.status': 1 });
birdpediaSchema.index({ isExtinct: 1 });
birdpediaSchema.index({ isPopular: 1 });
birdpediaSchema.index({ searchCount: -1 });

// Virtual for full scientific name
birdpediaSchema.virtual('fullScientificName').get(function() {
  return `${this.name.scientific}`;
});

// Virtual for conservation status description
birdpediaSchema.virtual('conservationDescription').get(function() {
  const statusMap = {
    'LC': 'Least Concern',
    'NT': 'Near Threatened',
    'VU': 'Vulnerable',
    'EN': 'Endangered',
    'CR': 'Critically Endangered',
    'EW': 'Extinct in the Wild',
    'EX': 'Extinct',
    'DD': 'Data Deficient'
  };
  return statusMap[this.conservation.status] || 'Unknown';
});

// Static method to search birds
birdpediaSchema.statics.searchBirds = async function(query, filters = {}) {
  const searchQuery = {
    $or: [
      { 'name.common': { $regex: query, $options: 'i' } },
      { 'name.scientific': { $regex: query, $options: 'i' } },
      { 'description.physical': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  // Apply filters
  if (filters.family) searchQuery['taxonomy.family'] = filters.family;
  if (filters.order) searchQuery['taxonomy.order'] = filters.order;
  if (filters.habitat) searchQuery['habitat.type'] = { $in: filters.habitat };
  if (filters.conservationStatus) searchQuery['conservation.status'] = filters.conservationStatus;
  if (filters.isExtinct !== undefined) searchQuery.isExtinct = filters.isExtinct;

  return await this.find(searchQuery)
    .sort({ searchCount: -1, 'name.common': 1 })
    .limit(filters.limit || 20);
};

// Static method to get popular birds
birdpediaSchema.statics.getPopularBirds = async function(limit = 10) {
  return await this.find({ isPopular: true })
    .sort({ searchCount: -1 })
    .limit(limit);
};

// Static method to get extinct birds
birdpediaSchema.statics.getExtinctBirds = async function(limit = 20) {
  return await this.find({ isExtinct: true })
    .sort({ extinctYear: -1 })
    .limit(limit);
};

// Static method to get birds by family
birdpediaSchema.statics.getBirdsByFamily = async function(family, limit = 50) {
  return await this.find({ 'taxonomy.family': family })
    .sort({ 'name.common': 1 })
    .limit(limit);
};

// Method to increment search count
birdpediaSchema.methods.incrementSearchCount = async function() {
  this.searchCount += 1;
  await this.save();
};

// Ensure virtual fields are serialized
birdpediaSchema.set('toJSON', {
  virtuals: true
});

const Birdpedia = mongoose.models.Birdpedia || mongoose.model('Birdpedia', birdpediaSchema);

export default Birdpedia; 