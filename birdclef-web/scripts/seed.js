import mongoose from 'mongoose';
import connectDB from '../src/lib/database.js';
import User from '../src/models/User.js';
import Birdpedia from '../src/models/Birdpedia.js';
import UserHistory from '../src/models/UserHistory.js';

const sampleBirds = [
  {
    name: {
      common: "Northern Cardinal",
      scientific: "Cardinalis cardinalis",
      family: "Cardinalidae",
      order: "Passeriformes"
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Aves",
      order: "Passeriformes",
      family: "Cardinalidae",
      genus: "Cardinalis",
      species: "cardinalis"
    },
    description: {
      physical: "Bright red songbird with distinctive crest. Males are bright red with black face mask, females are brownish with red tinges.",
      behavior: "Territorial birds that sing year-round. Often seen at bird feeders.",
      habitat: "Woodlands, gardens, and suburban areas across eastern North America.",
      diet: "Seeds, fruits, and insects.",
      breeding: "Monogamous pairs that raise 2-3 broods per year.",
      conservation: "Common and widespread, population stable."
    },
    characteristics: {
      size: {
        length: { min: 20, max: 23, unit: "cm" },
        wingspan: { min: 25, max: 31, unit: "cm" },
        weight: { min: 42, max: 48, unit: "g" }
      },
      lifespan: { wild: 15, captivity: 20, unit: "years" },
      colors: ["red", "black", "brown"],
      distinctiveFeatures: ["crest", "black face mask", "bright red plumage"]
    },
    habitat: {
      type: ["forest", "garden", "suburban"],
      range: {
        continents: ["North America"],
        countries: ["United States", "Canada", "Mexico"],
        regions: ["Eastern", "Central"]
      },
      elevation: { min: 0, max: 2000, unit: "m" },
      climate: ["temperate"]
    },
    behavior: {
      social: "pair",
      migration: "resident",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: {
      type: ["seeds", "fruits", "insects"],
      feeding: {
        method: ["foraging"],
        location: ["ground", "trees"]
      }
    },
    breeding: {
      season: { start: "March", end: "September" },
      clutchSize: { min: 3, max: 4 },
      incubationPeriod: { value: 12, unit: "days" },
      fledgingPeriod: { value: 10, unit: "days" }
    },
    conservation: {
      status: "LC",
      population: {
        trend: "stable",
        estimate: { value: 120000000, unit: "individuals" }
      },
      threats: ["habitat loss", "window collisions"]
    },
    media: {
      images: [
        {
          url: "https://example.com/cardinal-male.jpg",
          caption: "Male Northern Cardinal",
          credit: "John Doe",
          type: "male"
        }
      ],
      sounds: [
        {
          url: "https://example.com/cardinal-song.mp3",
          type: "song",
          duration: 3.5,
          description: "Clear whistled song"
        }
      ]
    },
    identification: {
      fieldMarks: ["bright red plumage", "black face mask", "crest", "red bill"],
      similarSpecies: [
        {
          name: "Scarlet Tanager",
          differences: "No crest, black wings, different bill shape"
        }
      ],
      voice: "Clear whistled song: 'what-cheer, what-cheer, what-cheer'",
      flight: "Undulating flight pattern"
    },
    tags: ["songbird", "red", "crest", "common", "feeder"],
    isExtinct: false,
    isPopular: true,
    searchCount: 2847
  },
  {
    name: {
      common: "American Robin",
      scientific: "Turdus migratorius",
      family: "Turdidae",
      order: "Passeriformes"
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Aves",
      order: "Passeriformes",
      family: "Turdidae",
      genus: "Turdus",
      species: "migratorius"
    },
    description: {
      physical: "Familiar thrush with red-orange breast, gray back, and white belly. Often seen hopping on lawns.",
      behavior: "Migratory bird that returns early in spring. Feeds on worms and insects.",
      habitat: "Lawns, gardens, woodlands, and urban areas across North America.",
      diet: "Earthworms, insects, and berries.",
      breeding: "Builds cup-shaped nests in trees and shrubs.",
      conservation: "Very common and widespread."
    },
    characteristics: {
      size: {
        length: { min: 23, max: 28, unit: "cm" },
        wingspan: { min: 31, max: 41, unit: "cm" },
        weight: { min: 77, max: 85, unit: "g" }
      },
      lifespan: { wild: 2, captivity: 14, unit: "years" },
      colors: ["red-orange", "gray", "white", "black"],
      distinctiveFeatures: ["red-orange breast", "white eye ring", "yellow bill"]
    },
    habitat: {
      type: ["lawn", "garden", "forest", "urban"],
      range: {
        continents: ["North America"],
        countries: ["United States", "Canada", "Mexico"],
        regions: ["North America"]
      },
      elevation: { min: 0, max: 3000, unit: "m" },
      climate: ["temperate", "boreal"]
    },
    behavior: {
      social: "flock",
      migration: "migratory",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: {
      type: ["earthworms", "insects", "berries"],
      feeding: {
        method: ["foraging"],
        location: ["ground"]
      }
    },
    breeding: {
      season: { start: "April", end: "July" },
      clutchSize: { min: 3, max: 5 },
      incubationPeriod: { value: 14, unit: "days" },
      fledgingPeriod: { value: 14, unit: "days" }
    },
    conservation: {
      status: "LC",
      population: {
        trend: "stable",
        estimate: { value: 310000000, unit: "individuals" }
      },
      threats: ["habitat loss", "pesticides"]
    },
    tags: ["thrush", "migratory", "lawn", "common"],
    isExtinct: false,
    isPopular: true,
    searchCount: 2156
  },
  {
    name: {
      common: "Blue Jay",
      scientific: "Cyanocitta cristata",
      family: "Corvidae",
      order: "Passeriformes"
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Aves",
      order: "Passeriformes",
      family: "Corvidae",
      genus: "Cyanocitta",
      species: "cristata"
    },
    description: {
      physical: "Striking blue and white bird with crest and black necklace. Known for intelligence and vocalizations.",
      behavior: "Intelligent and social birds that can mimic other species. Often aggressive at feeders.",
      habitat: "Forests, parks, and suburban areas across eastern North America.",
      diet: "Acorns, nuts, seeds, insects, and eggs.",
      breeding: "Monogamous pairs that defend territories aggressively.",
      conservation: "Common and widespread."
    },
    characteristics: {
      size: {
        length: { min: 22, max: 30, unit: "cm" },
        wingspan: { min: 34, max: 43, unit: "cm" },
        weight: { min: 70, max: 100, unit: "g" }
      },
      lifespan: { wild: 7, captivity: 26, unit: "years" },
      colors: ["blue", "white", "black"],
      distinctiveFeatures: ["crest", "blue plumage", "black necklace", "white face"]
    },
    habitat: {
      type: ["forest", "park", "suburban"],
      range: {
        continents: ["North America"],
        countries: ["United States", "Canada"],
        regions: ["Eastern"]
      },
      elevation: { min: 0, max: 2500, unit: "m" },
      climate: ["temperate"]
    },
    behavior: {
      social: "flock",
      migration: "partial",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: {
      type: ["acorns", "nuts", "seeds", "insects", "eggs"],
      feeding: {
        method: ["foraging", "caching"],
        location: ["trees", "ground"]
      }
    },
    breeding: {
      season: { start: "March", end: "July" },
      clutchSize: { min: 2, max: 7 },
      incubationPeriod: { value: 17, unit: "days" },
      fledgingPeriod: { value: 17, unit: "days" }
    },
    conservation: {
      status: "LC",
      population: {
        trend: "stable",
        estimate: { value: 17000000, unit: "individuals" }
      },
      threats: ["habitat loss"]
    },
    tags: ["corvid", "intelligent", "blue", "crest", "mimic"],
    isExtinct: false,
    isPopular: true,
    searchCount: 1943
  },
  {
    name: {
      common: "Dodo",
      scientific: "Raphus cucullatus",
      family: "Columbidae",
      order: "Columbiformes"
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Aves",
      order: "Columbiformes",
      family: "Columbidae",
      genus: "Raphus",
      species: "cucullatus"
    },
    description: {
      physical: "Large, flightless bird with gray plumage, large hooked bill, and small wings. Iconic symbol of extinction.",
      behavior: "Flightless bird that was tame and unafraid of humans, leading to its rapid extinction.",
      habitat: "Forests of Mauritius island in the Indian Ocean.",
      diet: "Fruits, seeds, and possibly small animals.",
      breeding: "Laid single egg on ground in simple nest.",
      conservation: "Extinct due to human hunting and introduced species."
    },
    characteristics: {
      size: {
        length: { min: 100, max: 110, unit: "cm" },
        wingspan: { min: 0, max: 0, unit: "cm" },
        weight: { min: 10000, max: 17000, unit: "g" }
      },
      lifespan: { wild: 20, captivity: 0, unit: "years" },
      colors: ["gray", "white", "black"],
      distinctiveFeatures: ["flightless", "large bill", "small wings", "gray plumage"]
    },
    habitat: {
      type: ["forest"],
      range: {
        continents: ["Africa"],
        countries: ["Mauritius"],
        regions: ["Indian Ocean"]
      },
      elevation: { min: 0, max: 500, unit: "m" },
      climate: ["tropical"]
    },
    behavior: {
      social: "solitary",
      migration: "resident",
      activity: "diurnal",
      nesting: "ground"
    },
    diet: {
      type: ["fruits", "seeds"],
      feeding: {
        method: ["foraging"],
        location: ["ground"]
      }
    },
    breeding: {
      season: { start: "August", end: "January" },
      clutchSize: { min: 1, max: 1 },
      incubationPeriod: { value: 49, unit: "days" },
      fledgingPeriod: { value: 0, unit: "days" }
    },
    conservation: {
      status: "EX",
      population: {
        trend: "extinct",
        estimate: { value: 0, unit: "individuals" }
      },
      threats: ["hunting", "introduced species", "habitat destruction"]
    },
    tags: ["extinct", "flightless", "island", "symbol"],
    isExtinct: true,
    extinctYear: 1681,
    isPopular: true,
    searchCount: 1500
  }
];

const sampleUsers = [
  {
    name: "John Birdwatcher",
    email: "john@example.com",
    password: "password123",
    preferences: {
      theme: "light",
      notifications: true
    }
  },
  {
    name: "Sarah Ornithologist",
    email: "sarah@example.com",
    password: "password123",
    preferences: {
      theme: "dark",
      notifications: true
    }
  }
];

const sampleHistory = [
  {
    type: "audio",
    species: {
      name: "Northern Cardinal",
      scientificName: "Cardinalis cardinalis"
    },
    confidence: 95,
    fileInfo: {
      originalName: "cardinal_song.wav",
      fileName: "cardinal_song_001.wav",
      fileSize: 2048576,
      mimeType: "audio/wav",
      duration: 3.5
    },
    location: {
      address: "Central Park, New York",
      city: "New York",
      state: "NY",
      country: "USA"
    },
    metadata: {
      weather: "sunny",
      timeOfDay: "morning",
      season: "spring",
      habitat: "park"
    },
    aiAnalysis: {
      model: "BirdCLEF-v1",
      version: "1.0.0",
      processingTime: 2.3,
      additionalSpecies: [
        { name: "American Robin", confidence: 15 }
      ]
    },
    tags: ["song", "morning", "spring"],
    notes: "Beautiful cardinal song recorded early morning"
  },
  {
    type: "image",
    species: {
      name: "Blue Jay",
      scientificName: "Cyanocitta cristata"
    },
    confidence: 88,
    fileInfo: {
      originalName: "blue_jay.jpg",
      fileName: "blue_jay_001.jpg",
      fileSize: 1048576,
      mimeType: "image/jpeg",
      dimensions: {
        width: 1920,
        height: 1080
      }
    },
    location: {
      address: "Backyard, Brooklyn",
      city: "Brooklyn",
      state: "NY",
      country: "USA"
    },
    metadata: {
      weather: "partly cloudy",
      timeOfDay: "afternoon",
      season: "summer",
      habitat: "backyard"
    },
    aiAnalysis: {
      model: "BirdCLEF-v1",
      version: "1.0.0",
      processingTime: 1.8,
      additionalSpecies: [
        { name: "Steller's Jay", confidence: 8 }
      ]
    },
    tags: ["feeder", "afternoon", "summer"],
    notes: "Blue jay at the bird feeder"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Birdpedia.deleteMany({});
    await UserHistory.deleteMany({});
    
    // Seed users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }
    
    // Seed birds
    console.log('🐦 Creating sample birds...');
    for (const birdData of sampleBirds) {
      const bird = new Birdpedia(birdData);
      await bird.save();
      console.log(`✅ Created bird: ${bird.name.common}`);
    }
    
    // Seed history for first user
    console.log('📜 Creating sample history...');
    for (const historyData of sampleHistory) {
      const history = new UserHistory({
        ...historyData,
        userId: createdUsers[0]._id
      });
      await history.save();
      console.log(`✅ Created history entry: ${history.species.name}`);
    }
    
    // Update user stats
    console.log('📊 Updating user stats...');
    const stats = await UserHistory.getUserStats(createdUsers[0]._id);
    createdUsers[0].stats = stats;
    await createdUsers[0].save();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📈 Created ${createdUsers.length} users`);
    console.log(`🐦 Created ${sampleBirds.length} birds`);
    console.log(`📜 Created ${sampleHistory.length} history entries`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase(); 