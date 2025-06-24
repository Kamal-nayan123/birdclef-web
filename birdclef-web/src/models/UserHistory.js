import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['audio', 'image'],
    required: true
  },
  species: {
    name: {
      type: String,
      required: true
    },
    scientificName: {
      type: String,
      required: true
    },
    commonName: String
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  fileInfo: {
    originalName: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    duration: Number, // for audio files
    dimensions: {
      width: Number,
      height: Number
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
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
    additionalSpecies: [{
      name: String,
      confidence: Number
    }]
  },
  tags: [String],
  notes: String,
  isFavorite: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userHistorySchema.index({ userId: 1, createdAt: -1 });
userHistorySchema.index({ 'species.name': 1 });
userHistorySchema.index({ confidence: -1 });
userHistorySchema.index({ type: 1 });

// Virtual for formatted date
userHistorySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for formatted time
userHistorySchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for time ago
userHistorySchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
});

// Static method to get user statistics
userHistorySchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalIdentifications: { $sum: 1 },
        uniqueSpecies: { $addToSet: '$species.name' },
        averageConfidence: { $avg: '$confidence' },
        audioRecordings: {
          $sum: { $cond: [{ $eq: ['$type', 'audio'] }, 1, 0] }
        },
        imagesUploaded: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        }
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
  
  return stats[0] || {
    totalIdentifications: 0,
    uniqueSpecies: 0,
    averageConfidence: 0,
    audioRecordings: 0,
    imagesUploaded: 0
  };
};

// Static method to get most identified species
userHistorySchema.statics.getMostIdentifiedSpecies = async function(userId, limit = 5) {
  return await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$species.name',
        count: { $sum: 1 },
        averageConfidence: { $avg: '$confidence' },
        lastSeen: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        species: '$_id',
        count: 1,
        averageConfidence: { $round: ['$averageConfidence', 1] },
        lastSeen: 1
      }
    }
  ]);
};

// Ensure virtual fields are serialized
userHistorySchema.set('toJSON', {
  virtuals: true
});

const UserHistory = mongoose.models.UserHistory || mongoose.model('UserHistory', userHistorySchema);

export default UserHistory; 