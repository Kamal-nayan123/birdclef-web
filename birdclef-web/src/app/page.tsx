export default function Home() {
  const popularSpecies = [
    {
      name: "Northern Cardinal",
      scientificName: "Cardinalis cardinalis",
      image: "🐦",
      region: "North America",
      description: "Bright red songbird with distinctive crest",
      category: "Songbird"
    },
    {
      name: "American Robin",
      scientificName: "Turdus migratorius",
      image: "🐦",
      region: "North America",
      description: "Familiar thrush with red-orange breast",
      category: "Thrush"
    },
    {
      name: "Blue Jay",
      scientificName: "Cyanocitta cristata",
      image: "🐦",
      region: "North America",
      description: "Striking blue and white bird with crest",
      category: "Corvid"
    },
    {
      name: "House Sparrow",
      scientificName: "Passer domesticus",
      image: "🐦",
      region: "Worldwide",
      description: "Small brown bird common in urban areas",
      category: "Sparrow"
    },
    {
      name: "Red-winged Blackbird",
      scientificName: "Agelaius phoeniceus",
      image: "🐦",
      region: "North America",
      description: "Black bird with red shoulder patches",
      category: "Blackbird"
    },
    {
      name: "Mourning Dove",
      scientificName: "Zenaida macroura",
      image: "🐦",
      region: "North America",
      description: "Gentle gray dove with mournful call",
      category: "Dove"
    }
  ];

  const legacyBirds = [
    {
      name: "Dodo",
      scientificName: "Raphus cucullatus",
      image: "🦤",
      region: "Mauritius",
      description: "Extinct flightless bird, symbol of extinction",
      status: "Extinct",
      year: "1681"
    },
    {
      name: "Passenger Pigeon",
      scientificName: "Ectopistes migratorius",
      image: "🕊️",
      region: "North America",
      description: "Once the most abundant bird in North America",
      status: "Extinct",
      year: "1914"
    },
    {
      name: "Great Auk",
      scientificName: "Pinguinus impennis",
      image: "🐧",
      region: "North Atlantic",
      description: "Flightless seabird hunted to extinction",
      status: "Extinct",
      year: "1852"
    },
    {
      name: "Carolina Parakeet",
      scientificName: "Conuropsis carolinensis",
      image: "🦜",
      region: "North America",
      description: "Only parrot native to eastern United States",
      status: "Extinct",
      year: "1918"
    }
  ];

  const frequentSearches = [
    {
      name: "Bald Eagle",
      searches: "2,847",
      image: "🦅",
      trend: "+12%"
    },
    {
      name: "American Goldfinch",
      searches: "2,156",
      image: "🐦",
      trend: "+8%"
    },
    {
      name: "Eastern Bluebird",
      searches: "1,943",
      image: "🐦",
      trend: "+15%"
    },
    {
      name: "Chickadee",
      searches: "1,721",
      image: "🐦",
      trend: "+5%"
    },
    {
      name: "Woodpecker",
      searches: "1,598",
      image: "🦜",
      trend: "+9%"
    },
    {
      name: "Hummingbird",
      searches: "1,432",
      image: "🐦",
      trend: "+22%"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-text mb-6">
              Welcome to BirdCLEF 🐦
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover and identify bird species using the power of AI. Upload audio recordings or images to get instant, accurate bird identification powered by advanced machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/audio-search"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold rounded-2xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-xl hover-lift"
              >
                <span className="flex items-center space-x-2">
                  <span>🎵</span>
                  <span>Audio Search</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </a>
              <a
                href="/image-search"
                className="group px-8 py-4 bg-gradient-to-r from-secondary to-accent text-white text-lg font-semibold rounded-2xl hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 shadow-xl hover-lift"
              >
                <span className="flex items-center space-x-2">
                  <span>🖼️</span>
                  <span>Image Search</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-muted-foreground">Species Identified</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text">50K+</div>
              <div className="text-muted-foreground">Users Worldwide</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text">99.2%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-muted-foreground">AI Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Species Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular Bird Species</h2>
            <p className="text-lg text-muted-foreground">Discover the most commonly identified birds in our database</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSpecies.map((bird, index) => (
              <div key={bird.name} className="bg-card rounded-2xl p-6 shadow-lg hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-4">{bird.image}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{bird.name}</h3>
                <p className="text-sm text-muted-foreground italic mb-2">{bird.scientificName}</p>
                <p className="text-muted-foreground mb-3">{bird.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{bird.category}</span>
                  <span className="text-xs text-muted-foreground">{bird.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy & Extinct Birds Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-muted/30 to-accent/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Legacy & Extinct Birds</h2>
            <p className="text-lg text-muted-foreground">Remembering the birds we've lost and learning from history</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {legacyBirds.map((bird, index) => (
              <div key={bird.name} className="bg-card rounded-2xl p-6 shadow-lg hover-lift animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{bird.image}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{bird.name}</h3>
                    <p className="text-sm text-muted-foreground italic mb-2">{bird.scientificName}</p>
                    <p className="text-muted-foreground mb-3">{bird.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">{bird.status}</span>
                      <span className="text-xs text-muted-foreground">Extinct since {bird.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Frequent Searches Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Most Frequent Searches</h2>
            <p className="text-lg text-muted-foreground">See what birds our community is searching for most</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frequentSearches.map((bird, index) => (
              <div key={bird.name} className="bg-card rounded-2xl p-6 shadow-lg hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{bird.image}</div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{bird.trend}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{bird.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{bird.searches} searches</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-accent/30 to-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Why Choose BirdCLEF?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-2xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered</h3>
              <p className="text-muted-foreground">Advanced machine learning algorithms provide accurate bird identification from both audio and visual inputs.</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Instant Results</h3>
              <p className="text-muted-foreground">Get bird identification results in seconds, not minutes. Perfect for real-time bird watching.</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Database</h3>
              <p className="text-muted-foreground">Access detailed information about thousands of bird species with our extensive Birdpedia database.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Birding?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of bird enthusiasts who trust BirdCLEF for accurate species identification.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold rounded-2xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-xl hover-lift"
          >
            Explore Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
