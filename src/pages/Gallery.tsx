
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, MapPin, Calendar, Search, ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Farm visit data with regions and crops
const farmVisits = [
  // 🎓 Annual Agricultural Economics Conference (Tamale, Northern Region) - FEATURED GROUP PHOTO
  {
    id: 5,
    title: "Agricultural Economics Conference",
    image: "/lovable-uploads/gallery5.jpg",
    region: "Northern Region",
    category: "Conference",
    date: "October 2024",
    description: "Participated in the 2024 Agricultural Economics & Agribusiness Conference at UDS, Tamale — focused on regenerative agriculture and agribusiness development."
  },

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

  // (Moved ID 5 to top)
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
  },

  // 🥬 Cape Coast Farm Fresh Foods Visit
  {
    id: 24,
    title: "Cape Coast Farm Fresh Foods",
    image: "/lovable-uploads/gallery24.jpg",
    region: "Central Region",
    category: "Community Outreach",
    date: "2024",
    description: "Visit to Cape Coast with Ghanaian farmers to explore farm fresh foods and sustainable agricultural practices."
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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Reset carousel when filters change
  useEffect(() => {
    setCurrentCarouselIndex(0);
  }, [selectedRegion, selectedCategory]);

  // Scroll animation hooks with lower thresholds for faster triggering
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.05 });
  const [filterRef, filterVisible] = useScrollReveal({ threshold: 0.05 });
  const [galleryRef, galleryVisible] = useScrollReveal({ threshold: 0.05 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 });


  // Filter farm visits based on selected region and category
  const filteredVisits = farmVisits.filter(visit => {
    const regionMatch = selectedRegion === "All Regions" || visit.region === selectedRegion;
    const categoryMatch = selectedCategory === "All Categories" || visit.category === selectedCategory;
    return regionMatch && categoryMatch;
  });

  // Split into Featured (1st) and Grid (Rest)
  const featuredVisit = filteredVisits.length > 0 ? filteredVisits[0] : null;
  const gridVisits = filteredVisits.length > 1 ? filteredVisits.slice(1) : [];


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
    const currentListIndex = farmVisits.findIndex(v => v.id === selectedImage.id);

    if (direction === 'prev') {
      newIndex = currentListIndex > 0 ? currentListIndex - 1 : farmVisits.length - 1;
    } else {
      newIndex = currentListIndex < farmVisits.length - 1 ? currentListIndex + 1 : 0;
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
  }, [isModalOpen, selectedImage]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
      {/* Navbar - Deep Teal Background */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-16">

        {/* Header */}
        <header ref={heroRef} className={`mb-16 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} text-center max-w-4xl mx-auto`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002f37] mb-6 tracking-tight">
            Our Portfolio
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore our journey across Ghana's agricultural landscape.
            From pineapple plantations to academic conferences, we're working together to transform agriculture through AI and technology.
          </p>
          <div className="w-24 h-1.5 bg-[#7ede56] mx-auto mt-8 rounded-full"></div>
        </header>

        {/* Premium Filter Bar */}
        {/* Premium Dropdown Filter Bar */}
        <section ref={filterRef} className={`mb-16 transition-all duration-1000 delay-100 ${filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} `}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto px-4">

            <div className="flex items-center gap-3 text-[#002f37] font-bold mr-2 hidden md:flex">
              <Filter className="w-5 h-5 text-[#7ede56]" />
              <span className="text-lg">Filter By:</span>
            </div>

            {/* Category Dropdown */}
            <div className="w-full sm:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-14 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-base font-bold text-[#002f37] transition-all duration-300 hover:border-[#7ede56] focus:ring-[#7ede56]/20">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 rounded-xl shadow-xl overflow-hidden">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="py-3 px-4 font-semibold text-gray-700 focus:bg-[#e8f5e9] focus:text-[#002f37] cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Dropdown */}
            <div className="w-full sm:w-64">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-14 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-base font-bold text-[#002f37] transition-all duration-300 hover:border-[#7ede56] focus:ring-[#7ede56]/20">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 rounded-xl shadow-xl overflow-hidden">
                  {regions.map((region) => (
                    <SelectItem
                      key={region}
                      value={region}
                      className="py-3 px-4 font-semibold text-gray-700 focus:bg-[#e8f5e9] focus:text-[#002f37] cursor-pointer"
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </section>

        {/* Gallery Content - CAROUSEL MODE */}
        <section ref={galleryRef} className={`relative transition-all duration-1000 delay-200 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} `}>

          {filteredVisits.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No moments found</h3>
              <p className="text-gray-500 text-base mb-6 px-4">Try adjusting your filters to explore other parts of our journey.</p>
              <Button
                variant="outline"
                className="rounded-full border-[#002f37] text-[#002f37] hover:bg-[#002f37] hover:text-white transition-all duration-300"
                onClick={() => { setSelectedRegion("All Regions"); setSelectedCategory("All Categories"); }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Featured Section (Static) */}
              {featuredVisit && (
                <div className="relative mb-24 group cursor-pointer" onClick={() => openModal(featuredVisit)}>
                  <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] hover:-translate-y-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:h-[600px]">
                      {/* Image Side */}
                      <div className="relative h-[300px] lg:h-full overflow-hidden">
                        <img
                          src={featuredVisit.image}
                          alt={featuredVisit.title}
                          loading="eager"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/0"></div>

                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-[#002f37] backdrop-blur-md shadow-sm border-none text-xs font-bold px-3 py-1 uppercase tracking-wider">
                            Featured
                          </Badge>
                        </div>
                      </div>

                      {/* Text Side */}
                      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-16 bg-white relative">
                        <div className="flex items-center gap-3 mb-6">
                          <Badge className="bg-[#002f37] text-white hover:bg-[#002f37] border-none text-sm px-3 py-1">
                            {featuredVisit.category}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#7ede56]">
                            <Calendar className="w-4 h-4" />
                            <span>{featuredVisit.date}</span>
                          </div>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002f37] mb-6 leading-[1.1]">
                          {featuredVisit.title}
                        </h2>

                        <p className="text-lg text-gray-600 leading-updated mb-8 lg:mb-12 line-clamp-4 lg:line-clamp-none">
                          {featuredVisit.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto lg:mt-0">
                          <Button
                            className="rounded-full bg-[#002f37] text-white hover:bg-[#002f37]/90 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto"
                          >
                            Read Full Story
                          </Button>
                          <div className="flex items-center text-gray-500 font-medium">
                            <MapPin className="w-5 h-5 mr-2 text-[#7ede56]" />
                            {featuredVisit.region}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Section */}
              {gridVisits.length > 0 && (
                <div
                  ref={gridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {gridVisits.map((visit, index) => (
                    <div
                      key={visit.id}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      className={`group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-2 ${gridVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        } `}
                      onClick={() => openModal(visit)}
                    >
                      {/* Image */}
                      <img
                        src={visit.image}
                        alt={visit.title}
                        loading={index < 6 ? "eager" : "lazy"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay - Always present at bottom, grows on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500 z-10" />

                      {/* Category Badge (Top Left) */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-white/90 text-[#002f37] backdrop-blur-md shadow-sm border-none text-xs font-bold px-3 py-1">
                          {visit.category}
                        </Badge>
                      </div>

                      {/* Bottom Content Wrapper (Anchored to bottom) */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end">

                        {/* Reveal Section: Title & Description (Expands Upwards) */}
                        <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-out">
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {visit.title}
                          </h3>
                          <p className="text-gray-200 text-sm line-clamp-3 mb-4 leading-relaxed drop-shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            {visit.description}
                          </p>
                        </div>

                        {/* Region & Date - Always Visible */}
                        <div className="flex justify-between items-center pt-2 transition-colors duration-300">
                          <span className="flex items-center gap-2 text-white/90 text-sm font-medium drop-shadow-sm">
                            <MapPin className="w-4 h-4 text-[#7ede56]" />
                            {visit.region}
                          </span>
                          <span className="flex items-center gap-2 text-white/90 text-sm font-medium drop-shadow-sm">
                            <Calendar className="w-4 h-4 text-[#7ede56]" />
                            {visit.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Enhanced Lightbox Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 bg-black/95 border-none shadow-none flex flex-col items-center justify-center overflow-hidden focus:outline-none">

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
            <div className="text-white/80 text-sm font-medium">
              {currentImageIndex + 1} / {farmVisits.length}
            </div>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 backdrop-blur-md border-none"
              size="icon"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 backdrop-blur-md border-none"
            size="icon"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 backdrop-blur-md border-none"
            size="icon"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>

          {/* Main Content Area */}
          {selectedImage && (
            <div className="w-full h-full flex flex-col md:flex-row relative animate-fade-in">

              {/* Image Area */}
              <div className="flex-1 flex items-center justify-center relative p-4 sm:p-8 md:p-12 lg:p-16 h-[60vh] md:h-full">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                />
              </div>

              {/* Info Sidebar (Bottom on mobile, Right on Desktop) */}
              <div className="w-full md:w-[400px] lg:w-[450px] bg-white/10 backdrop-blur-xl md:bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-white/10 p-6 sm:p-8 flex flex-col justify-center h-[40vh] md:h-full overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-[#7ede56] text-[#002f37] hover:bg-[#7ede56] border-none">
                        {selectedImage.category}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">
                        {selectedImage.region}
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                      {selectedImage.title}
                    </h2>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                      {selectedImage.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-5 h-5 mr-3 text-[#7ede56]" />
                      <span>{selectedImage.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-5 h-5 mr-3 text-[#7ede56]" />
                      <span>{selectedImage.region}</span>
                    </div>
                  </div>

                  {/* Mobile Nav Controls */}
                  <div className="flex md:hidden gap-4 mt-4 pt-4 border-t border-white/10">
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => navigateImage('prev')}>Previous</Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => navigateImage('next')}>Next</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Gallery;