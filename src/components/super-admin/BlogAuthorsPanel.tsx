import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen, Copy, Key, Loader2, PenLine, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';

export type BlogAuthorRecord = {
  id: string;
  username: string;
  email: string;
  requiresPasswordChange: boolean;
  isActive: boolean;
  createdAt?: string;
};

const BLOG_LOGIN_PATH = '/blog/admin/login';

const BlogAuthorsPanel: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [authors, setAuthors] = useState<BlogAuthorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthorRecord | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [credentialsDialog, setCredentialsDialog] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const loginUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${BLOG_LOGIN_PATH}`
      : BLOG_LOGIN_PATH;

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<BlogAuthorRecord[]>('/super-admin/blog-authors');
      setAuthors(res.data || []);
    } catch {
      toast.error('Failed to load blog authors.');
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const openCreateDialog = () => {
    setEditingAuthor(null);
    setForm({ username: '', email: '', password: '' });
    setDialogOpen(true);
  };

  const openEditDialog = (author: BlogAuthorRecord) => {
    setEditingAuthor(author);
    setForm({ username: author.username, email: author.email, password: '' });
    setDialogOpen(true);
  };

  const showCredentials = (email: string, password: string) => {
    setCredentialsDialog({ email, password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim()) {
      toast.error('Display name and email are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingAuthor) {
        await api.put(`/super-admin/blog-authors/${editingAuthor.id}`, {
          username: form.username.trim(),
          email: form.email.trim(),
        });
        toast.success('Blog author updated.');
      } else {
        const res = await api.post<{
          temporaryPassword?: string;
          author: BlogAuthorRecord;
        }>('/super-admin/blog-authors', {
          username: form.username.trim(),
          email: form.email.trim(),
          ...(form.password.trim() ? { password: form.password.trim() } : {}),
        });

        if (res.data.temporaryPassword) {
          showCredentials(res.data.author.email, res.data.temporaryPassword);
        } else {
          toast.success('Blog author created. Share the password you set securely.');
        }
      }

      setDialogOpen(false);
      await fetchAuthors();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { msg?: string } } }).response?.data?.msg
          : undefined;
      toast.error(message || 'Could not save blog author.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (author: BlogAuthorRecord) => {
    const result = await Swal.fire({
      title: 'Reset password?',
      text: `Generate a new temporary password for ${author.username}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#002f37',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Reset password',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.put<{
        temporaryPassword?: string;
      }>(`/super-admin/blog-authors/${author.id}`, { resetPassword: true });

      if (res.data.temporaryPassword) {
        showCredentials(author.email, res.data.temporaryPassword);
      }
      await fetchAuthors();
    } catch {
      toast.error('Failed to reset password.');
    }
  };

  const handleToggleActive = async (author: BlogAuthorRecord, isActive: boolean) => {
    try {
      await api.put(`/super-admin/blog-authors/${author.id}`, { isActive });
      setAuthors((prev) =>
        prev.map((a) => (a.id === author.id ? { ...a, isActive } : a))
      );
      toast.success(isActive ? 'Author can log in again.' : 'Author login disabled.');
    } catch {
      toast.error('Failed to update author status.');
    }
  };

  const handleDelete = async (author: BlogAuthorRecord) => {
    const result = await Swal.fire({
      title: 'Remove blog author?',
      text: `${author.username} will lose access to the blog dashboard.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Remove',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/super-admin/blog-authors/${author.id}`);
      toast.success('Blog author removed.');
      await fetchAuthors();
    } catch {
      toast.error('Failed to remove blog author.');
    }
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied.`);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b dark:border-white/5 border-gray-100 p-6 md:p-8">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#7ede56]" />
              Blog Author Logins
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">
              Create accounts for writers to publish at {BLOG_LOGIN_PATH}
            </CardDescription>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Author
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className={`px-6 py-4 border-b text-sm ${darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
            <span className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Login URL — </span>
            <button
              type="button"
              onClick={() => copyText(loginUrl, 'Login URL')}
              className="text-[#002f37] dark:text-[#7ede56] font-semibold hover:underline inline-flex items-center gap-1"
            >
              {loginUrl}
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading authors…
            </div>
          ) : authors.length === 0 ? (
            <div className="py-16 text-center px-6">
              <p className="text-sm text-gray-500 mb-4">No blog authors yet.</p>
              <Button variant="outline" onClick={openCreateDialog} className="rounded-xl">
                <UserPlus className="w-4 h-4 mr-2" />
                Create first author
              </Button>
            </div>
          ) : (
            <div className="divide-y dark:divide-white/5 divide-gray-100">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#7ede56]/5 transition-colors"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-lg uppercase tracking-tight truncate">
                        {author.username}
                      </h3>
                      {!author.isActive && (
                        <Badge variant="outline" className="text-[9px] border-rose-200 text-rose-600">
                          Disabled
                        </Badge>
                      )}
                      {author.requiresPasswordChange && author.isActive && (
                        <Badge variant="outline" className="text-[9px] border-amber-200 text-amber-700">
                          Must change password
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{author.email}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 pr-2">
                      <Label htmlFor={`active-${author.id}`} className="text-[10px] font-bold uppercase text-gray-400">
                        Active
                      </Label>
                      <Switch
                        id={`active-${author.id}`}
                        checked={author.isActive}
                        onCheckedChange={(checked) => handleToggleActive(author, checked)}
                        className="data-[state=checked]:bg-[#7ede56]"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[10px] font-black uppercase"
                      onClick={() => openEditDialog(author)}
                    >
                      <PenLine className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[10px] font-black uppercase"
                      onClick={() => handleResetPassword(author)}
                    >
                      <Key className="w-3.5 h-3.5 mr-1" />
                      Reset password
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(author)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingAuthor ? 'Edit blog author' : 'New blog author'}</DialogTitle>
            <DialogDescription>
              {editingAuthor
                ? 'Update display name or email.'
                : 'A temporary password is generated unless you set one. Authors must change it on first login.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="author-username">Display name</Label>
              <Input
                id="author-username"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="e.g. Raph Mawuli"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-email">Email (login)</Label>
              <Input
                id="author-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="author@agrilync.com"
                className="h-11 rounded-xl"
                required
              />
            </div>
            {!editingAuthor && (
              <div className="space-y-2">
                <Label htmlFor="author-password">Temporary password (optional)</Label>
                <Input
                  id="author-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to auto-generate"
                  className="h-11 rounded-xl"
                  minLength={8}
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#002f37] text-white rounded-xl font-bold"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAuthor ? 'Save changes' : 'Create author'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!credentialsDialog} onOpenChange={() => setCredentialsDialog(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Share these credentials securely</DialogTitle>
            <DialogDescription>
              This password is shown once. The author must change it at first login.
            </DialogDescription>
          </DialogHeader>
          {credentialsDialog && (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Login URL</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs break-all">{loginUrl}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => copyText(loginUrl, 'Login URL')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <span>{credentialsDialog.email}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => copyText(credentialsDialog.email, 'Email')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Temporary password</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[#002f37] dark:text-[#7ede56]">
                      {credentialsDialog.password}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => copyText(credentialsDialog.password, 'Password')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="w-full rounded-xl" onClick={() => setCredentialsDialog(null)}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAuthorsPanel;
