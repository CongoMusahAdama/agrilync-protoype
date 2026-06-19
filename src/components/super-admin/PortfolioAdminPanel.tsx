import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import {
  PORTFOLIO_CATEGORY_OPTIONS,
  PORTFOLIO_REGION_OPTIONS,
  type PortfolioItem,
} from '@/data/portfolioMeta';

const emptyForm = {
  title: '',
  region: PORTFOLIO_REGION_OPTIONS[0] || 'Western Region',
  category: PORTFOLIO_CATEGORY_OPTIONS[0] || 'Training',
  date: '',
  description: '',
  sortOrder: '',
  published: true,
  image: '',
};

const PortfolioAdminPanel: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<PortfolioItem[]>('/super-admin/portfolio');
      setItems(res.data || []);
    } catch {
      toast.error('Failed to load portfolio images.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview('');
    setDialogOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      region: item.region,
      category: item.category,
      date: item.date || '',
      description: item.description || '',
      sortOrder: item.sortOrder != null ? String(item.sortOrder) : '',
      published: item.published !== false,
      image: item.image,
    });
    setImagePreview(resolvePublicAssetUrl(item.image));
    setDialogOpen(true);
  };

  const handleImagePick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be under 8MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setForm((prev) => ({ ...prev, image: dataUrl }));
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.region || !form.category) {
      toast.error('Title, region, and category are required.');
      return;
    }
    if (!form.image) {
      toast.error('Please upload an image.');
      return;
    }

    const sortOrderValue = form.sortOrder.trim() ? Number(form.sortOrder) : undefined;
    const payload = {
      title: form.title.trim(),
      region: form.region,
      category: form.category,
      date: form.date.trim(),
      description: form.description.trim(),
      ...(sortOrderValue != null && Number.isFinite(sortOrderValue) ? { sortOrder: sortOrderValue } : {}),
      published: form.published,
      image: form.image,
    };

    try {
      setSaving(true);
      if (editing) {
        await api.put(`/super-admin/portfolio/${editing.id}`, payload);
        toast.success('Portfolio image updated.');
      } else {
        await api.post('/super-admin/portfolio', payload);
        toast.success('Portfolio image added.');
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg;
      toast.error(msg || 'Could not save portfolio image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    const confirm = await Swal.fire({
      title: 'Remove this image?',
      text: `"${item.title}" will be removed from the public portfolio page.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#065f46',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/super-admin/portfolio/${item.id}`);
      toast.success('Portfolio image removed.');
      fetchItems();
    } catch {
      toast.error('Could not delete portfolio image.');
    }
  };

  return (
    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <CardHeader className="border-b border-black/5 dark:border-white/5 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <ImagePlus className="w-5 h-5 text-[#7ede56]" />
            Website Portfolio
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
            Add extra images below the hero. The featured image at the top is fixed and never changes.
          </CardDescription>
        </div>
        <Button
          onClick={openCreate}
          className="h-11 px-6 bg-[#065f46] hover:bg-[#054a38] text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#7ede56]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-700">
            <ImagePlus className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-semibold text-gray-500">No extra portfolio images yet.</p>
            <p className="text-xs text-gray-400 mt-1">New uploads appear below the hero. The top featured image stays fixed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={String(item.id)}
                className={`rounded-2xl border overflow-hidden group ${darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-white shadow-sm'}`}
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={resolvePublicAssetUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!item.published && (
                    <Badge className="absolute top-3 right-3 bg-gray-800/90 text-white border-0">
                      Hidden
                    </Badge>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className={`font-bold text-sm leading-snug ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    {item.category} · {item.region}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg text-xs font-semibold"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`max-w-lg max-h-[90dvh] overflow-y-auto ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit portfolio image' : 'Add portfolio image'}</DialogTitle>
            <DialogDescription>
              This image will appear on the public portfolio page at /portfolio
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Photo</Label>
              <div
                className={`relative rounded-xl border-2 border-dashed overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-xs font-medium">Upload a high-quality field photo</span>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer flex items-end justify-center p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold bg-black/40 px-3 py-1.5 rounded-full">
                    Change image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImagePick(e.target.files?.[0])}
                  />
                </label>
              </div>
              {!imagePreview && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagePick(e.target.files?.[0])}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-title">Title</Label>
              <Input
                id="portfolio-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Digital Tools Training"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTFOLIO_REGION_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTFOLIO_CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="portfolio-date">Date label</Label>
                <Input
                  id="portfolio-date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g. September 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-sort">Sort order (optional)</Label>
                <Input
                  id="portfolio-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  placeholder="Auto — added at end"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-desc">Description</Label>
              <Textarea
                id="portfolio-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short caption for the portfolio gallery..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
                Published on website
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-[#065f46] hover:bg-[#054a38] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Save changes' : 'Add to portfolio'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PortfolioAdminPanel;
