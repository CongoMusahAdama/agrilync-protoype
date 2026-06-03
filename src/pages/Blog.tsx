import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { WEBINARS } from '@/data/webinars';
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
  ArrowRight,
  X
} from 'lucide-react';

// Brand colors
const BRAND_MAGENTA = '#7ede56';
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
  const [latestRef, latestVisible] = useScrollReveal();
  const [transformRef, transformVisible] = useScrollReveal();

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

  // Scroll to articles section
  const scrollToArticles = () => {
    const element = document.getElementById('latest-articles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle category/tab selection
  const handleCategoryClick = (categoryId: string) => {
    setActiveTab(categoryId);
    // Smooth scroll if we are in the upper hero part of the page
    if (window.scrollY < 500) {
      setTimeout(() => {
        scrollToArticles();
      }, 100);
    }
  };

  // Handle trending tag click
  const handleTrendingClick = (tag: string) => {
    setSearchTerm(tag);
    if (window.scrollY < 500) {
      setTimeout(() => {
        scrollToArticles();
      }, 100);
    }
  };

  // Handle search submit / search button click
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    scrollToArticles();
  };

  // Handle direct navigation to sections via hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // If it's the mushroom card, we might want to highlight it
          if (id === 'mushroom-farming') {
            element.classList.add('ring-4', 'ring-[#7ede56]', 'ring-offset-4');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-[#7ede56]', 'ring-offset-4');
            }, 3000);
          }
        }, 800);
      }
    }
  }, []);

  // Static predefined blog posts
  const staticBlogPosts = [
    {
      id: 10,
      slug: "ghana-tomato-productivity-fix",
      title: "From 8 to 20 Tonnes: Can Ghana Finally Fix Its Tomato Crisis?",
      excerpt: "Explore how government-backed research from WACCI and Agrilync's finance-first innovation are unlocking massive productivity gains for smallholder farmers.",
      author: "Agrilync Nexus Team",
      date: "2026-03-26",
      readTime: "8 min read",
      category: "Agribusiness",
      tags: ["Policy", "Innovation", "Tomato Crisis", "WACCI"],
      image: "/lovable-uploads/image copy 15.png",
      link: "https://agri-insider-series.beehiiv.com/p/from-8-to-20-tonnes-can-ghana-finally-fix-its-tomato-crisis",
      featured: true
    },
    {
      id: 9,
      slug: "smart-greenhouse-tomato-crisis",
      title: "How Smart Greenhouse Technology Can Solve Ghana’s Tomato Crisis",
      excerpt: "Discover how smart greenhouse technology is revolutionizing Ghana's agriculture and solving the tomato crisis by 2026. A practical guide to year-round production.",
      author: "Agrilync Nexus Team",
      date: "2026-03-26",
      readTime: "7 min read",
      category: "Technology",
      tags: ["Smart Greenhouse", "Tomato Crisis", "Ag-Tech"],
      image: "/lovable-uploads/image copy 14.png",
      link: "https://agri-insider-series.beehiiv.com/p/how-smart-greenhouse-technology-can-solve-ghana-s-tomato-crisis",
      featured: true
    },
    {
      id: 8,
      slug: "mushroom-farming",
      title: "A Beginner's Guide to Mushroom Farming: From Planning to Profit",
      excerpt: "Learn the essentials of mushroom farming, from initial planning and setup to harvesting and selling for profit. A comprehensive guide for aspiring Ghanaian agropreneurs.",
      author: "Agrilync Nexus Team",
      date: "2026-01-16",
      readTime: "6 min read",
      category: "Agribusiness",
      tags: ["Mushroom Farming", "Agropreneur", "Guided Farming"],
      image: "/lovable-uploads/mushroom-farming.jpg",
      link: "https://agri-insider-series.beehiiv.com/p/a-beginner-s-guide-to-mushroom-farming-from-planning-to-profit-post",
      featured: true
    },
    {
      id: 1,
      title: "Ghana Faces Agricultural Crisis as Maize Imports Surge",
      excerpt: "Ghana's agricultural sector confronts a critical challenge as projected maize imports could rise by 67 percent for the 2025/26 season, potentially reaching 300,000 tonnes and threatening the livelihoods of thousands of local farmers.",
      author: "News Ghana",
      date: "2024-12-19",
      readTime: "4 min read",
      category: "Agribusiness",
      tags: ["Maize Crisis", "Food Security", "Imports"],
      image: "/lovable-uploads/Screenshot 2025-12-19 195104.png",
      link: "https://www.newsghana.com.gh/ghana-faces-agricultural-crisis-as-maize-imports-surge/",
      featured: true
    },
    {
      id: 2,
      title: "5 Challenges Ghanaian Farmers Face Without Smart Tools",
      excerpt: "Discover how Agrilync Nexus is helping to solve agricultural challenges with AI and finance access. Learn about the key obstacles facing Ghanaian farmers and how technology is providing solutions.",
      author: "Agrilync Nexus Team",
      date: "2024-06-25",
      readTime: "5 min read",
      category: "Agribusiness",
      tags: ["Smart Farming", "Technology", "Ghana"],
      image: "/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: true
    },
    {
      id: 3,
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
      id: 4,
      title: "The Role of AI in African Farming: A Smart Future for Agriculture",
      excerpt: "Discover how artificial intelligence is revolutionizing farming practices across Africa, from crop disease detection to predictive analytics and smart farming solutions.",
      author: "AI Research Team",
      date: "2024-05-06",
      readTime: "7 min read",
      category: "Technology",
      tags: ["AI", "Innovation", "Smart Farming"],
      image: "/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png",
      link: "https://agriinsider.beehiiv.com/",
      featured: false
    },
    {
      id: 5,
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
      id: 6,
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
      id: 7,
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

  // Dynamic blog posts fetched from the backend + existing static articles
  const [blogPosts, setBlogPosts] = useState<any[]>(staticBlogPosts);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingBlogs(true);
        const res = await api.get('/blogs');
        // Prepend dynamic posts (latest) to the static list
        setBlogPosts([...res.data, ...staticBlogPosts]);
      } catch (err) {
        console.error('Error fetching blogs from backend:', err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchPosts();
  }, []);

  const webinars = WEBINARS;

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
      window.open('https://is.gd/agrilyncwebinarnexus', '_blank');
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
      (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <Navbar />

      {/* Simplified, Brief Hero Section */}
      <section className="relative pt-32 pb-12 bg-[#002F37] overflow-hidden">
        {/* Subtle abstract background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#7ede56] opacity-5 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="text-center max-w-3xl mx-auto">
            {/* Main Heading */}
            <h1
              ref={heroHeadingRef}
              className={`text-3xl md:text-5xl font-bold mb-3 text-white font-montserrat tracking-tight transition-all duration-1000 ${heroHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              Agri<span className="text-[#7ede56]">Insider</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-8 transition-all duration-1000 delay-200 ${heroHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Search the latest precision insights and agricultural breakthroughs.
            </p>

            {/* Enhanced Search Experience */}
            <div className={`transition-all duration-1000 delay-300 ${heroHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <form onSubmit={handleSearchSubmit} className="relative group p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 focus-within:border-[#7ede56] transition-all max-w-lg mx-auto shadow-xl">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7ede56] z-10">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search articles or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-28 py-5 text-sm border-none focus-visible:ring-0 rounded-full bg-transparent text-white placeholder:text-white/60 w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-28 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10">
                  <Button type="submit" className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] rounded-full px-5 py-4 font-bold text-xs uppercase transition-all">
                    Search
                  </Button>
                </div>
              </form>
              
              {/* Trending Tags */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-wider text-white/50">
                <span className="text-white/60">Trending:</span>
                <button type="button" onClick={() => handleTrendingClick('tomato')} className="hover:text-[#7ede56] transition-colors">#TomatoFix</button>
                <button type="button" onClick={() => handleTrendingClick('greenhouse')} className="hover:text-[#7ede56] transition-colors">#SmartGH</button>
                <button type="button" onClick={() => handleTrendingClick('fintech')} className="hover:text-[#7ede56] transition-colors">#AgriFintech</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation - Clean Premium Editorial Design */}
      <section className="py-4 sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide justify-start lg:justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-[#002f37] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/50'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
            <div className="w-24 h-1 bg-gradient-to-r from-[#7ede56] to-[#7ede56] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post, index) => {
              const content = (
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
                      <h3 className="text-2xl font-bold mb-3 text-[#7ede56] group-hover:text-white transition-colors">
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
              );

              return post._id ? (
                <Link
                  key={post._id || post.slug}
                  to={`/blog/${post.slug}`}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {content}
                </Link>
              ) : (
                <a
                  key={post.id || post.slug}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles - Modern Grid */}
      <section id="latest-articles" className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 ref={latestRef} className={`text-3xl sm:text-4xl font-bold mb-4 text-[#002F37] transition-all duration-700 ${latestVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Latest Articles
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7ede56] to-[#7ede56] rounded-full mx-auto"></div>
          </div>

          {/* Simple Sleek Search Summary */}
          {(searchTerm || activeTab !== 'all') && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8 text-sm">
              <span className="text-gray-500">
                Found <strong className="text-[#002f37] font-semibold">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {activeTab !== 'all' && <> in <span className="text-[#002f37] font-bold">{categories.find(c => c.id === activeTab)?.name}</span></>}
                {searchTerm && <> for "<span className="text-[#002f37] font-bold">{searchTerm}</span>"</>}
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="text-[#002f37] hover:text-gray-500 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {loadingBlogs ? (
            <div className="flex flex-col items-center justify-center py-20 w-full col-span-3">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#7ede56] animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-[#002f37]/60">Fetching latest dynamic publications...</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={post._id || post.slug}
                    id={post.slug}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#7ede56]/30"
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
                        {post.tags && post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs border-[#7ede56]/20 text-[#7ede56]">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-[#002F37] group-hover:text-[#7ede56] transition-colors leading-tight">
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
                        {post._id ? (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-[#7ede56] hover:text-[#66cc44] font-semibold text-sm group-hover:gap-3 transition-all"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#7ede56] hover:text-[#66cc44] font-semibold text-sm group-hover:gap-3 transition-all"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 max-w-md mx-auto">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#002f37] mb-2">No matching articles found</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                We couldn't find any articles matching "{searchTerm}". Try exploring popular topics like <button onClick={() => handleTrendingClick('tomato')} className="text-[#002f37] hover:underline font-bold">Tomato Fix</button> or <button onClick={() => handleTrendingClick('greenhouse')} className="text-[#002f37] hover:underline font-bold">Smart Greenhouse</button>.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="bg-[#002f37] hover:bg-[#001c21] text-white rounded-full px-6 py-2 transition-all"
              >
                Reset Search & Filters
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
            <div className="w-24 h-1 bg-gradient-to-r from-[#7ede56] to-[#7ede56] rounded-full mx-auto mb-4"></div>
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
                  <CardTitle className="text-xl font-bold group-hover:text-[#7ede56] transition-colors">
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
            <div className="w-24 h-1 bg-gradient-to-r from-[#7ede56] to-[#7ede56] rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch recordings of our previous webinars and learn from expert sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webinars.filter(w => w.status === 'completed').map((webinar, index) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#7ede56]/30 rounded-2xl">
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
                    <Badge className="bg-[#7ede56] text-[#002f37] flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-[#7ede56] transition-colors">
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
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white rounded-full transition-all duration-300"
                      onClick={() => webinar.recordingLink && window.open(webinar.recordingLink, '_blank')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {webinar.recordingLink ? 'Watch Recording' : 'Recording Coming Soon'}
                    </Button>

                    {(webinar as any).pdfLink && (
                      <Button
                        variant="default"
                        className="w-full bg-[#002F37] text-white hover:bg-[#004555] rounded-full transition-all duration-300"
                        onClick={() => window.open((webinar as any).pdfLink, '_blank')}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Webinar Source
                      </Button>
                    )}
                  </div>
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

          <h2 ref={transformRef} className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-700 ${transformVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
            Free 30-minute session � No credit card required
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
