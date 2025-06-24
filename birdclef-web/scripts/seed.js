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
      physical: "The Northern Cardinal is a medium-sized songbird with a distinctive crest. Males are bright red with a black face mask, while females are brownish-red with red accents.",
      behavior: "Cardinals are territorial birds that form monogamous pairs. They are known for their beautiful songs and are active year-round.",
      habitat: "Found in woodlands, gardens, and suburban areas across eastern North America.",
      diet: "Omnivorous, feeding on seeds, fruits, and insects.",
      breeding: "Breeding season runs from March to September. They build cup-shaped nests in dense vegetation.",
      conservation: "Common and widespread, with stable populations."
    },
    characteristics: {
      size: {
        length: { min: 21, max: 23, unit: "cm" },
        wingspan: { min: 25, max: 31, unit: "cm" },
        weight: { min: 42, max: 48, unit: "g" }
      },
      lifespan: { wild: 15, captivity: 20, unit: "years" },
      colors: ["red", "black", "brown", "orange"],
      distinctiveFeatures: ["crest", "black face mask", "bright red plumage"]
    },
    habitat: ["forest", "garden", "suburban"],
    range: {
      continents: ["North America"],
      countries: ["USA", "Canada", "Mexico"],
      regions: ["Eastern", "Central", "Southwestern"]
    },
    elevation: { min: 0, max: 2000, unit: "m" },
    climate: ["temperate"],
    behavior: {
      social: "pair",
      migration: "resident",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: ["seeds", "fruits", "insects"],
    feeding: {
      method: ["foraging"],
      location: ["ground", "trees"]
    },
    breeding: {
      season: { start: "March", end: "September" },
      clutchSize: { min: 2, max: 5 },
      incubationPeriod: { value: 12, unit: "days" },
      fledgingPeriod: { value: 10, unit: "days" }
    },
    conservation: {
      status: "LC",
      population: {
        trend: "stable",
        estimate: { value: 120000000, unit: "individuals" }
      },
      threats: ["habitat loss", "window collisions", "domestic cats"]
    },
    media: {
      images: [
        {
          url: "https://example.com/cardinal_male.jpg",
          caption: "Male Northern Cardinal",
          credit: "John Smith",
          type: "male"
        }
      ],
      sounds: [
        {
          url: "https://example.com/cardinal_song.mp3",
          type: "song",
          duration: 3.5,
          description: "Male territorial song"
        }
      ]
    },
    identification: {
      fieldMarks: ["bright red plumage", "black face mask", "crest", "orange bill"],
      similarSpecies: [
        {
          name: "Scarlet Tanager",
          differences: "No crest, different bill shape, different song"
        }
      ],
      voice: "Clear whistled song: 'cheer cheer cheer' or 'birdie birdie birdie'",
      flight: "Undulating flight pattern"
    },
    tags: ["songbird", "red", "common", "backyard"],
    isExtinct: false,
    isPopular: true,
    searchCount: 2500
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
      physical: "The Blue Jay is a large songbird with bright blue plumage, white underparts, and a distinctive crest. They have black markings around the face and neck.",
      behavior: "Blue Jays are intelligent and social birds that form family groups. They are known for their loud calls and mimicry abilities.",
      habitat: "Found in forests, woodlands, and suburban areas across eastern North America.",
      diet: "Omnivorous, feeding on nuts, seeds, insects, and occasionally eggs and nestlings.",
      breeding: "Breeding season runs from March to July. They build cup-shaped nests in trees.",
      conservation: "Common and widespread, with stable populations."
    },
    characteristics: {
      size: {
        length: { min: 22, max: 30, unit: "cm" },
        wingspan: { min: 34, max: 43, unit: "cm" },
        weight: { min: 70, max: 100, unit: "g" }
      },
      lifespan: { wild: 26, captivity: 30, unit: "years" },
      colors: ["blue", "white", "black", "gray"],
      distinctiveFeatures: ["crest", "blue plumage", "black necklace", "white face"]
    },
    habitat: ["forest", "woodland", "suburban"],
    range: {
      continents: ["North America"],
      countries: ["USA", "Canada"],
      regions: ["Eastern", "Central"]
    },
    elevation: { min: 0, max: 1500, unit: "m" },
    climate: ["temperate"],
    behavior: {
      social: "flock",
      migration: "partial",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: ["nuts", "seeds", "insects", "eggs"],
    feeding: {
      method: ["foraging", "caching"],
      location: ["trees", "ground"]
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
      threats: ["habitat loss", "window collisions"]
    },
    media: {
      images: [
        {
          url: "https://example.com/blue_jay.jpg",
          caption: "Blue Jay",
          credit: "Jane Doe",
          type: "male"
        }
      ],
      sounds: [
        {
          url: "https://example.com/blue_jay_call.mp3",
          type: "call",
          duration: 2.1,
          description: "Loud 'jay jay jay' call"
        }
      ]
    },
    identification: {
      fieldMarks: ["blue plumage", "white underparts", "black necklace", "crest"],
      similarSpecies: [
        {
          name: "Steller's Jay",
          differences: "Darker blue, different range, different calls"
        }
      ],
      voice: "Loud 'jay jay jay' calls and various other vocalizations",
      flight: "Direct flight with steady wingbeats"
    },
    tags: ["corvid", "blue", "intelligent", "mimic"],
    isExtinct: false,
    isPopular: true,
    searchCount: 1800
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
      physical: "The Dodo was a large, flightless bird with grayish plumage, a large hooked bill, and small wings. It stood about 1 meter tall and weighed up to 23 kg.",
      behavior: "The Dodo was a ground-dwelling bird that was likely social and lived in groups. It was probably diurnal and fed on fruits and seeds.",
      habitat: "Endemic to the island of Mauritius in the Indian Ocean.",
      diet: "Herbivorous, feeding on fruits, seeds, and possibly roots.",
      breeding: "Little is known about breeding behavior, but they likely nested on the ground.",
      conservation: "Extinct since the late 17th century due to human activities."
    },
    characteristics: {
      size: {
        length: { min: 100, max: 110, unit: "cm" },
        wingspan: { min: 0, max: 0, unit: "cm" },
        weight: { min: 15000, max: 23000, unit: "g" }
      },
      lifespan: { wild: 20, captivity: 25, unit: "years" },
      colors: ["gray", "white", "yellow"],
      distinctiveFeatures: ["flightless", "large bill", "small wings", "thick legs"]
    },
    habitat: ["forest", "coastal"],
    range: {
      continents: ["Africa"],
      countries: ["Mauritius"],
      regions: ["Indian Ocean"]
    },
    elevation: { min: 0, max: 500, unit: "m" },
    climate: ["tropical"],
    behavior: {
      social: "solitary",
      migration: "resident",
      activity: "diurnal",
      nesting: "ground"
    },
    diet: ["fruits", "seeds"],
    feeding: {
      method: ["foraging"],
      location: ["ground"]
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
        trend: "unknown",
        estimate: { value: 0, unit: "individuals" }
      },
      threats: ["hunting", "introduced species", "habitat destruction"]
    },
    tags: ["extinct", "flightless", "island", "symbol"],
    isExtinct: true,
    extinctYear: 1681,
    isPopular: true,
    searchCount: 1500
  },
  {
    name: {
      common: "Bald Eagle",
      scientific: "Haliaeetus leucocephalus",
      family: "Accipitridae",
      order: "Accipitriformes"
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Aves",
      order: "Accipitriformes",
      family: "Accipitridae",
      genus: "Haliaeetus",
      species: "leucocephalus"
    },
    description: {
      physical: "Large raptor with white head and tail, yellow beak, and dark brown body and wings.",
      behavior: "Soars with flat wings, often seen near water. Builds large stick nests in tall trees.",
      habitat: "Near large bodies of open water with abundant food supply and old-growth trees for nesting.",
      diet: "Mainly fish, but also birds, mammals, and carrion.",
      breeding: "Breeds in winter and spring. Both parents incubate eggs and care for young.",
      conservation: "Recovered from endangered status; populations increasing."
    },
    characteristics: {
      size: {
        length: { min: 70, max: 102, unit: "cm" },
        wingspan: { min: 180, max: 234, unit: "cm" },
        weight: { min: 3000, max: 6300, unit: "g" }
      },
      lifespan: { wild: 20, captivity: 50, unit: "years" },
      colors: ["white", "brown", "yellow"],
      distinctiveFeatures: ["white head", "yellow beak", "large size"]
    },
    habitat: ["wetland", "river", "lake", "coastal"],
    range: {
      continents: ["North America"],
      countries: ["USA", "Canada", "Mexico"],
      regions: ["Alaska", "Canada", "Lower 48"]
    },
    elevation: { min: 0, max: 3000, unit: "m" },
    climate: ["temperate", "arctic"],
    behavior: {
      social: "pair",
      migration: "partial",
      activity: "diurnal",
      nesting: "tree"
    },
    diet: ["fish", "birds", "mammals", "carrion"],
    feeding: {
      method: ["hunting", "scavenging"],
      location: ["water", "ground"]
    },
    breeding: {
      season: { start: "January", end: "July" },
      clutchSize: { min: 1, max: 3 },
      incubationPeriod: { value: 35, unit: "days" },
      fledgingPeriod: { value: 70, unit: "days" }
    },
    conservation: {
      status: "LC",
      population: {
        trend: "increasing",
        estimate: { value: 316000, unit: "individuals" }
      },
      threats: ["habitat loss", "pollution", "lead poisoning"]
    },
    media: {
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bald_Eagle_Portrait.jpg",
          caption: "Adult Bald Eagle portrait",
          credit: "Wikimedia Commons",
          type: "male"
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bald_Eagle_Nest.jpg",
          caption: "Bald Eagle at nest",
          credit: "Wikimedia Commons",
          type: "habitat"
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bald_Eagle_Flight.jpg",
          caption: "Bald Eagle in flight",
          credit: "Wikimedia Commons",
          type: "flight"
        }
      ],
      sounds: [
        {
          url: "https://www.xeno-canto.org/sounds/uploaded/OOECXQJQXJ/XC572857-BaldEagle.mp3",
          type: "call",
          duration: 2.5,
          description: "Bald Eagle call"
        }
      ]
    },
    identification: {
      fieldMarks: ["white head", "yellow beak", "large size", "dark brown body"],
      similarSpecies: [
        {
          name: "Golden Eagle",
          differences: "Golden Eagle has all dark plumage, feathered legs, and lacks white head."
        }
      ],
      voice: "High-pitched whistling or piping sound.",
      flight: "Soaring with flat wings, deep wingbeats."
    },
    tags: ["raptor", "national bird", "large", "soaring"],
    isExtinct: false,
    isPopular: true,
    searchCount: 2200
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