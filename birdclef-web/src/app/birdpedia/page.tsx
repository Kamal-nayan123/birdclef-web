'use client';
import { useState } from 'react';

interface Bird {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  habitat: string;
  description: string;
  diet: string;
  conservationStatus: string;
  imageUrl: string;
  region: string;
}

const sampleBirds: Bird[] = [
  {
    id: 1,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    family: "Cardinalidae",
    habitat: "Woodlands, gardens, shrublands",
    description: "A medium-sized songbird with a distinctive red plumage and black face mask. Males are bright red while females are more brownish with red tinges.",
    diet: "Seeds, fruits, insects",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
    region: "North America"
  },
  {
    id: 2,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    family: "Turdidae",
    habitat: "Forests, parks, gardens",
    description: "A familiar thrush with a red-orange breast, gray back, and white belly. Known for its melodious song and early spring arrival.",
    diet: "Worms, insects, berries",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
    region: "North America"
  },
  {
    id: 3,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    family: "Corvidae",
    habitat: "Forests, woodlands, urban areas",
    description: "A striking blue and white bird with a distinctive crest and loud, varied calls. Known for its intelligence and bold behavior.",
    diet: "Nuts, seeds, insects, eggs",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
    region: "North America"
  },
  {
    id: 4,
    name: "House Sparrow",
    scientificName: "Passer domesticus",
    family: "Passeridae",
    habitat: "Urban areas, farms, grasslands",
    description: "A small, brown bird with a stout bill. Males have a black bib and gray crown, while females are more uniformly brown.",
    diet: "Seeds, insects, human food scraps",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
    region: "Worldwide"
  },
  {
    id: 5,
    name: "Red-winged Blackbird",
    scientificName: "Agelaius phoeniceus",
    family: "Icteridae",
    habitat: "Wetlands, marshes, fields",
    description: "A black bird with distinctive red and yellow shoulder patches. Males are all black while females are streaked brown.",
    diet: "Insects, seeds, grains",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
    region: "North America"
  }
];

export default function Birdpedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [filterRegion, setFilterRegion] = useState('all');

  const filteredBirds = sampleBirds.filter(bird => {
    const matchesSearch = bird.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bird.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bird.family.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || bird.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ['all', ...Array.from(new Set(sampleBirds.map(bird => bird.region)))];

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
            Found {filteredBirds.length} bird{filteredBirds.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Birds Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBirds.map(bird => (
            <div
              key={bird.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedBird(bird)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <span className="text-6xl">🐦</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{bird.name}</h3>
                <p className="text-sm text-gray-500 italic mb-2">{bird.scientificName}</p>
                <p className="text-sm text-gray-600 mb-3">{bird.family}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {bird.region}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bird.conservationStatus === 'Least Concern' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bird.conservationStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBirds.length === 0 && (
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
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBird.name}</h2>
                  <button
                    onClick={() => setSelectedBird(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Scientific Name</h3>
                    <p className="text-gray-600 italic">{selectedBird.scientificName}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Family</h3>
                    <p className="text-gray-600">{selectedBird.family}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Description</h3>
                    <p className="text-gray-600">{selectedBird.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Habitat</h3>
                    <p className="text-gray-600">{selectedBird.habitat}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Diet</h3>
                    <p className="text-gray-600">{selectedBird.diet}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">Region</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {selectedBird.region}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Conservation Status</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedBird.conservationStatus === 'Least Concern' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBird.conservationStatus}
                      </span>
                    </div>
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