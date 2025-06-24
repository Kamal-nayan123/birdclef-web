import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

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
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ user: userObj });
  } catch (e) {
    res.status(500).json({ error: "Signin failed", details: e.message });
  }
} 