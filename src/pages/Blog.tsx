import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Play,
  CheckCircle,
  Plus,
  Filter,
  Search,
  BookOpen,
  TrendingUp,
  Leaf,
  Zap
} from 'lucide-react';

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';

const Blog = () => {
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll-triggered animation hooks
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [blogSectionRef, blogSectionVisible] = useScrollReveal();
  const [webinarSectionRef, webinarSectionVisible] = useScrollReveal();
  const [completedSectionRef, completedSectionVisible] = useScrollReveal();
  const [registrationSectionRef, registrationSectionVisible] = useScrollReveal();

  // Handle direct navigation to webinar section
  useEffect(() => {
    if (window.location.hash === '#upcoming-webinars') {
      const element = document.getElementById('upcoming-webinars');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500); // Small delay to ensure page is loaded
      }
    }
  }, []);

  // Enhanced blog posts with categories and tags
  const blogPosts = [
    {
      id: 1,
      title: "5 Challenges Ghanaian Farmers Face Without Smart Tools",
      excerpt: "Discover how AgriLync is helping to solve agricultural challenges with AI and finance access. Learn about the key obstacles facing Ghanaian farmers and how technology is providing solutions.",
      author: "AgriLync Team",
      date: "2024-06-25",
      readTime: "5 min read",
      category: "Agribusiness",
      tags: ["Smart Farming", "Technology", "Ghana"],
      image: "/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: true
    },
    {
      id: 2,
      title: "Ghana's Agriculture Sector: Market Size, Growth, and Key Trends",
      excerpt: "Explore the current state of Ghana's agricultural sector, market opportunities, and emerging trends that are shaping the future of farming in the country.",
      author: "Market Research Team",
      date: "2024-05-26",
      readTime: "6 min read",
      category: "Market Analysis",
      tags: ["Market Trends", "Growth", "Analysis"],
      image: "/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: false
    },
    {
      id: 3,
      title: "The Role of AI in African Farming: A Smart Future for Agriculture",
      excerpt: "Discover how artificial intelligence is revolutionizing farming practices across Africa, from crop disease detection to predictive analytics and smart farming solutions.",
      author: "AI Research Team",
      date: "2024-05-06",
      readTime: "7 min read",
      category: "Technology",
      tags: ["AI", "Innovation", "Smart Farming"],
      image: "/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: true
    },
    {
      id: 4,
      title: "Sustainable Farming Practices for Smallholder Farmers",
      excerpt: "Learn about sustainable farming techniques that can help smallholder farmers improve yields while protecting the environment and ensuring long-term profitability.",
      author: "Sustainability Expert",
      date: "2024-04-15",
      readTime: "8 min read",
      category: "Sustainability",
      tags: ["Sustainability", "Best Practices", "Smallholder"],
      image: "/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: false
    },
    {
      id: 5,
      title: "Digital Financial Services for Agricultural Growth",
      excerpt: "Explore how digital financial services are transforming agricultural financing and enabling farmers to access credit, insurance, and payment solutions.",
      author: "Fintech Team",
      date: "2024-04-02",
      readTime: "6 min read",
      category: "Fintech",
      tags: ["Digital Finance", "Credit", "Insurance"],
      image: "/lovable-uploads/512cd931-d1b6-4a18-8b57-63786de9ffb8.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: false
    },
    {
      id: 6,
      title: "Climate-Smart Agriculture: Adapting to Changing Weather Patterns",
      excerpt: "Discover climate-smart agricultural practices that help farmers adapt to changing weather patterns and build resilience against climate change impacts.",
      author: "Climate Expert",
      date: "2024-03-20",
      readTime: "9 min read",
      category: "Climate",
      tags: ["Climate Change", "Resilience", "Adaptation"],
      image: "/lovable-uploads/58a418db-b2d5-4bcb-94c1-d230345ec90b.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: true
    }
  ];

  // Updated webinars with completed events
  const webinars = [
    {
      id: 1,
      title: "AI for Crop Disease Detection",
      date: "2024-02-15",
      time: "14:00 GMT",
      location: "Virtual",
      spots: 50,
      registered: 50,
      image: "/lovable-uploads/webinar.jpg",
      description: "Learn how to use AI-powered tools to identify and treat crop diseases early, preventing significant yield losses.",
      speaker: "Dr. Sarah Mensah",
      status: "completed"
    },
    {
      id: 2,
      title: "Modern Fish Farming Techniques",
      date: "2024-02-20",
      time: "10:00 GMT",
      location: "Accra, Ghana",
      spots: 30,
      registered: 30,
      image: "/lovable-uploads/webinar1.jpg",
      description: "Discover sustainable aquaculture practices and modern fish farming technologies for better yields.",
      speaker: "Prof. Kofi Osei",
      status: "completed"
    },
    {
      id: 3,
      title: "Post-Harvest Losses and Market Access for Smallholder Farmers",
      date: "2025-08-09",
      time: "6:00 PM - 7:30 PM",
      location: "Virtual (Google Meet)",
      spots: 100,
      registered: 45,
      image: "/lovable-uploads/webinar4.jpg",
      description: "Comprehensive strategies to reduce post-harvest losses and improve market access for smallholder farmers in Ghana.",
      speaker: "Mrs Erica Adjoa Appaih",
      status: "upcoming"
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Posts', icon: BookOpen },
    { id: 'agribusiness', name: 'Agribusiness', icon: TrendingUp },
    { id: 'technology', name: 'Technology', icon: Zap },
    { id: 'sustainability', name: 'Sustainability', icon: Leaf },
    { id: 'market-analysis', name: 'Market Analysis', icon: TrendingUp },
    { id: 'fintech', name: 'Fintech', icon: TrendingUp },
    { id: 'climate', name: 'Climate', icon: Leaf }
  ];

  const handleWebinarRegistration = (webinar: any) => {
    // For the post-harvest losses webinar, redirect to the registration link
    if (webinar.id === 3) {
      window.open('https://is.gd/agrilyncwebinar', '_blank');
    } else {
      setSelectedWebinar(webinar);
      setShowRegistration(true);
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationForm);
    setShowRegistration(false);
    setRegistrationForm({ name: '', email: '', phone: '', organization: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter blog posts based on active tab and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeTab === 'all' || post.category.toLowerCase().replace(' ', '-') === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h1 ref={heroHeadingRef} className={"text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-down transition-all duration-700 ease-in-out " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_MAGENTA }}>
              AgriLync Blog & Events
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
              Stay updated with the latest insights in agricultural technology, farming best practices, and upcoming events. Discover innovative solutions that are transforming African agriculture.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto animate-fade-in-up delay-300">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-green-500 rounded-full"
                />
              </div>
              <Button 
                variant="outline" 
                className="px-6 py-3 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white rounded-full transition-all duration-300"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={blogSectionRef} className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 transition-all duration-700 ease-in-out " + (blogSectionVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Featured Articles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our most popular and insightful articles on agricultural innovation and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <div key={post.id} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="mb-3 bg-green-500 text-white">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-green-300 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <ExternalLink className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts with Categories */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: BRAND_TEAL }}>
              Latest Articles
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            
            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 w-full bg-white shadow-lg rounded-full p-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={activeTab} className="mt-8">
                {/* Search Results Counter */}
                {searchTerm && (
                  <div className="text-center mb-6 animate-fade-in-up">
                    <p className="text-gray-600">
                      {filteredPosts.length === 1 
                        ? `Found 1 article for "${searchTerm}"`
                        : `Found ${filteredPosts.length} articles for "${searchTerm}"`
                      }
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          {post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold mb-3 group-hover:text-green-600 transition-colors duration-300" style={{ color: BRAND_MAGENTA }}>
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{formatDate(post.date)}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <a 
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                        >
                          Read Article
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 animate-fade-in-up">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {searchTerm ? `No articles found for "${searchTerm}"` : "No articles found"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? `We couldn't find any articles matching "${searchTerm}". Try different keywords or check your spelling.`
                        : "Try adjusting your search terms or category filter."
                      }
                    </p>
                    {searchTerm && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <span className="text-sm text-gray-500">Suggestions:</span>
                        {['agriculture', 'technology', 'farming', 'AI', 'finance'].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setActiveTab('all');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars Section */}
      <section id="upcoming-webinars" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={webinarSectionRef} className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (webinarSectionVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Upcoming Webinars & Events
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join our expert-led webinars and events to learn about the latest agricultural innovations and best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.filter(w => w.status === 'upcoming').map((webinar, index) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 animate-fade-in-up overflow-hidden" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative overflow-hidden">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: webinar.id === 3 ? 'center 25%' : 'center' }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      {webinar.registered}/{webinar.spots} spots
                    </Badge>
                  </div>
                  
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300" style={{ color: BRAND_MAGENTA }}>
                    {webinar.title}
                  </CardTitle>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{formatDate(webinar.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{webinar.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Speaker: {webinar.speaker}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {webinar.description}
                  </p>
                  <Button 
                    onClick={() => handleWebinarRegistration(webinar)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                    disabled={webinar.registered >= webinar.spots}
                  >
                    {webinar.registered >= webinar.spots ? 'Fully Booked' : 'Register Now'}
                  </Button>
                  
                                     {/* QR Code section for direct registration */}
                   {webinar.id === 3 && (
                     <div className="mt-4 text-center">
                       <div className="inline-block bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
                         <div className="mb-3">
                           <img 
                             src="/lovable-uploads/webinar-qr.jpg" 
                             alt="QR Code for Registration"
                             className="w-28 h-28 rounded-lg"
                             style={{ minWidth: '112px', minHeight: '112px' }}
                             onError={(e) => {
                               console.error('QR code image failed to load');
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                         </div>
                         <p className="text-sm text-gray-700 font-semibold mb-1">Scan to Register</p>
                         <p className="text-xs text-gray-500">Direct Registration Link</p>
                       </div>
                     </div>
                   )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Webinars Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={completedSectionRef} className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (completedSectionVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Completed Events
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Watch recordings of our previous webinars and learn from our expert sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webinars.filter(w => w.status === 'completed').map((webinar, index) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 animate-fade-in-up overflow-hidden" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative overflow-hidden">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300" style={{ color: BRAND_MAGENTA }}>
                    {webinar.title}
                  </CardTitle>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{formatDate(webinar.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Speaker: {webinar.speaker}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {webinar.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Recording
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register for {selectedWebinar?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <Input
                type="text"
                required
                value={registrationForm.name}
                onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                type="email"
                required
                value={registrationForm.email}
                onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <Input
                type="text"
                value={registrationForm.organization}
                onChange={(e) => setRegistrationForm({...registrationForm, organization: e.target.value})}
                placeholder="Enter your organization"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Register for Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Blog; 