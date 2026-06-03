import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Trash2, 
  Sparkles, Tag, Clock, AlignLeft, FileText, 
  Image as ImageIcon, Loader2, Send, UploadCloud, Images, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/utils/customSonner';
import api from '@/utils/api';
import BlogAdminSidebar, {
  type BlogAdminSection,
  BLOG_ADMIN_SECTION_LABELS,
} from '@/components/blog-admin/BlogAdminSidebar';
import { Menu } from 'lucide-react';
import ResourceAdminPanel from '@/components/blog-admin/ResourceAdminPanel';
import SubscribersAdminPanel from '@/components/blog-admin/SubscribersAdminPanel';
import {
  validateBlogAdminSession,
  fetchAdminBlogs,
  fetchAdminResources,
  fetchAdminSubscribers,
  uploadBlogImage,
  createBlogPost,
  updateBlogPost,
  getBlogAdminHeaders,
  getApiErrorMessage,
  clearBlogAdminSession,
  assertApiConfiguredForProduction,
  type BlogAdminUser,
} from '@/services/blogAdminService';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-setup';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

// Register a custom horizontal rule (divider) format
const BlockEmbed = Quill.import('blots/block/embed');
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';
Quill.register(DividerBlot);

// Register a custom gallery format
class GalleryBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute('class', 'blog-gallery-row');
    
    let urls: string[] = [];
    if (Array.isArray(value)) {
      urls = value;
    } else if (typeof value === 'string') {
      try {
        urls = JSON.parse(value);
      } catch (e) {
        urls = [value];
      }
    }

    node.setAttribute('data-images', JSON.stringify(urls));
    
    urls.forEach((url) => {
      if (!url || typeof url !== 'string') return;
      const item = document.createElement('div');
      item.setAttribute('class', 'blog-gallery-item');
      
      const img = document.createElement('img');
      img.setAttribute('src', url);
      img.setAttribute('alt', 'Gallery image');
      
      item.appendChild(img);
      node.appendChild(item);
    });
    
    return node;
  }

  static value(node: HTMLElement) {
    try {
      return JSON.parse(node.getAttribute('data-images') || '[]');
    } catch (e) {
      return [];
    }
  }
}
GalleryBlot.blotName = 'gallery';
GalleryBlot.tagName = 'div';
Quill.register(GalleryBlot);

interface BlogType {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  excerpt?: string;
  content?: string;
  image?: string;
  tags?: string[];
  readTime?: string;
}

const PRESET_IMAGES = [
  { name: 'Sorghum Field & Farmers (Hero)', url: '/lovable-uploads/blog1.png' },
  { name: 'Ghana Tomato Crates', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Smart Greenhouse Canopy', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80' },
  { name: 'African Farm Land Drone', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80' }
];

const BlogAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<BlogAdminUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Agribusiness');
  const [readTime, setReadTime] = useState('5 min read');
  const [imageType, setImageType] = useState<'preset' | 'custom' | 'upload'>('preset');
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [sendBlast, setSendBlast] = useState(false);
  const [tagsStr, setTagsStr] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<BlogAdminSection>('write-blog');
  const [resourcesCount, setResourcesCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);
  
  const [publishing, setPublishing] = useState(false);
  const [blogsList, setBlogsList] = useState<BlogType[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Gallery Modal States
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(['', '', '']);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([null, null, null]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const quillRef = React.useRef<ReactQuill>(null);

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const imageUrl = await uploadBlogImage(file);

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', imageUrl);
          quill.setSelection(index + 1, 0);
        }
      } catch (err) {
        toast.error('Failed to upload inline image.');
      }
    };
  }, []);

  const insertDivider = React.useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, 'divider', true, 'user');
      quill.setSelection(index + 1, 0);
    }
  }, []);

  const galleryHandler = React.useCallback(() => {
    setGalleryImages(['', '', '']);
    setGalleryFiles([null, null, null]);
    setGalleryPreviews([null, null, null]);
    setIsGalleryModalOpen(true);
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video', 'divider', 'gallery'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        divider: insertDivider,
        gallery: galleryHandler
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), [imageHandler, insertDivider, galleryHandler]);
  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const data = await fetchAdminBlogs();
      setBlogsList(data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load blogs from server.'));
    } finally {
      setLoadingBlogs(false);
    }
  };

  const syncDashboardData = async () => {
    await Promise.all([
      fetchBlogs(),
      fetchAdminResources()
        .then((data: unknown[]) => setResourcesCount(data.length))
        .catch(err => toast.error(getApiErrorMessage(err, 'Failed to sync resources.'))),
      fetchAdminSubscribers()
        .then(data => setSubscribersCount(data.length))
        .catch(err => toast.error(getApiErrorMessage(err, 'Failed to sync subscribers.'))),
    ]);
  };

  // Validate session with backend and load all dashboard data
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('blogAdminToken');
      if (!token) {
        navigate('/blog/admin/login');
        return;
      }
      try {
        setSessionLoading(true);
        assertApiConfiguredForProduction();
        const admin = await validateBlogAdminSession();
        setAdminUser(admin);
        await syncDashboardData();
      } catch (err) {
        if (err instanceof Error && err.message.includes('VITE_API_URL')) {
          toast.error(err.message);
          return;
        }
        clearBlogAdminSession();
        toast.error(getApiErrorMessage(err, 'Could not connect to the backend. Please log in again.'));
        navigate('/blog/admin/login');
      } finally {
        setSessionLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleLogout = () => {
    clearBlogAdminSession();
    toast.success('Logged out successfully.');
    navigate('/blog/admin/login');
  };

  const handleEdit = (blog: BlogType) => {
    setTitle(blog.title);
    setCategory(blog.category);
    setReadTime(blog.readTime || '5 min read');
    setExcerpt(blog.excerpt || '');
    setContent(blog.content || '');
    setTagsStr(blog.tags ? blog.tags.join(', ') : '');
    
    // Attempt to handle image type
    const isPreset = PRESET_IMAGES.some(img => img.url === blog.image);
    if (isPreset) {
      setImageType('preset');
      setSelectedPresetImage(blog.image!);
    } else {
      setImageType('custom');
      setCustomImageUrl(blog.image || '');
    }
    
    setEditingId(blog._id);
    setActiveSection('write-blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsStr('');
    setCustomImageUrl('');
    setUploadFile(null);
    setUploadPreview(null);
    setSendBlast(false);
    setActiveSection('manage-blogs');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error('Please fill in all required fields (Title, Excerpt, Content).');
      return;
    }

    if (!getBlogAdminHeaders()['x-auth-token']) {
      toast.error('Session expired. Please log in again.');
      navigate('/blog/admin/login');
      return;
    }
    try {
      setPublishing(true);

      let finalImage = '';
      if (imageType === 'preset') {
        finalImage = selectedPresetImage;
      } else if (imageType === 'custom') {
        finalImage = customImageUrl.trim();
      } else if (imageType === 'upload' && uploadFile) {
        finalImage = await uploadBlogImage(uploadFile);
      }

      if (!finalImage) {
        toast.error('Please select, specify, or upload a banner image.');
        setPublishing(false);
        return;
      }
      
      const blogPayload = {
        title,
        category,
        readTime,
        excerpt,
        content,
        image: finalImage,
        tags: tagsStr.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
        author: adminUser?.username || adminUser?.email || 'AgriLync Team',
      };

      if (editingId) {
        await updateBlogPost(editingId, blogPayload);
        toast.success('Blog post updated successfully!');
      } else {
        await createBlogPost({ ...blogPayload, sendBlast });
        toast.success(sendBlast ? 'Blog post published and email blast initiated!' : 'Blog post published successfully!');
      }
      
      // Clear form
      setEditingId(null);
      setTitle('');
      setExcerpt('');
      setContent('');
      setTagsStr('');
      setCustomImageUrl('');
      setUploadFile(null);
      setUploadPreview(null);
      setSendBlast(false);
      
      await syncDashboardData();
      setActiveSection('manage-blogs');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 401) {
        clearBlogAdminSession();
        toast.error('Session expired. Please log in again.');
        navigate('/blog/admin/login');
        return;
      }
      toast.error(getApiErrorMessage(err, 'Failed to publish blog post.'));
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await toast.confirm({
      title: 'Delete blog post?',
      text: 'This action cannot be undone.',
      confirmText: 'Yes, delete',
    });
    if (!confirmed) return;

    try {
      await api.delete(`/blogs/${id}`, { headers: getBlogAdminHeaders() });
      toast.success('Blog post deleted successfully.');
      await syncDashboardData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 401) {
        clearBlogAdminSession();
        navigate('/blog/admin/login');
        return;
      }
      toast.error(getApiErrorMessage(err, 'Failed to delete the blog post.'));
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#002f37] mx-auto" />
          <p className="text-sm font-bold text-gray-500 mt-4">Connecting to AgriLync backend…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-[#002f37] flex flex-col lg:flex-row">
      <BlogAdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        adminEmail={adminUser?.email}
        blogsCount={blogsList.length}
        resourcesCount={resourcesCount}
        subscribersCount={subscribersCount}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile / tablet top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#002f37] text-white border-b border-white/10 shadow-md pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="p-2.5 -ml-1 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">AgriLync Hub</p>
            <p className="text-sm font-bold truncate">{BLOG_ADMIN_SECTION_LABELS[activeSection]}</p>
          </div>
        </header>

      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 lg:max-h-screen lg:overflow-y-auto overflow-x-hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Blogs', value: blogsList.length },
              { label: 'Resources', value: resourcesCount },
              { label: 'Subscribers', value: subscribersCount },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 px-2 sm:px-4 py-2.5 sm:py-3 shadow-sm text-center"
              >
                <p className="text-lg sm:text-2xl font-black text-[#002f37]">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
          {activeSection === 'write-blog' && (
            <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-montserrat font-bold flex flex-wrap items-center gap-2">
                  <span>{editingId ? 'Update Blog Post' : 'Compose Blog Post'}</span>
                  <Sparkles className="w-5 h-5 text-[#7ede56] flex-shrink-0" />
                </CardTitle>
                <CardDescription>
                  Write articles that instantly reflect on the live AgriLync Insights Hub page.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handlePublish} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#7ede56]" />
                        Article Title
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Can Ghana Finally Fix Its Tomato Crisis?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-xl border-gray-200 h-12 text-md font-semibold text-[#002f37] focus-visible:ring-[#002f37] focus-visible:border-[#002f37]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-[#7ede56]" />
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white h-12 px-3 text-sm font-semibold text-[#002f37] focus:ring-1 focus:ring-[#002f37] focus:outline-none"
                        >
                          <option value="Agribusiness">Agribusiness</option>
                          <option value="Technology">Technology</option>
                          <option value="Policy">Policy</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7ede56]" />
                          Read Time
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. 5 min read"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          className="rounded-xl border-gray-200 h-12 text-sm font-semibold text-[#002f37] focus-visible:ring-[#002f37]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#7ede56]" />
                      Hashtags (Comma Separated)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. innovation, climate, ghana"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      className="rounded-xl border-gray-200 h-12 text-sm font-semibold text-[#002f37] focus-visible:ring-[#002f37] focus-visible:border-[#002f37]"
                    />
                  </div>

                  {/* Banner Image selector */}
                  <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#7ede56]" />
                      Hero Cover Image
                    </label>

                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setImageType('preset')}
                        className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                          imageType === 'preset'
                            ? 'bg-[#002f37] border-[#002f37] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Select stock presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('upload')}
                        className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                          imageType === 'upload'
                            ? 'bg-[#002f37] border-[#002f37] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('custom')}
                        className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                          imageType === 'custom'
                            ? 'bg-[#002f37] border-[#002f37] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Enter custom link
                      </button>
                    </div>

                    {imageType === 'preset' ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PRESET_IMAGES.map((img) => (
                          <div
                            key={img.url}
                            onClick={() => setSelectedPresetImage(img.url)}
                            className={`cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all ${
                              selectedPresetImage === img.url
                                ? 'border-[#7ede56] shadow-md ring-2 ring-[#7ede56]/15'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={img.url.startsWith('/') ? img.url : img.url}
                              alt={img.name}
                              className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center text-[10px] text-white font-bold truncate">
                              {img.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : imageType === 'upload' ? (
                      <div className="w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#7ede56]/50 rounded-xl cursor-pointer bg-[#7ede56]/5 hover:bg-[#7ede56]/10 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-[#002f37] group-hover:text-[#7ede56] mb-2 transition-colors" />
                            <p className="mb-1 text-sm text-[#002f37]"><span className="font-bold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG, WEBP (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadFile(file);
                                setUploadPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {uploadPreview && (
                          <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-[#7ede56] shadow-md max-w-[200px]">
                            <img src={uploadPreview} alt="Preview" className="w-full h-32 object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center text-[10px] text-white font-bold truncate">
                              Ready to upload
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <Input
                          type="url"
                          placeholder="https://images.unsplash.com/... or custom url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          className="rounded-xl border-gray-200 h-12 text-sm text-[#002f37] focus-visible:ring-[#002f37]"
                        />
                        {customImageUrl && (
                          <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-[#7ede56] shadow-md max-w-[200px]">
                            <img 
                              src={customImageUrl} 
                              alt="Current Preview" 
                              className="w-full h-32 object-cover" 
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                              onLoad={(e) => (e.currentTarget.style.display = 'block')}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center text-[10px] text-white font-bold truncate">
                              Current Image
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                      <AlignLeft className="w-3.5 h-3.5 text-[#7ede56]" />
                      Excerpt
                    </label>
                    <Textarea
                      placeholder="e.g. Explore how government-backed research and finance-first innovation are solving Ghana's agriculture tomato crisis by 2026."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="rounded-xl border-gray-200 min-h-[80px] text-sm text-[#002f37] focus-visible:ring-[#002f37]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#7ede56]" />
                      Full Body Content
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      💡 Pro-tip: Use the rich text editor to easily format headings, bullet points, and paragraphs!
                    </p>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#002f37] focus-within:border-transparent transition-all shadow-sm [&_.ql-toolbar]:flex-wrap">
                      <style>{`
                        @media (max-width: 640px) {
                          .blog-admin-quill .ql-editor { min-height: 220px; }
                          .blog-admin-quill .ql-toolbar { padding: 6px; }
                        }
                        .ql-snow .ql-toolbar button.ql-divider,
                        .ql-snow .ql-toolbar button.ql-gallery {
                          width: 28px;
                        }
                        .ql-divider::after {
                          content: "—";
                          font-size: 16px;
                          font-weight: 900;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }
                        .ql-gallery::after {
                          content: "🖼️";
                          font-size: 14px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }
                      `}</style>
                      <ReactQuill 
                        ref={quillRef}
                        theme="snow" 
                        value={content} 
                        onChange={setContent} 
                        className="blog-admin-quill min-h-[280px] sm:min-h-[350px] text-sm text-[#002f37]"
                        modules={modules}
                      />
                    </div>
                  </div>

                  {/* Email Broadcast Toggle */}
                  {!editingId && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-green-100">
                          <Send className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#002f37]">Broadcast to Subscribers</h4>
                          <p className="text-xs text-gray-500">Send an email notification to all registered users instantly upon publishing.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={sendBlast}
                          onChange={(e) => setSendBlast(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ede56]"></div>
                      </label>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    {editingId && (
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={publishing}
                        className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-bold h-12 sm:h-14 px-6 rounded-xl w-full sm:w-auto sm:flex-none"
                      >
                        Cancel Edit
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={publishing}
                      className="bg-[#002f37] hover:bg-[#001f24] text-[#7ede56] border border-[#7ede56]/30 font-bold h-12 sm:h-14 px-6 sm:px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all w-full sm:flex-1"
                    >
                      {publishing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {editingId ? 'Updating article...' : 'Publishing article dynamically...'}
                        </>
                      ) : (
                        editingId ? 'Update Blog Post' : 'Publish Blog Post'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeSection === 'manage-blogs' && (
            <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8">
                <CardTitle className="text-lg sm:text-2xl font-montserrat font-bold">
                  Published Registry
                </CardTitle>
                <CardDescription>
                  Below is the registry of all published blogs retrieved dynamically from the database.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {loadingBlogs ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#002f37] animate-spin" />
                    <p className="mt-4 text-xs text-gray-500 font-bold">Querying database registry...</p>
                  </div>
                ) : blogsList.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-[#7ede56] mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#002f37] mb-2">No Dynamic Blogs Seeded</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Use the "Write New Blog" tab to publish your very first dynamic article!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden border border-gray-100 rounded-2xl">
                    <div className="divide-y divide-gray-100">
                      {blogsList.map((blog) => (
                        <div 
                          key={blog._id} 
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-[#002f37] text-sm sm:text-base line-clamp-2">{blog.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 mt-2">
                              <span className="bg-gray-100 text-[#002f37] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                                {blog.category}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                            <Button
                              onClick={() => handleEdit(blog)}
                              variant="outline"
                              size="icon"
                              className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl shadow-sm transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(blog._id)}
                              variant="destructive"
                              size="icon"
                              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-100 hover:border-red-200 rounded-xl shadow-sm transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(activeSection === 'add-resource' || activeSection === 'manage-resources') && (
            <ResourceAdminPanel
              viewMode={activeSection === 'add-resource' ? 'form' : 'list'}
              onResourcesChange={count => {
                setResourcesCount(count);
                fetchAdminSubscribers().then(d => setSubscribersCount(d.length)).catch(() => {});
              }}
              onRequestFormView={() => setActiveSection('add-resource')}
            />
          )}

          {activeSection === 'subscribers' && (
            <SubscribersAdminPanel onCountChange={setSubscribersCount} />
          )}
        </div>
      </main>
      </div>

      {/* Gallery Creation Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[600px] max-h-[90dvh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat font-bold text-[#002f37] flex items-center gap-2">
              <Images className="w-6 h-6 text-[#7ede56]" />
              Create Row Gallery (Max 3 Images)
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Arrange 2 or 3 images side-by-side on a single row. You can upload local images, or insert custom web links.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 sm:my-6">
            {[0, 1, 2].map((idx) => (
              <Card key={idx} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-50/50">
                <CardHeader className="p-3 bg-gray-100/50 border-b border-gray-100 flex flex-row items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002f37]">Image {idx + 1}</span>
                  {galleryPreviews[idx] && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      onClick={() => {
                        const newPreviews = [...galleryPreviews];
                        newPreviews[idx] = null;
                        setGalleryPreviews(newPreviews);
                        
                        const newFiles = [...galleryFiles];
                        newFiles[idx] = null;
                        setGalleryFiles(newFiles);

                        const newUrls = [...galleryImages];
                        newUrls[idx] = '';
                        setGalleryImages(newUrls);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {galleryPreviews[idx] ? (
                    <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={galleryPreviews[idx]!} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-[10px] font-semibold text-gray-500">Upload Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const newFiles = [...galleryFiles];
                              newFiles[idx] = file;
                              setGalleryFiles(newFiles);

                              const newPreviews = [...galleryPreviews];
                              newPreviews[idx] = URL.createObjectURL(file);
                              setGalleryPreviews(newPreviews);
                            }
                          }}
                        />
                      </label>
                      <div className="text-center text-[10px] text-gray-400">or</div>
                      <Input
                        type="url"
                        placeholder="Paste URL"
                        value={galleryImages[idx]}
                        className="h-8 text-xs rounded-lg border-gray-200"
                        onChange={(e) => {
                          const newUrls = [...galleryImages];
                          newUrls[idx] = e.target.value;
                          setGalleryImages(newUrls);

                          const newPreviews = [...galleryPreviews];
                          newPreviews[idx] = e.target.value || null;
                          setGalleryPreviews(newPreviews);
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsGalleryModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                const activeUrls = [...galleryImages];
                const activeFiles = [...galleryFiles];
                
                let count = 0;
                for (let i = 0; i < 3; i++) {
                  if (activeUrls[i] || activeFiles[i]) count++;
                }
                
                if (count < 2) {
                  toast.error('Please specify at least 2 images to create a row gallery (max 3).');
                  return;
                }

                setGalleryLoading(true);
                try {
                  const finalUrls: string[] = [];
                  for (let i = 0; i < 3; i++) {
                    if (activeFiles[i]) {
                      finalUrls.push(await uploadBlogImage(activeFiles[i]!));
                    } else if (activeUrls[i]) {
                      finalUrls.push(activeUrls[i]);
                    }
                  }

                  const quill = quillRef.current?.getEditor();
                  if (quill) {
                    const range = quill.getSelection(true);
                    const index = range ? range.index : quill.getLength();
                    quill.insertEmbed(index, 'gallery', finalUrls);
                    quill.setSelection(index + 1, 0);
                  }
                  setIsGalleryModalOpen(false);
                  toast.success('Gallery row inserted successfully!');
                } catch (err) {
                  console.error('Gallery creation failed:', err);
                  toast.error('Failed to create gallery row.');
                } finally {
                  setGalleryLoading(false);
                }
              }}
              disabled={galleryLoading}
              className="bg-[#002f37] hover:bg-[#001e23] text-white rounded-full font-bold px-6"
            >
              {galleryLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Insert Gallery'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdminDashboard;
