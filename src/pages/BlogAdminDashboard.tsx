import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, PlusCircle, BookOpen, Trash2, 
  Sparkles, Tag, Clock, AlignLeft, FileText, 
  Image as ImageIcon, Loader2, Globe, Shield, Send, UploadCloud, Images, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/utils/api';
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
  const [adminUser, setAdminUser] = useState<any>(null);
  
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
  const [activeTab, setActiveTab] = useState('add');
  
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
        const token = localStorage.getItem('blogAdminToken');
        const res = await api.post('/blogs/upload', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          }
        });
        
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendOrigin = baseURL.replace(/\/api\/?$/, '');
        const imageUrl = backendOrigin + res.data.imageUrl;

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
  // Authentication validation
  useEffect(() => {
    const token = localStorage.getItem('blogAdminToken');
    const userStr = localStorage.getItem('blogAdminUser');
    if (!token || !userStr) {
      toast.error('Session expired or access denied.');
      navigate('/blog/admin/login');
      return;
    }
    setAdminUser(JSON.parse(userStr));
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const res = await api.get('/blogs');
      setBlogsList(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('blogAdminToken');
    localStorage.removeItem('blogAdminUser');
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
    setActiveTab('add');
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
    setActiveTab('manage');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error('Please fill in all required fields (Title, Excerpt, Content).');
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
        const formData = new FormData();
        formData.append('image', uploadFile);
        const token = localStorage.getItem('blogAdminToken');
        const uploadRes = await api.post('/blogs/upload', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          }
        });
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendOrigin = baseURL.replace(/\/api\/?$/, '');
        finalImage = backendOrigin + uploadRes.data.imageUrl;
      }

      if (!finalImage) {
        toast.error('Please select, specify, or upload a banner image.');
        setPublishing(false);
        return;
      }
      
      if (editingId) {
        await api.put(`/blogs/${editingId}`, {
          title,
          category,
          readTime,
          excerpt,
          content,
          image: finalImage,
          tags: tagsStr.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
          author: adminUser?.username || 'AgriLync Team'
        });
        toast.success('Blog post updated successfully!');
      } else {
        await api.post('/blogs', {
          title,
          category,
          readTime,
          excerpt,
          content,
          image: finalImage,
          tags: tagsStr.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
          author: adminUser?.username || 'AgriLync Team',
          sendBlast
        });
        toast.success(sendBlast ? 'Blog post published and email blast initiated successfully!' : 'Blog post successfully published to the main page!');
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
      
      // Refresh list
      fetchBlogs();
      setActiveTab('manage');
    } catch (err: any) {
      console.error('Publishing error:', err);
      const errMsg = err.response?.data?.msg || 'Failed to publish blog post.';
      toast.error(errMsg);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog post deleted successfully.');
      fetchBlogs();
    } catch (err) {
      console.error('Deletion error:', err);
      toast.error('Failed to delete the blog post.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#002f37] pb-12">
      {/* Top Glass Header */}
      <header className="bg-[#002f37] text-white py-6 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7ede56]/20 border border-[#7ede56]/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#7ede56]" />
          </div>
          <div>
            <h1 className="font-montserrat font-bold text-lg leading-tight flex items-center gap-2">
              AgriLync Hub Console <Sparkles className="w-4 h-4 text-[#7ede56]" />
            </h1>
            <p className="text-white/60 text-xs">Logged in as {adminUser?.email || 'Publisher'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/blog')}
            className="bg-[#1b4349] hover:bg-[#25555c] border border-white/20 text-white font-bold rounded-xl shadow-md transition-all h-10 px-5 text-xs tracking-wider"
          >
            <Globe className="w-4 h-4 mr-2" />
            VIEW LIVE BLOG
          </Button>
          <Button 
            onClick={handleLogout}
            className="bg-[#f24747] hover:bg-[#ff5555] text-white font-bold rounded-xl shadow-md gap-2 transition-all h-10 px-5 text-xs tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-200/80 shadow-sm w-full grid grid-cols-2 gap-2 h-auto sm:h-14">
            <TabsTrigger 
              value="add" 
              className="rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-[#002f37] data-[state=active]:text-white h-11"
            >
              <PlusCircle className="w-4 h-4 mr-1 sm:mr-2" />
              {editingId ? 'Edit Blog' : 'Write New Blog'}
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="rounded-xl font-bold text-sm data-[state=active]:bg-[#002f37] data-[state=active]:text-white h-11"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Blogs ({blogsList.length})
            </TabsTrigger>
          </TabsList>

          {/* WRITE BLOG TAB */}
          <TabsContent value="add">
            <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl font-montserrat font-bold flex items-center gap-2">
                  {editingId ? 'Update Existing Blog Post' : 'Compose Dynamic Blog Post'} <Sparkles className="w-5 h-5 text-[#7ede56]" />
                </CardTitle>
                <CardDescription>
                  Write articles that instantly reflect on the live AgriLync Insights Hub page.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handlePublish} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
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
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#002f37] focus-within:border-transparent transition-all shadow-sm">
                      <style>{`
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
                        className="min-h-[350px] text-sm text-[#002f37]"
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

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {editingId && (
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={publishing}
                        className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-bold h-14 px-8 rounded-xl flex-1 sm:flex-none"
                      >
                        Cancel Edit
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={publishing}
                      className="bg-[#002f37] hover:bg-[#001f24] text-[#7ede56] border border-[#7ede56]/30 font-bold h-14 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] w-full"
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
          </TabsContent>

          {/* MANAGE BLOGS TAB */}
          <TabsContent value="manage">
            <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-6 sm:p-8">
                <CardTitle className="text-2xl font-montserrat font-bold">
                  Published Registry
                </CardTitle>
                <CardDescription>
                  Below is the registry of all published blogs retrieved dynamically from the database.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
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
                          className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors gap-4"
                        >
                          <div>
                            <h4 className="font-semibold text-[#002f37] text-md">{blog.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                              <span className="bg-gray-100 text-[#002f37] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                                {blog.category}
                              </span>
                              <span>•</span>
                              <span>Published {new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Gallery Creation Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl border border-gray-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat font-bold text-[#002f37] flex items-center gap-2">
              <Images className="w-6 h-6 text-[#7ede56]" />
              Create Row Gallery (Max 3 Images)
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Arrange 2 or 3 images side-by-side on a single row. You can upload local images, or insert custom web links.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
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
                  const token = localStorage.getItem('blogAdminToken');
                  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                  const backendOrigin = baseURL.replace(/\/api\/?$/, '');

                  for (let i = 0; i < 3; i++) {
                    if (activeFiles[i]) {
                      const formData = new FormData();
                      formData.append('image', activeFiles[i]!);
                      const res = await api.post('/blogs/upload', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          'x-auth-token': token
                        }
                      });
                      finalUrls.push(backendOrigin + res.data.imageUrl);
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
