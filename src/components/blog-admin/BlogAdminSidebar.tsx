import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  PlusCircle,
  BookOpen,
  Layers,
  FolderOpen,
  Globe,
  LogOut,
  ExternalLink,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type BlogAdminSection =
  | 'write-blog'
  | 'manage-blogs'
  | 'add-resource'
  | 'manage-resources'
  | 'subscribers';

export const BLOG_ADMIN_SECTION_LABELS: Record<BlogAdminSection, string> = {
  'write-blog': 'Write New Blog',
  'manage-blogs': 'Manage Blogs',
  'add-resource': 'Add Resource',
  'manage-resources': 'Manage Resources',
  subscribers: 'Subscribers',
};

type NavItem = {
  id: BlogAdminSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

type BlogAdminSidebarProps = {
  activeSection: BlogAdminSection;
  onSectionChange: (section: BlogAdminSection) => void;
  adminEmail?: string;
  blogsCount: number;
  resourcesCount: number;
  subscribersCount: number;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

const BlogAdminSidebar: React.FC<BlogAdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  adminEmail,
  blogsCount,
  resourcesCount,
  subscribersCount,
  onLogout,
  mobileOpen,
  onMobileClose,
}) => {
  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Blog',
      items: [
        { id: 'write-blog', label: 'Write New Blog', icon: PlusCircle },
        { id: 'manage-blogs', label: 'Manage Blogs', icon: BookOpen, badge: blogsCount },
      ],
    },
    {
      title: 'Resources',
      items: [
        { id: 'add-resource', label: 'Add Resource', icon: Layers },
        { id: 'manage-resources', label: 'Manage Resources', icon: FolderOpen, badge: resourcesCount },
      ],
    },
    {
      title: 'Audience',
      items: [
        { id: 'subscribers', label: 'Subscribers', icon: Users, badge: subscribersCount },
      ],
    },
  ];

  const handleNav = (id: BlogAdminSection) => {
    onSectionChange(id);
    onMobileClose();
  };

  const sidebarContent = (
    <>
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#7ede56]/20 border border-[#7ede56]/30 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#7ede56]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-montserrat font-bold text-sm leading-tight flex items-center gap-1.5">
              AgriLync Hub
              <Sparkles className="w-3.5 h-3.5 text-[#7ede56] flex-shrink-0" />
            </h1>
            <p className="text-white/50 text-[10px] truncate mt-0.5">
              {adminEmail || 'Publisher'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-5 overflow-y-auto overscroll-contain">
        {navGroups.map(group => (
          <div key={group.title}>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 px-3 mb-2">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] sm:min-h-0 ${
                        active
                          ? 'bg-[#7ede56] text-[#002f37] shadow-md'
                          : 'text-white/80 hover:bg-white/10 hover:text-white active:bg-white/15'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                            active ? 'bg-[#002f37]/15 text-[#002f37]' : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 sm:p-4 border-t border-white/10 space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button
          asChild
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-11 sm:h-10 text-xs font-bold"
        >
          <Link to="/blog" target="_blank" rel="noopener noreferrer" onClick={onMobileClose}>
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">View Live Blog</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-60 flex-shrink-0" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-11 sm:h-10 text-xs font-bold"
        >
          <Link to="/resources" target="_blank" rel="noopener noreferrer" onClick={onMobileClose}>
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">View Resources</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-60 flex-shrink-0" />
          </Link>
        </Button>
        <Button
          type="button"
          onClick={() => {
            onMobileClose();
            onLogout();
          }}
          className="w-full justify-start gap-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white h-11 sm:h-10 text-xs font-bold border-0"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw,18rem)] max-w-[85vw] bg-[#002f37] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:flex-shrink-0 lg:shadow-none lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:min-h-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Blog admin navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default BlogAdminSidebar;
