import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Loader2, Users, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/utils/customSonner';
import api from '@/utils/api';
import {
  fetchAdminSubscribers,
  getApiErrorMessage,
  type SubscriberRecord,
} from '@/services/blogAdminService';

type SubscribersAdminPanelProps = {
  onCountChange?: (count: number) => void;
  /** Use super-admin session instead of blog-admin token */
  superAdmin?: boolean;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('ellipsis');
  if (total > 1) pages.push(total);
  return pages;
}

const SubscribersAdminPanel: React.FC<SubscribersAdminPanelProps> = ({
  onCountChange,
  superAdmin = false,
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const loadSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const data = superAdmin
        ? (await api.get<SubscriberRecord[]>('/super-admin/subscribers')).data
        : await fetchAdminSubscribers();
      setSubscribers(data);
      onCountChange?.(data.length);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load subscribers from server.'));
    } finally {
      setLoading(false);
    }
  }, [onCountChange, superAdmin]);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter(
      s =>
        s.email.toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.source || '').toLowerCase().includes(q) ||
        (s.lastResource || '').toLowerCase().includes(q)
    );
  }, [subscribers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);
  const withPhone = useMemo(() => subscribers.filter(s => s.phone).length, [subscribers]);

  const exportCsv = () => {
    const toExport = filtered.length ? filtered : subscribers;
    if (!toExport.length) {
      toast.error('No subscribers to export.');
      return;
    }
    const header = 'Name,Email,Phone,Source,Last Resource,Joined\n';
    const rows = toExport
      .map(s =>
        [
          s.name || '',
          s.email,
          s.phone || '',
          s.source || '',
          s.lastResource || '',
          new Date(s.createdAt).toISOString(),
        ]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrilync-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Subscriber list exported.');
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-2xl font-montserrat font-bold flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#7ede56] flex-shrink-0" />
              Subscribers
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Emails and phones from Resources, blog, and newsletter — synced from the database.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={exportCsv}
            disabled={!subscribers.length}
            className="rounded-xl font-bold text-xs uppercase tracking-wider w-full sm:w-auto flex-shrink-0 h-11"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {!loading && subscribers.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, phone, source…"
                className="pl-9 h-10 rounded-xl border-gray-200 text-sm"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-[#002f37]/5 text-[#002f37]">
                {subscribers.length} total
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                {withPhone} with phone
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#002f37]" />
            <p className="text-xs text-gray-500 mt-3 font-bold">Loading from backend…</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No subscribers yet. They appear when users use Get Free Access or subscribe on the site.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No subscribers match your search.</p>
            <Button variant="ghost" className="mt-2 text-xs" onClick={() => setSearch('')}>
              Clear search
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2 border-[#002f37]/10">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="hidden lg:table-cell">Last resource</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((sub, index) => (
                  <TableRow key={sub._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                    <TableCell className="text-center text-[10px] font-black text-gray-400 tabular-nums">
                      {rangeStart + index}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate font-semibold text-[#002f37]">
                      {sub.name || '—'}
                    </TableCell>
                    <TableCell className="max-w-[180px] sm:max-w-[240px] truncate text-[#002f37]">
                      {sub.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {sub.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-[#7ede56] shrink-0" />
                          {sub.phone}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-[10px] font-bold uppercase bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 whitespace-nowrap">
                        {sub.source || 'website'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-xs text-gray-500 font-medium">
                      {sub.lastResource || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap tabular-nums">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-gray-500">
                Showing{' '}
                <span className="text-[#002f37]">{rangeStart}–{rangeEnd}</span>
                {' '}of{' '}
                <span className="text-[#002f37]">{filtered.length}</span>
                {search.trim() ? ' matching' : ''} subscriber{filtered.length === 1 ? '' : 's'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rows</span>
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs font-bold text-[#002f37] outline-none focus:border-[#7ede56]"
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <nav aria-label="Subscriber pagination" className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="h-9 px-2.5 rounded-lg text-xs font-bold gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>

                  {pageNumbers.map((item, i) =>
                    item === 'ellipsis' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm">
                        …
                      </span>
                    ) : (
                      <Button
                        key={item}
                        type="button"
                        variant={page === item ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPage(item)}
                        className={`h-9 w-9 rounded-lg text-xs font-black p-0 ${
                          page === item
                            ? 'bg-[#002f37] text-white hover:bg-[#002f37]/90'
                            : 'text-gray-600'
                        }`}
                      >
                        {item}
                      </Button>
                    )
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="h-9 px-2.5 rounded-lg text-xs font-bold gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscribersAdminPanel;
