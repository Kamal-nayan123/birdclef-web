import express from "express";
import multer from "multer";
import cors from "cors";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import { resolve } from "path";
import { unlinkSync } from "fs";

const app = express();
const PORT = 3000;

// CORS middleware (important for frontend -> backend requests)
app.use(cors());

// Setup multer for audio upload
const upload = multer({ dest: "uploads/" });

// Google GenAI setup
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

    // Generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([ 
        "Describe this audio clip in a line very precisely", 
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
      ]),
    });

    console.log("Gemini Response:", response.text);

    // Clean up local file after use
    unlinkSync(filePath);

    // Send the result back
    res.json({ gemini_response: response.text });
  } catch (error) {
    console.error("Error in /predict:", error);
    res.status(500).json({ error: "Failed to process the audio" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
