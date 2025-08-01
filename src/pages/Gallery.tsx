import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, MapPin, Leaf, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Farm visit data with regions and crops
const farmVisits = [
  // 🍍 Pineapple Plantation Visit (Ahanta West, Western Region)
  {
    id: 1,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery1.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },
  {
    id: 2,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery2.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },
  {
    id: 3,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery3.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },
  {
    id: 4,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery4.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },
  {
    id: 6,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery6.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },
  {
    id: 8,
    title: "Pineapple Plantation Visit",
    image: "/lovable-uploads/gallery8.jpg",
    region: "Western Region",
    category: "Pineapple Plantation",
    date: "2023",
    description: "A week-long visit to a pineapple plantation in Agono Nkwanta, Ahanta West — Western Region, Ghana."
  },

  // 🎓 Annual Agricultural Economics Conference (Tamale, Northern Region)
  {
    id: 5,
    title: "Agricultural Economics Conference",
    image: "/lovable-uploads/gallery5.jpg",
    region: "Northern Region",
    category: "Conference",
    date: "October 2024",
    description: "Participated in the 2024 Agricultural Economics & Agribusiness Conference at UDS, Tamale — focused on regenerative agriculture and agribusiness development."
  },
  {
    id: 7,
    title: "Agricultural Economics Conference",
    image: "/lovable-uploads/gallery7.jpg",
    region: "Northern Region",
    category: "Conference",
    date: "October 2024",
    description: "Participated in the 2024 Agricultural Economics & Agribusiness Conference at UDS, Tamale — focused on regenerative agriculture and agribusiness development."
  },
  {
    id: 12,
    title: "Agricultural Economics Conference",
    image: "/lovable-uploads/gallery12.jpg",
    region: "Northern Region",
    category: "Conference",
    date: "October 2024",
    description: "Participated in the 2024 Agricultural Economics & Agribusiness Conference at UDS, Tamale — focused on regenerative agriculture and agribusiness development."
  },

  // 📱 Digital Tools Training for Farmers (Dormaa Ahenkro, Bono Region)
  {
    id: 9,
    title: "Digital Tools Training",
    image: "/lovable-uploads/gallery9.jpg",
    region: "Bono Region",
    category: "Training",
    date: "September 2024",
    description: "Engagement and training session in Dormaa Ahenkro to promote the adoption of digital tools among local farmers."
  },
  {
    id: 16,
    title: "Digital Tools Training",
    image: "/lovable-uploads/gallery16.jpg",
    region: "Bono Region",
    category: "Training",
    date: "September 2024",
    description: "Engagement and training session in Dormaa Ahenkro to promote the adoption of digital tools among local farmers."
  },
  {
    id: 17,
    title: "Digital Tools Training",
    image: "/lovable-uploads/gallery17.jpg",
    region: "Bono Region",
    category: "Training",
    date: "September 2024",
    description: "Engagement and training session in Dormaa Ahenkro to promote the adoption of digital tools among local farmers."
  },

  // 🐟 Catfish Marketing & Extension Support
  {
    id: 10,
    title: "Catfish Marketing Strategies",
    image: "/lovable-uploads/gallery10.jpg",
    region: "Western Region",
    category: "Catfish Farming",
    date: "2023",
    description: "A field session on catfish marketing strategies."
  },
  {
    id: 11,
    title: "Catfish Marketing Strategies",
    image: "/lovable-uploads/gallery11.jpg",
    region: "Western Region",
    category: "Catfish Farming",
    date: "2023",
    description: "A field session on catfish marketing strategies."
  },
  {
    id: 13,
    title: "Sustainable Catfish Farming",
    image: "/lovable-uploads/gallery13.jpg",
    region: "Western Region",
    category: "Catfish Farming",
    date: "2023",
    description: "On-field extension services on sustainable catfish farming practices."
  },
  {
    id: 14,
    title: "Sustainable Catfish Farming",
    image: "/lovable-uploads/gallery14.jpg",
    region: "Western Region",
    category: "Catfish Farming",
    date: "2023",
    description: "On-field extension services on sustainable catfish farming practices."
  },

  // 🐔 Poultry Farm Tour (Central Region)
  {
    id: 15,
    title: "Poultry Farm Tour",
    image: "/lovable-uploads/gallery15.jpg",
    region: "Central Region",
    category: "Poultry Farming",
    date: "2025",
    description: "A farm tour with renowned Ghanaian farmer, Mrs. Enyonam, at Farm Fresh Food — specialists in poultry production in the Central Region."
  },

  // Additional images for variety
  {
    id: 18,
    title: "Agricultural Extension Services",
    image: "/lovable-uploads/gallery18.jpg",
    region: "Eastern Region",
    category: "Extension Services",
    date: "September 2023",
    description: "Providing extension services and technical support to farmers in New Abirem North Municipal — covering Abirem, Ntronang, and Akokoaso areas."
  },
  {
    id: 19,
    title: "Farmer Training Workshop",
    image: "/lovable-uploads/gallery19.jpg",
    region: "Eastern Region",
    category: "Training",
    date: "August 2023",
    description: "Conducting training workshops for farmers on modern agricultural practices and technology adoption in New Abirem North Municipal — covering Abirem, Ntronang, and Akokoaso areas."
  },
  {
    id: 20,
    title: "Community Engagement",
    image: "/lovable-uploads/gallery20.jpg",
    region: "Eastern Region",
    category: "Community Outreach",
    date: "July 2023",
    description: "Community engagement session to understand local farming challenges and provide tailored solutions in New Abirem North Municipal — covering Abirem, Ntronang, and Akokoaso areas."
  },

  // 🍫 Cocoa Farmers Training (Asunafo North, Ahafo Region)
  {
    id: 21,
    title: "Cocoa Farmers Training",
    image: "/lovable-uploads/gallery21.jpg",
    region: "Ahafo Region",
    category: "Training",
    date: "2024",
    description: "Training session for cocoa farmers on pollination techniques and fertilizer application in Asunafo North, Ahafo Region."
  },
  {
    id: 22,
    title: "Cocoa Farmers Training",
    image: "/lovable-uploads/gallery22.jpg",
    region: "Ahafo Region",
    category: "Training",
    date: "2024",
    description: "Training session for cocoa farmers on pollination techniques and fertilizer application in Asunafo North, Ahafo Region."
  },
  {
    id: 23,
    title: "Cocoa Farmers Training",
    image: "/lovable-uploads/gallery23.jpg",
    region: "Ahafo Region",
    category: "Training",
    date: "2024",
    description: "Training session for cocoa farmers on pollination techniques and fertilizer application in Asunafo North, Ahafo Region."
  }
];

const regions = [
  "All Regions",
  "Western Region",
  "Ashanti Region", 
  "Eastern Region",
  "Northern Region",
  "Bono Region",
  "Ahafo Region",
  "Volta Region",
  "Central Region"
];

const categories = [
  "All Categories",
  "Pineapple Plantation",
  "Conference",
  "Training",
  "Catfish Farming",
  "Poultry Farming",
  "Extension Services",
  "Community Outreach"
];

const Gallery = () => {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedImage, setSelectedImage] = useState<typeof farmVisits[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll animation hooks
  const [heroRef, heroVisible] = useScrollReveal();
  const [galleryRef, galleryVisible] = useScrollReveal();
  const [filterRef, filterVisible] = useScrollReveal();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter farm visits based on selected region and category
  const filteredVisits = farmVisits.filter(visit => {
    const regionMatch = selectedRegion === "All Regions" || visit.region === selectedRegion;
    const categoryMatch = selectedCategory === "All Categories" || visit.category === selectedCategory;
    return regionMatch && categoryMatch;
  });

  // Open modal with selected image
  const openModal = (visit: typeof farmVisits[0]) => {
    setSelectedImage(visit);
    setCurrentImageIndex(farmVisits.findIndex(v => v.id === visit.id));
    setIsModalOpen(true);
  };

  // Navigate to previous/next image in modal
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : farmVisits.length - 1;
    } else {
      newIndex = currentImageIndex < farmVisits.length - 1 ? currentImageIndex + 1 : 0;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(farmVisits[newIndex]);
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

             {/* Hero Section */}
       <section ref={heroRef} className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
               Our Farm Visits & Engagements
             </h1>
             <div className="w-16 h-0.5 bg-purple-600 mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}></div>
             <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
               Explore our journey across Ghana's agricultural landscape. From pineapple plantations to academic conferences, 
               we're working together to transform agriculture through AI and technology.
             </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <MapPin className="w-4 h-4 mr-1" />
                8 Regions
              </Badge>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
                <Leaf className="w-4 h-4 mr-1" />
                8 Categories
              </Badge>
                             <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                 <Calendar className="w-4 h-4 mr-1" />
                 23+ Engagements
               </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section ref={filterRef} className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ease-out delay-200 ${filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col">
                  <label htmlFor="region-filter" className="text-sm font-medium text-gray-700 mb-1">
                    Filter by Region
                  </label>
                  <select
                    id="region-filter"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 mb-1">
                    Filter by Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedRegion("All Regions");
                  setSelectedCategory("All Categories");
                }}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Clear Filters
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Showing {filteredVisits.length} of {farmVisits.length} engagements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={galleryRef} className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="transition-all duration-1000 ease-out delay-300 opacity-100 translate-y-0">
            {filteredVisits.length === 0 ? (
              <div className="text-center py-16">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No engagements found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
                                      ) : (
                                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                     {filteredVisits.map((visit, index) => (
                     <div
                       key={visit.id}
                       className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-1000 ease-out hover:scale-[1.02] hover:shadow-2xl opacity-100 translate-y-0"
                       style={{ 
                         animationDelay: `${index * 150}ms`,
                         animationFillMode: 'both'
                       }}
                       onClick={() => openModal(visit)}
                     >
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={visit.image}
                          alt={visit.title}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Dark Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 ease-out" />
                        
                        {/* Badges - Always Visible but Enhanced on Hover */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-green-600/90 backdrop-blur-sm text-white border-0 shadow-lg">
                            {visit.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-lg">
                            {visit.region}
                          </Badge>
                        </div>
                        
                        {/* Caption Overlay - Fades in on Hover */}
                        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                          <div className="w-full">
                            <h3 className="text-white font-semibold text-lg mb-2 drop-shadow-lg">
                              {visit.title}
                            </h3>
                            <p className="text-white/90 text-sm line-clamp-2 drop-shadow-lg">
                              {visit.description}
                            </p>
                            <div className="flex items-center justify-between mt-3 text-white/80 text-xs">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {visit.region}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {visit.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </section>

             {/* Lightbox Modal */}
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="max-w-4xl w-[95vw] h-[95vh] sm:h-[90vh] p-0 bg-black/95 border-0 rounded-none sm:rounded-lg">
           <div className="relative w-full h-full flex flex-col lg:flex-row">
             {/* Close button */}
             <Button
               onClick={() => setIsModalOpen(false)}
               className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/70 hover:bg-black/90 text-white border-0 rounded-full w-8 h-8 sm:w-10 sm:h-10"
               size="icon"
             >
               <X className="w-4 h-4 sm:w-5 sm:h-5" />
             </Button>

             {/* Navigation buttons - Hidden on mobile, visible on desktop */}
             <Button
               onClick={() => navigateImage('prev')}
               className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border-0"
               size="icon"
             >
               <ArrowLeft className="w-5 h-5" />
             </Button>
             <Button
               onClick={() => navigateImage('next')}
               className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border-0"
               size="icon"
             >
               <ArrowRight className="w-5 h-5" />
             </Button>

             {/* Image and content */}
             {selectedImage && (
               <>
                 {/* Image Section */}
                 <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-black/95">
                   <img
                     src={selectedImage.image}
                     alt={selectedImage.title}
                     className="max-w-full max-h-full object-contain rounded-lg"
                   />
                 </div>

                 {/* Content Section - Full width on mobile, sidebar on desktop */}
                 <div className="w-full lg:w-80 bg-white p-4 sm:p-6 overflow-y-auto max-h-[40vh] lg:max-h-full">
                   <div className="space-y-3 sm:space-y-4">
                     {/* Mobile Navigation - Only visible on mobile */}
                     <div className="flex justify-between items-center lg:hidden mb-2">
                       <Button
                         onClick={() => navigateImage('prev')}
                         className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-full w-8 h-8"
                         size="icon"
                       >
                         <ArrowLeft className="w-4 h-4" />
                       </Button>
                       <span className="text-sm text-gray-500 font-medium">
                         {currentImageIndex + 1} of {farmVisits.length}
                       </span>
                       <Button
                         onClick={() => navigateImage('next')}
                         className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-full w-8 h-8"
                         size="icon"
                       >
                         <ArrowRight className="w-4 h-4" />
                       </Button>
                     </div>

                     <div>
                       <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                         {selectedImage.title}
                       </h2>
                       <div className="flex flex-wrap gap-2 mb-3">
                         <Badge className="bg-green-600 text-white text-xs">
                           {selectedImage.category}
                         </Badge>
                         <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                           {selectedImage.region}
                         </Badge>
                       </div>
                     </div>
                     
                     <div>
                       <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Description</h3>
                       <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                         {selectedImage.description}
                       </p>
                     </div>

                     <div>
                       <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Engagement Details</h3>
                       <div className="space-y-2 text-xs sm:text-sm">
                         <div className="flex items-center text-gray-600">
                           <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600 flex-shrink-0" />
                           <span className="truncate">{selectedImage.region}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600 flex-shrink-0" />
                           <span className="truncate">{selectedImage.category}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600 flex-shrink-0" />
                           <span className="truncate">{selectedImage.date}</span>
                         </div>
                       </div>
                     </div>

                     {/* Desktop Image counter - Only visible on desktop */}
                     <div className="hidden lg:block pt-4 border-t border-gray-200">
                       <p className="text-xs text-gray-500">
                         Image {currentImageIndex + 1} of {farmVisits.length}
                       </p>
                     </div>
                   </div>
                 </div>
               </>
             )}
           </div>
         </DialogContent>
       </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Gallery; 