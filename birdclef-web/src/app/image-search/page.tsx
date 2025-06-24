'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function ImageSearch() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            setImage(file);
            setImageUrl(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    setLoading(true);
    setResult(null);

    try {
      // For now, we'll simulate the API call since we need to update the backend
      // const response = await axios.post('http://localhost:3000/predict-image', formData);
      
      // Simulated response for demonstration
      setTimeout(() => {
        setResult("This appears to be a Northern Cardinal (Cardinalis cardinalis), a medium-sized songbird with a distinctive red plumage and black face mask. The male has bright red feathers while the female is more brownish with red tinges.");
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setResult("Error identifying bird. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🖼️ Image Bird Search</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload or capture bird photos to identify species using AI. Get detailed information about the bird species in your images.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Image Input Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload or Capture Image</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Upload Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-gray-600">Click to select image</p>
                    <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP</p>
                  </label>
                </div>
              </div>

              {/* Camera Capture */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Capture Photo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600 mb-4">Take a photo with your camera</p>
                  {!isCapturing ? (
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-all duration-200"
                    >
                      📸 Start Camera
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={captureImage}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
                        >
                          📸 Capture
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Image Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <img 
                  src={imageUrl} 
                  alt="Uploaded bird" 
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                '🔍 Analyze Bird Image'
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
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
              <h3 className="font-medium text-gray-800 mb-2">Photo Tips</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Ensure good lighting conditions</li>
                <li>• Get as close as possible to the bird</li>
                <li>• Focus on clear, sharp images</li>
                <li>• Include distinctive features (beak, wings, etc.)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Image Requirements</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Supported formats: JPG, PNG, WebP</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Minimum resolution: 300x300 pixels</li>
                <li>• Bird should be clearly visible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 