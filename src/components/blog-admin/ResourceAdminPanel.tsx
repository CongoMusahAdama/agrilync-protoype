import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Tag,
  AlignLeft,
  Image as ImageIcon,
  Link2,
  Loader2,
  Trash2,
  Edit,
  UploadCloud,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/utils/customSonner';
import api from '@/utils/api';
import {
  uploadBlogImage,
  createResource,
  updateResource,
  getApiErrorMessage,
} from '@/services/blogAdminService';
import {
  RESOURCE_CATEGORY_OPTIONS,
  DEFAULT_TYPE_BY_CATEGORY,
  getCategoryLabel,
  type ResourceCategoryId,
} from '@/lib/resourceCategories';

export type ApiResource = {
  _id: string;
  title: string;
  category: ResourceCategoryId;
  type?: string;
  description: string;
  coverImage: string;
  documentUrl: string;
  badge?: string;
  tags?: string[];
  stats?: string;
  published?: boolean;
  createdAt: string;
};

type ResourceAdminPanelProps = {
  viewMode: 'form' | 'list';
  onResourcesChange?: (count: number) => void;
  onRequestFormView?: () => void;
};

const ResourceAdminPanel: React.FC<ResourceAdminPanelProps> = ({
  viewMode,
  onResourcesChange,
  onRequestFormView,
}) => {
  const [resourcesList, setResourcesList] = useState<ApiResource[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategoryId>('tools');
  const [type, setType] = useState(DEFAULT_TYPE_BY_CATEGORY.tools);
  const [description, setDescription] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [badge, setBadge] = useState('Free');
  const [tagsStr, setTagsStr] = useState('');
  const [stats, setStats] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await api.get<ApiResource[]>('/resources/admin/all');
      setResourcesList(res.data);
      onResourcesChange?.(res.data.length);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load resources from server.'));
    } finally {
      setLoadingList(false);
    }
  }, [onResourcesChange]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    setType(DEFAULT_TYPE_BY_CATEGORY[category]);
  }, [category]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('tools');
    setType(DEFAULT_TYPE_BY_CATEGORY.tools);
    setDescription('');
    setDocumentUrl('');
    setBadge('Free');
    setTagsStr('');
    setStats('');
    setCoverImageUrl('');
    setCoverFile(null);
    setCoverPreview(null);
  };

  const resolveCoverImage = async (): Promise<string | null> => {
    if (coverFile) {
      return uploadBlogImage(coverFile);
    }
    if (coverImageUrl.trim()) return coverImageUrl.trim();
    if (coverPreview && !coverFile) return coverPreview;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !documentUrl.trim()) {
      toast.error('Please fill in title, description, and Google Drive document URL.');
      return;
    }

    try {
      setSaving(true);
      const coverImage = await resolveCoverImage();
      if (!coverImage) {
        toast.error('Please upload or paste a cover image URL.');
        setSaving(false);
        return;
      }

      const payload = {
        title: title.trim(),
        category,
        type: type.trim() || DEFAULT_TYPE_BY_CATEGORY[category],
        description: description.trim(),
        coverImage,
        documentUrl: documentUrl.trim(),
        badge,
        tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        stats: stats.trim(),
        published: true,
      };

      if (editingId) {
        await updateResource(editingId, payload);
        toast.success('Resource updated successfully!');
      } else {
        await createResource(payload);
        toast.success('Resource published to the Resources page!');
      }

      resetForm();
      fetchResources();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to save resource.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resource: ApiResource) => {
    onRequestFormView?.();
    setEditingId(resource._id);
    setTitle(resource.title);
    setCategory(resource.category);
    setType(resource.type || DEFAULT_TYPE_BY_CATEGORY[resource.category]);
    setDescription(resource.description);
    setDocumentUrl(resource.documentUrl);
    setBadge(resource.badge || 'Free');
    setTagsStr(resource.tags?.join(', ') || '');
    setStats(resource.stats || '');
    setCoverImageUrl(resource.coverImage);
    setCoverPreview(resource.coverImage);
    setCoverFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const confirmed = await toast.confirm({
      title: 'Delete resource?',
      text: 'It will be removed from the public Resources page. This cannot be undone.',
      confirmText: 'Yes, delete',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/resources/${id}`);
      toast.success('Resource deleted.');
      if (editingId === id) resetForm();
      fetchResources();
    } catch {
      toast.error('Failed to delete resource.');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8">
          <CardTitle className="text-lg sm:text-2xl font-montserrat font-bold">Resource Registry</CardTitle>
          <CardDescription>
            All resources saved in the database and shown on the public Resources page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {loadingList ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#002f37]" />
            </div>
          ) : resourcesList.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-[#7ede56] mx-auto mb-4" />
              <p className="text-sm text-gray-500">No resources yet. Use &quot;Add Resource&quot; in the sidebar.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {resourcesList.map(resource => (
                <div
                  key={resource._id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between hover:bg-gray-50"
                >
                  <div className="flex gap-4 min-w-0">
                    <img
                      src={resource.coverImage}
                      alt=""
                      className="w-20 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#002f37] truncate">{resource.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-[#002f37] px-2 py-0.5 rounded-full">
                          {getCategoryLabel(resource.category)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={() => handleDelete(resource._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-montserrat font-bold flex flex-wrap items-center gap-2">
          <span>{editingId ? 'Edit Resource' : 'Add New Resource'}</span>
          <Sparkles className="w-5 h-5 text-[#7ede56] flex-shrink-0" />
        </CardTitle>
        <CardDescription>
          Creates an entry on the live Resources page. Document URL should be your Google Drive share link.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80">Title *</label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Farm ROI Calculator"
                className="rounded-xl h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#7ede56]" />
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ResourceCategoryId)}
                className="w-full rounded-xl border border-gray-200 bg-white h-12 px-3 text-sm font-semibold text-[#002f37] focus:ring-1 focus:ring-[#002f37] focus:outline-none"
              >
                {RESOURCE_CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80">Type label</label>
              <Input
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="e.g. Calculator"
                className="rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80">Badge</label>
              <select
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white h-12 px-3 text-sm font-semibold"
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="Free Download">Free Download</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80">Stats (optional)</label>
              <Input
                value={stats}
                onChange={e => setStats(e.target.value)}
                placeholder="e.g. 2.4k uses"
                className="rounded-xl h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-[#7ede56]" />
              Description *
            </label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short summary shown on the resource card"
              className="rounded-xl min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-[#7ede56]" />
              Google Drive document URL *
            </label>
            <Input
              type="url"
              value={documentUrl}
              onChange={e => setDocumentUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... or folder link"
              className="rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#7ede56]" />
              Cover image *
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#7ede56]/40 rounded-xl cursor-pointer bg-white hover:bg-[#7ede56]/5">
              <UploadCloud className="w-7 h-7 text-[#002f37] mb-1" />
              <span className="text-xs font-bold text-gray-600">Upload cover image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverFile(file);
                    setCoverPreview(URL.createObjectURL(file));
                    setCoverImageUrl('');
                  }
                }}
              />
            </label>
            <Input
              type="url"
              value={coverImageUrl}
              onChange={e => {
                setCoverImageUrl(e.target.value);
                setCoverPreview(e.target.value || null);
                setCoverFile(null);
              }}
              placeholder="Or paste image URL (Unsplash, etc.)"
              className="rounded-xl h-11"
            />
            {coverPreview && (
              <img src={coverPreview} alt="Cover preview" className="w-full max-w-xs h-32 object-cover rounded-xl border-2 border-[#7ede56]" />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#002f37]/80">Tags (comma separated)</label>
            <Input
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Finance, Planning"
              className="rounded-xl h-12"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl h-12 w-full sm:w-auto">
                Cancel edit
              </Button>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#002f37] hover:bg-[#001f24] text-[#7ede56] font-bold h-12 rounded-xl w-full sm:flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : editingId ? (
                'Update resource'
              ) : (
                'Publish resource'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResourceAdminPanel;
