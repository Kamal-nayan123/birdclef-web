'use client';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function History() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const historyData = [
    {
      id: 1,
      type: 'Audio Identification',
      species: 'Northern Cardinal',
      confidence: 95,
      date: '2024-01-15',
      time: '14:30',
      icon: '🎵',
      audioUrl: '#',
      location: 'Backyard, New York'
    },
    {
      id: 2,
      type: 'Image Upload',
      species: 'Blue Jay',
      confidence: 88,
      date: '2024-01-14',
      time: '09:15',
      icon: '🖼️',
      imageUrl: '#',
      location: 'Central Park, New York'
    },
    {
      id: 3,
      type: 'Audio Identification',
      species: 'American Robin',
      confidence: 92,
      date: '2024-01-13',
      time: '16:45',
      icon: '🎵',
      audioUrl: '#',
      location: 'Garden, New York'
    },
    {
      id: 4,
      type: 'Image Upload',
      species: 'House Sparrow',
      confidence: 85,
      date: '2024-01-12',
      time: '11:20',
      icon: '🖼️',
      imageUrl: '#',
      location: 'Balcony, New York'
    },
    {
      id: 5,
      type: 'Audio Identification',
      species: 'Mourning Dove',
      confidence: 90,
      date: '2024-01-11',
      time: '07:30',
      icon: '🎵',
      audioUrl: '#',
      location: 'Park, New York'
    },
    {
      id: 6,
      type: 'Image Upload',
      species: 'Red-winged Blackbird',
      confidence: 87,
      date: '2024-01-10',
      time: '13:45',
      icon: '🖼️',
      imageUrl: '#',
      location: 'Wetland, New York'
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

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
            <div className="text-3xl font-bold gradient-text mb-2">{historyData.length}</div>
            <div className="text-sm text-muted-foreground">Total Identifications</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">6</div>
            <div className="text-sm text-muted-foreground">Unique Species</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">89.5%</div>
            <div className="text-sm text-muted-foreground">Average Confidence</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <div className="text-3xl font-bold gradient-text mb-2">3</div>
            <div className="text-sm text-muted-foreground">Audio Recordings</div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-card rounded-2xl shadow-lg hover-lift">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Recent Identifications</h2>
          </div>
          
          <div className="divide-y divide-border">
            {historyData.map((item, index) => (
              <div key={item.id} className="p-6 hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">{item.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.species}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                        {item.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{item.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.location}</span>
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
            ))}
          </div>
        </div>

        {/* Empty State (if no history) */}
        {historyData.length === 0 && (
          <div className="text-center py-12">
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
    </main>
  );
} 