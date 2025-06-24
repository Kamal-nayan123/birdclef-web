'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function AudioSearch() {
  const [audio, setAudio] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudio(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!audio) return;

    const formData = new FormData();
    formData.append('audio', audio);
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.gemini_response);
    } catch (err) {
      console.error(err);
      setResult("Error identifying bird. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎵 Audio Bird Search</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Record or upload bird sounds to identify species using AI. Get instant, accurate results powered by advanced machine learning.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Audio Input Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload or Record Audio</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Upload Audio File</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-gray-600">Click to select audio file</p>
                    <p className="text-sm text-gray-500 mt-1">Supports MP3, WAV, OGG</p>
                  </label>
                </div>
              </div>

              {/* Recording */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Record Audio</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🎤</div>
                  <p className="text-gray-600 mb-4">Record bird sounds directly</p>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Audio Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <audio controls className="w-full" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleUpload}
              disabled={!audio || loading}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                '🔍 Analyze Bird Sound'
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🎉 Analysis Results</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-lg text-gray-700 leading-relaxed">{result}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">💡 Tips for Better Results</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Recording Tips</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Record in quiet environments</li>
                <li>• Get as close to the bird as possible</li>
                <li>• Record for at least 10-15 seconds</li>
                <li>• Avoid background noise and wind</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">File Requirements</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Supported formats: MP3, WAV, OGG</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Clear audio quality recommended</li>
                <li>• Single bird call works best</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 