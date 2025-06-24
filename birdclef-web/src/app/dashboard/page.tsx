'use client';
// import { useUser } from '@clerk/nextjs';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  // const { user, isSignedIn } = useUser();
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

  const stats = [
    { label: 'Total Identifications', value: '127', icon: '🔍', color: 'from-primary to-secondary' },
    { label: 'Species Found', value: '89', icon: '🐦', color: 'from-secondary to-accent' },
    { label: 'Audio Recordings', value: '45', icon: '🎵', color: 'from-accent to-primary' },
    { label: 'Images Uploaded', value: '82', icon: '🖼️', color: 'from-primary to-accent' },
  ];

  const recentActivity = [
    { type: 'Audio Identification', species: 'Northern Cardinal', time: '2 hours ago', icon: '🎵' },
    { type: 'Image Upload', species: 'Blue Jay', time: '1 day ago', icon: '🖼️' },
    { type: 'Audio Identification', species: 'American Robin', time: '2 days ago', icon: '🎵' },
    { type: 'Image Upload', species: 'House Sparrow', time: '3 days ago', icon: '🖼️' },
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
          {stats.map((stat, index) => (
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{activity.species}</div>
                    <div className="text-sm text-muted-foreground">{activity.type}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
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
            <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl">
              <div className="text-4xl mb-2">🐦</div>
              <div className="font-semibold text-foreground">Northern Cardinal</div>
              <div className="text-sm text-muted-foreground">15 identifications</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl">
              <div className="text-4xl mb-2">🐦</div>
              <div className="font-semibold text-foreground">Blue Jay</div>
              <div className="text-sm text-muted-foreground">12 identifications</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl">
              <div className="text-4xl mb-2">🐦</div>
              <div className="font-semibold text-foreground">American Robin</div>
              <div className="text-sm text-muted-foreground">8 identifications</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 