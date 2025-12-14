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
  Zap,
  ArrowUp,
  MessageCircle,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-triggered animation hooks
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [blogSectionRef, blogSectionVisible] = useScrollReveal();
  const [webinarSectionRef, webinarSectionVisible] = useScrollReveal();
  const [completedSectionRef, completedSectionVisible] = useScrollReveal();

  const [consultationSectionRef, consultationSectionVisible] = useScrollReveal();

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle direct navigation to webinar section
  useEffect(() => {
    if (window.location.hash === '#upcoming-webinars') {
      const element = document.getElementById('upcoming-webinars');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
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
      status: "completed",
      recordingLink: "https://drive.google.com/file/d/1kqJWei0rrOflXEF1DzfKnoD-s5ElcMEw/view?usp=sharing"
    },
    {
      id: 4,
      title: "Smart Farming Investments: What Every Entrepreneur and Investor Should Know",
      date: "2025-12-14",
      time: "3:00 PM - 6:00 PM",
      location: "Virtual",
      spots: 100,
      registered: 0,
      image: "/lovable-uploads/image copy 5.png",
      description: "Join us for an insightful session on smart farming investments and what every entrepreneur and investor needs to know to succeed in the agricultural sector.",
      speaker: "eyramax",
      status: "upcoming",
      registrationLink: "https://luma.com/q7tsnwsl"
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
    if (webinar.registrationLink) {
      window.open(webinar.registrationLink, '_blank');
    } else if (webinar.id === 3) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <Navbar />

      {/* Modern Hero Section with White Background */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white">
        {/* Decorative Elements - subtle on white */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#7ede56]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#921573]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">

            <h1
              ref={heroHeadingRef}
              className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#921573] via-[#002F37] to-[#7ede56] bg-clip-text text-transparent transition-all duration-700 ${heroHeadingVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              AgriLync Blog & Events
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Stay updated with the latest insights in agricultural technology, farming best practices, and upcoming events.
            </p>

            {/* Modern Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#7ede56] transition-colors" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-6 py-6 text-lg border-2 border-gray-200 focus:border-[#7ede56] rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills - Modern Design */}
      <section className="py-8 sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-[#7ede56] to-[#66cc44] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-[#7ede56]'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles - Modern Glass Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              ref={blogSectionRef}
              className={`text-3xl sm:text-4xl font-bold mb-4 text-[#002F37] transition-all duration-700 ${blogSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              Featured Articles
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Floating Tags */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                      <Badge className="bg-white/90 backdrop-blur-sm text-[#002F37] hover:bg-white">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-[#7ede56] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-200 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles - Modern Grid */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#002F37]">
              Latest Articles
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#7ede56]/30 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-[#7ede56] to-[#66cc44] text-white border-0">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs border-[#921573]/20 text-[#921573]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[#002F37] group-hover:text-[#921573] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#7ede56] hover:text-[#66cc44] font-semibold text-sm group-hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white rounded-full px-8"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Webinars Section - Keep existing structure but update styling */}
      <section id="upcoming-webinars" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              ref={webinarSectionRef}
              className={`text-3xl sm:text-4xl font-bold mb-4 text-[#002F37] transition-all duration-700 ${webinarSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              Upcoming Webinars & Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our expert-led webinars and events to learn about the latest agricultural innovations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.filter(w => w.status === 'upcoming').map((webinar, index) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#7ede56]/30 rounded-2xl">
                <div className="relative overflow-hidden h-52">
                  <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-[#7ede56] to-[#66cc44] text-white border-0">
                      {webinar.registered}/{webinar.spots} spots
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-[#921573] transition-colors">
                    {webinar.title}
                  </CardTitle>
                  <div className="space-y-2 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#7ede56]" />
                      <span>{formatDate(webinar.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#7ede56]" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#7ede56]" />
                      <span>{webinar.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#7ede56]" />
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
                    className="w-full bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white rounded-full transition-all duration-300 transform hover:scale-105"
                    disabled={webinar.registered >= webinar.spots}
                  >
                    {webinar.registered >= webinar.spots ? 'Fully Booked' : 'Register Now'}
                  </Button>

                  {webinar.id === 3 && (
                    <div className="mt-4 text-center">
                      <div className="inline-block bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100">
                        <img
                          src="/lovable-uploads/webinar-qr.jpg"
                          alt="QR Code"
                          className="w-28 h-28 rounded-lg mb-2"
                        />
                        <p className="text-sm font-semibold text-gray-700">Scan to Register</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Webinars */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              ref={completedSectionRef}
              className={`text-3xl sm:text-4xl font-bold mb-4 text-[#002F37] transition-all duration-700 ${completedSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              Completed Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch recordings of our previous webinars and learn from expert sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webinars.filter(w => w.status === 'completed').map((webinar, index) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#921573]/30 rounded-2xl">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Play className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-600 text-white flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-[#921573] transition-colors">
                    {webinar.title}
                  </CardTitle>
                  <div className="space-y-2 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#7ede56]" />
                      <span>{formatDate(webinar.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#7ede56]" />
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
                    className="w-full border-2 border-[#921573] text-[#921573] hover:bg-[#921573] hover:text-white rounded-full transition-all duration-300"
                    onClick={() => webinar.recordingLink && window.open(webinar.recordingLink, '_blank')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {webinar.recordingLink ? 'Watch Recording' : 'Recording Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section ref={consultationSectionRef} className={`py-20 bg-gradient-to-br from-[#002F37] to-[#004555] relative overflow-hidden transition-all duration-700 ${consultationSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Book a Free Session</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get expert advice and answers to all your farming questions from our agricultural specialists.
          </p>

          <Button
            onClick={() => window.open('https://calendly.com/agrilync/consultation', '_blank')}
            className="bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-[#002F37] font-bold py-6 px-10 rounded-full text-lg shadow-2xl hover:shadow-[#7ede56]/50 transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <Calendar className="mr-2 h-6 w-6" />
            Book Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-gray-400 mt-6">
            Free 30-minute session • No credit card required
          </p>
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
                onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                type="email"
                required
                value={registrationForm.email}
                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <Input
                type="text"
                value={registrationForm.organization}
                onChange={(e) => setRegistrationForm({ ...registrationForm, organization: e.target.value })}
                placeholder="Enter your organization"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white">
                Register for Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white p-4 rounded-full shadow-2xl hover:shadow-[#7ede56]/50 transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default Blog;