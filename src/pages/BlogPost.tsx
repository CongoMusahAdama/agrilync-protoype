import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, User, Share2, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { resolvePublicAssetUrl, rewriteHtmlAssetUrls } from '@/lib/resolveAssetUrl';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import 'react-quill/dist/quill.snow.css';

interface BlogPostType {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
  tags?: string[];
}

const BlogPostSkeleton = () => (
  <div className="min-h-screen bg-[#fafafa] text-[#002f37] overflow-x-hidden animate-pulse">
    <Navbar />
    <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
        <div className="w-full h-[300px] md:h-[500px] rounded-[2rem] bg-gray-200" />
      </div>
    </section>
    <section className="pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 lg:max-w-[68%] space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="h-12 bg-gray-200 rounded w-4/5" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
        <div className="w-full lg:w-[32%] h-64 bg-gray-200 rounded-2xl" />
      </div>
    </section>
    <Footer />
  </div>
);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const res = await api.get<BlogPostType>(`/blogs/${slug}`, { timeout: 10000 });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isPending) {
    return <BlogPostSkeleton />;
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 px-6 flex-grow flex flex-col justify-center items-center">
          <div className="p-4 bg-gray-50 rounded-full border border-gray-100 mb-6">
            <BookOpen className="w-12 h-12 text-[#7ede56]" />
          </div>
          <h2 className="text-3xl font-montserrat font-bold text-[#002f37] mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The article you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Button
            onClick={() => navigate('/blog')}
            className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] font-bold rounded-full px-8 py-6 transition-all shadow-lg shadow-[#7ede56]/20"
          >
            Back to Hub
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
        .then(() => toast.success('Shared successfully!'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubscribing(true);
      const res = await api.post<{ success: boolean; msg: string }>('/blogs/subscribe', {
        email: email.trim(),
        source: 'blog-post',
      });
      if (!res.data.success) {
        toast.error(res.data.msg || 'Failed to subscribe. Please try again.');
        return;
      }
      toast.success(res.data.msg || 'Successfully subscribed!');
      setEmail('');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg;
      toast.error(msg || 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#002f37] overflow-x-hidden">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#7ede56] transition-colors mb-6 font-semibold tracking-wider text-xs uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50">
            <img
              src={resolvePublicAssetUrl(post.image)}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      <section className="pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1 lg:max-w-[68%]">
            <div className="flex flex-wrap items-center justify-start gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider bg-white">
                {post.category}
              </span>
              {post.tags && post.tags.map((tag, i) => (
                <span key={i} className="text-[#7ede56] text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-montserrat font-bold tracking-tight leading-[1.15] mb-6 text-[#002f37]">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <User className="w-4 h-4 text-[#002f37]" />
                </div>
                <span className="font-medium text-[#002f37]">By {post.author}</span>
              </div>
              <span className="font-medium text-[#002f37]">{formattedDate}</span>
            </div>

            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-10">
              {post.excerpt}
            </p>

            <div
              className="blog-content-area ql-editor"
              dangerouslySetInnerHTML={{ __html: rewriteHtmlAssetUrls(post.content) }}
            />
          </div>

          <div className="w-full lg:w-[32%] lg:max-w-[340px]">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7ede56]/10 rounded-bl-full pointer-events-none" />

                <h3 className="text-xl font-montserrat font-bold mb-2 text-[#002f37]">Don't Miss Out</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Join our newsletter to get latest insights for your agribusiness growth!
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Firstname"
                    className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#7ede56] focus:ring-1 focus:ring-[#7ede56]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#7ede56] focus:ring-1 focus:ring-[#7ede56]"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full h-11 mt-2 rounded-lg bg-[#002f37] hover:bg-[#001f24] text-white font-bold transition-colors shadow-md disabled:opacity-50 flex items-center justify-between px-5"
                  >
                    <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
                    <span>→</span>
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#002f37] mb-4">Share this article</h4>
                <div className="flex items-center gap-3">
                  <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#002f37] hover:border-[#002f37] transition-all shadow-sm hover:shadow-md">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
