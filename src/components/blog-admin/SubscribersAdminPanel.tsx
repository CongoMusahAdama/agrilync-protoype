import React, { useCallback, useEffect, useState } from 'react';
import { Mail, Phone, Loader2, Users, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const SubscribersAdminPanel: React.FC<SubscribersAdminPanelProps> = ({
  onCountChange,
  superAdmin = false,
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  const exportCsv = () => {
    if (!subscribers.length) {
      toast.error('No subscribers to export.');
      return;
    }
    const header = 'Email,Phone,Source,Last Resource,Joined\n';
    const rows = subscribers
      .map(s =>
        [
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

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-gray-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100/80 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#002f37]" />
            <p className="text-xs text-gray-500 mt-3 font-bold">Loading from backend…</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No subscribers yet. They appear when users use Get Free Access or subscribe on the site.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="px-3 sm:px-6 py-3">Email</th>
                  <th className="px-3 sm:px-6 py-3">Phone</th>
                  <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Source</th>
                  <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">Last resource</th>
                  <th className="px-3 sm:px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50/80">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-[#002f37] max-w-[140px] sm:max-w-none truncate">{sub.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 whitespace-nowrap">
                      {sub.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#7ede56]" />
                          {sub.phone}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        {sub.source || 'website'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs max-w-[200px] truncate hidden lg:table-cell">
                      {sub.lastResource || '—'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscribersAdminPanel;
