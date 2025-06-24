'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface HistoryItem {
  _id: string;
  type: 'audio' | 'image';
  species: {
    name: string;
    scientificName: string;
  };
  confidence: number;
  createdAt: string;
  timeAgo: string;
  fileInfo: {
    originalName: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  metadata: {
    weather: string;
    timeOfDay: string;
    season: string;
    habitat: string;
  };
  aiAnalysis: {
    model: string;
    version: string;
    processingTime: number;
    additionalSpecies: Array<{
      name: string;
      confidence: number;
    }>;
  };
  tags: string[];
  notes: string;
  isFavorite: boolean;
}

interface UserStats {
  totalIdentifications: number;
  uniqueSpecies: number;
  averageConfidence: number;
  audioRecordings: number;
  imagesUploaded: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function History() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user && user.id) {
      fetchHistoryData();
      fetchUserStats();
    }
  }, [isSignedIn, user, currentPage]);

  const fetchHistoryData = async () => {
    if (!user || !user.id) return;
    try {
      setIsLoadingData(true);
      const response = await fetch(`${API_BASE}/api/history?userId=${user.id}&page=${currentPage}&limit=10`);
      const data = await response.json();
      if (response.ok) {
        setHistoryData(data.history);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(`${API_BASE}/api/user/stats?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Identification History 📜
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your bird identification journey and discoveries
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">{stats?.totalIdentifications || 0}</div>
            <div className="text-sm text-muted-foreground">Total Identifications</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">{stats?.uniqueSpecies || 0}</div>
            <div className="text-sm text-muted-foreground">Unique Species</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">{stats?.averageConfidence || 0}%</div>
            <div className="text-sm text-muted-foreground">Average Confidence</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">{stats?.audioRecordings || 0}</div>
            <div className="text-sm text-muted-foreground">Audio Recordings</div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-card rounded-2xl shadow-lg hover-lift">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Recent Identifications</h2>
          </div>
          
          <div className="divide-y divide-border">
            {isLoadingData ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading history...</p>
              </div>
            ) : historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div key={item._id} className="p-6 hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">{item.type === 'audio' ? '🎵' : '🖼️'}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{item.species.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{item.location?.address || 'Unknown'}</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">🐦</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No identifications yet</h3>
                <p className="text-muted-foreground mb-6">Start identifying birds to see your history here</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/audio-search"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover-lift"
                  >
                    🎵 Audio Search
                  </a>
                  <a
                    href="/image-search"
                    className="px-6 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-medium hover:from-secondary/90 hover:to-accent/90 transition-all duration-200 shadow-lg hover-lift"
                  >
                    🖼️ Image Search
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-border">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 