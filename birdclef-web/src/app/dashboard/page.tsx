'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserStats {
  totalIdentifications: number;
  uniqueSpecies: number;
  averageConfidence: number;
  audioRecordings: number;
  imagesUploaded: number;
}

interface RecentActivity {
  _id: string;
  type: 'audio' | 'image';
  species: {
    name: string;
    scientificName: string;
  };
  confidence: number;
  createdAt: string;
  timeAgo: string;
}

interface MostIdentifiedSpecies {
  species: string;
  count: number;
  averageConfidence: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [mostIdentifiedSpecies, setMostIdentifiedSpecies] = useState<MostIdentifiedSpecies[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user && user.id) {
      fetchDashboardData();
    }
  }, [isSignedIn, user]);

  const fetchDashboardData = async () => {
    if (!user || !user.id) return;
    try {
      setIsLoadingData(true);
      // Fetch user stats
      const statsResponse = await fetch(`${API_BASE}/api/user/stats?userId=${user.id}`);
      const statsData = await statsResponse.json();
      if (statsResponse.ok) {
        setStats(statsData.stats);
        setRecentActivity(statsData.recentActivity || []);
        setMostIdentifiedSpecies(statsData.mostIdentifiedSpecies || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const statsCards = [
    { 
      label: 'Total Identifications', 
      value: stats?.totalIdentifications || 0, 
      icon: '🔍', 
      color: 'from-primary to-secondary' 
    },
    { 
      label: 'Species Found', 
      value: stats?.uniqueSpecies || 0, 
      icon: '🐦', 
      color: 'from-secondary to-accent' 
    },
    { 
      label: 'Audio Recordings', 
      value: stats?.audioRecordings || 0, 
      icon: '🎵', 
      color: 'from-accent to-primary' 
    },
    { 
      label: 'Images Uploaded', 
      value: stats?.imagesUploaded || 0, 
      icon: '🖼️', 
      color: 'from-primary to-accent' 
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.name}! 🐦
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your bird identification activity and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-lg hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/audio-search"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl hover:from-primary/20 hover:to-secondary/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🎵</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Audio Search</div>
                  <div className="text-sm text-muted-foreground">Identify birds by sound</div>
                </div>
                <span className="ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </a>
              
              <a
                href="/image-search"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl hover:from-secondary/20 hover:to-accent/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🖼️</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-secondary transition-colors">Image Search</div>
                  <div className="text-sm text-muted-foreground">Identify birds by photo</div>
                </div>
                <span className="ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </a>
              
              <a
                href="/birdpedia"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl hover:from-accent/20 hover:to-primary/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-accent transition-colors">Birdpedia</div>
                  <div className="text-sm text-muted-foreground">Explore bird database</div>
                </div>
                <span className="ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {isLoadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading activity...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity._id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{activity.type === 'audio' ? '🎵' : '🖼️'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{activity.species.name}</div>
                      <div className="text-sm text-muted-foreground">{activity.type === 'audio' ? 'Audio Identification' : 'Image Upload'}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.timeAgo}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start identifying birds to see your activity here</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a
                href="/history"
                className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                View all activity →
              </a>
            </div>
          </div>
        </div>

        {/* Popular Species */}
        <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Most Identified Species</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {isLoadingData ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading species data...</p>
              </div>
            ) : mostIdentifiedSpecies.length > 0 ? (
              mostIdentifiedSpecies.map((species, index) => (
                <div key={species.species} className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-4xl mb-2">🐦</div>
                  <div className="font-semibold text-foreground">{species.species}</div>
                  <div className="text-sm text-muted-foreground">{species.count} identifications</div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No species identified yet</p>
                <p className="text-sm text-muted-foreground">Start identifying birds to see your most common species</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 