'use client';
import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!audio) return;

    const formData = new FormData();
    formData.append('audio', audio);
    setLoading(true);
    console.log("Audio uploaded successfully");
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Explicitly set header, though axios usually handles it
        },
    });

      console.log("Audio sent to backend");
      console.log(response.data); // Logging the full response

      setResult(response.data.gemini_response); // Assuming species is still part of the response
    //   setJsonResponse(response.data);  // Store the full response for display
    } catch (err) {
      console.error(err);
      setResult("Error identifying bird.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Upload Bird Audio</h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
          className="mb-4 w-full"
        />

        <button
          onClick={handleUpload}
          disabled={!audio || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Identify Species"}
        </button>

        {result && (
          <p className="mt-6 text-lg font-medium text-green-700">
            🎉 Predicted Species: <span className="font-bold">{result}</span>
          </p>
        )}

      </div>

      <a href="" className="mt-8 text-blue-500 hover:underline">← Back to Home</a>
    </main>
  );
}