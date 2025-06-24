'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Bird {
  _id: string;
  name: {
    common: string;
    scientific: string;
    family?: string;
    order?: string;
  };
  habitat?: string[];
  description?: {
    physical?: string;
    behavior?: string;
    habitat?: string;
    diet?: string;
    breeding?: string;
    conservation?: string;
  };
  diet?: string[];
  conservation?: {
    status?: string;
  };
  region?: string;
  media?: {
    images?: Array<{
      url: string;
      caption?: string;
      credit?: string;
      type?: string;
    }>;
  };
  tags?: string[];
}

export default function Birdpedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [birds, setBirds] = useState<Bird[]>([]);
  const [regions, setRegions] = useState<string[]>(['all']);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchBirds();
    // eslint-disable-next-line
  }, [searchTerm, filterRegion]);

  const fetchBirds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (filterRegion !== 'all') params.append('region', filterRegion);
      params.append('limit', '50');
      const res = await fetch(`${API_BASE}/api/birdpedia?${params.toString()}`);
      const data = await res.json();
      setBirds(data.birds || []);
      // Extract unique regions from birds
      const uniqueRegions: string[] = Array.from(new Set((data.birds || []).map((b: Bird) => b.region || 'Unknown')));
      setRegions(['all', ...uniqueRegions.filter(r => r && r !== 'all')]);
    } catch {
      setBirds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 Birdpedia</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive database of bird species. Search by name, scientific name, or family to learn about different birds, their habitats, and behaviors.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Birds
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, scientific name, or family..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Region
              </label>
              <select
                id="region"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading birds...' : `Found ${birds.length} bird${birds.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Birds Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && birds.map(bird => (
            <div
              key={bird._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedBird(bird)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                {bird.media?.images && bird.media.images.length > 0 ? (
                  <Image
                    src={bird.media.images[0].url}
                    alt={bird.media.images[0].caption || bird.name.common}
                    className="object-cover h-full w-full"
                    width={400}
                    height={192}
                    unoptimized
                  />
                ) : (
                  <span className="text-6xl">{'\ud83d\udc26'}</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{bird.name.common}</h3>
                <p className="text-sm text-gray-500 italic mb-2">{bird.name.scientific}</p>
                <p className="text-sm text-gray-600 mb-3">{bird.name.family || ''}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {bird.region || 'Unknown'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bird.conservation?.status === 'LC'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bird.conservation?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!loading && birds.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No birds found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Bird Detail Modal */}
        {selectedBird && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBird.name.common}</h2>
                  <button
                    onClick={() => setSelectedBird(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="mb-4">
                  {selectedBird.media?.images && selectedBird.media.images.length > 0 ? (
                    <Image
                      src={selectedBird.media.images[0].url}
                      alt={selectedBird.media.images[0].caption || selectedBird.name.common}
                      className="object-cover h-64 w-full rounded-xl"
                      width={400}
                      height={256}
                      unoptimized
                    />
                  ) : (
                    <span className="text-6xl">{'\ud83d\udc26'}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">Scientific Name</h3>
                    <p className="text-gray-600 italic">{selectedBird.name.scientific}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Family</h3>
                    <p className="text-gray-600">{selectedBird.name.family}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Description</h3>
                    <p className="text-gray-600">{selectedBird.description?.physical}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Habitat</h3>
                    <p className="text-gray-600">{selectedBird.habitat?.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Diet</h3>
                    <p className="text-gray-600">{selectedBird.diet?.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Region</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {selectedBird.region || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Conservation Status</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedBird.conservation?.status === 'LC'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedBird.conservation?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 