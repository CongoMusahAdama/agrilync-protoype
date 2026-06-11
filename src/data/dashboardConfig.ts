/**
 * Dashboard Constants and Configuration for AgriLync
 */
import { getRegionKey } from '@/data/ghanaRegions';

// Ghana region coordinates for weather lookup
export const GHANA_COORDS: Record<string, { lat: number; lng: number }> = {
  'Ashanti': { lat: 6.6885, lng: -1.6244 },
  'Western': { lat: 5.1264, lng: -2.0014 },
  'Ashanti Region': { lat: 6.6885, lng: -1.6244 },
  'Greater Accra Region': { lat: 5.6037, lng: -0.1870 },
  'Northern Region': { lat: 9.4008, lng: -0.8393 },
  'Western Region': { lat: 5.1264, lng: -2.0014 },
  'Eastern Region': { lat: 6.5581, lng: -0.2166 },
  'Central Region': { lat: 5.1054, lng: -1.2466 },
  'Volta Region': { lat: 6.6120, lng: 0.4590 },
  'Upper East Region': { lat: 10.7887, lng: -0.8476 },
  'Upper West Region': { lat: 10.2529, lng: -2.3242 },
  'Brong-Ahafo Region': { lat: 7.9497, lng: -2.3347 },
  'Bono Ahafo Region': { lat: 7.9497, lng: -2.3347 },
  'Bono Region': { lat: 7.9497, lng: -2.3347 },
  'Bono Ahafo': { lat: 7.9497, lng: -2.3347 },
  'Oti Region': { lat: 7.9000, lng: 0.3000 },
  'Savannah Region': { lat: 9.0880, lng: -1.8230 },
  'North East Region': { lat: 10.5105, lng: -0.3616 },
  'Ahafo Region': { lat: 7.5600, lng: -2.5500 },
  'Asunafo North Ahafo Region': { lat: 6.8030, lng: -2.5150 },
  'Asunafo North Ahafo': { lat: 6.8030, lng: -2.5150 },
  'Western North Region': { lat: 6.3093, lng: -2.7905 },
};

const DEFAULT_COORDS = GHANA_COORDS['Ashanti Region'];

/** Resolve map/weather coordinates for any region label (Western, Western Region, etc.) */
export const getCoordsForRegion = (region?: string) => {
  if (!region) return DEFAULT_COORDS;
  if (GHANA_COORDS[region]) return GHANA_COORDS[region];
  const key = getRegionKey(region);
  if (GHANA_COORDS[key]) return GHANA_COORDS[key];
  const short = key.replace(/\s+Region$/i, '').trim();
  return GHANA_COORDS[short] || DEFAULT_COORDS;
};

// Status Badge styles for consistency
export const STATUS_STYLES: Record<string, string> = {
  active: 'bg-[#065f46]/10 text-[#065f46]',
  pending: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  inactive: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  verified: 'bg-[#065f46]/10 text-[#065f46]',
  Completed: 'bg-[#065f46]/10 text-[#065f46]',
  Pending: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  scheduled: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  'needs-attention': 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
  'at-risk': 'bg-rose-600/10 text-rose-700 dark:bg-rose-600/20 dark:text-rose-400',
  'Pending Funding': 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  'Pending Approval': 'bg-[#065f46]/10 text-[#065f46]',
  'Under Review': 'bg-[#065f46]/10 text-[#065f46]',
  Active: 'bg-[#065f46]/10 text-[#065f46]',
  Ongoing: 'bg-[#065f46]/10 text-[#065f46]',
  Resolved: 'bg-[#065f46]/10 text-[#065f46]'
};

// Cache performance settings
export const DASHBOARD_CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes (matches backend cache TTL)
export const DASHBOARD_CACHE_GC_TIME = 10 * 60 * 1000; // 10 minutes
/** Background refresh for live dashboard widgets (avoid sub-minute polling — hits rate limits). */
export const DASHBOARD_POLL_INTERVAL_MS = 60 * 1000;

import api from '@/utils/api';

export const SUMMARY_QUERY_KEY = ['agentDashboardSummary'];
export const VISITS_QUERY_KEY = ['scheduledVisits'];
export const MEDIA_QUERY_KEY = ['mediaItems'];

export const fetchDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data.data;
};

export const fetchScheduledVisits = async () => {
  const response = await api.get('/scheduled-visits');
  const resData = response.data;
  return Array.isArray(resData) ? resData : (resData?.data || []);
};

export const fetchMediaItems = async () => {
  const res = await api.get('/media');
  return Array.isArray(res.data) ? res.data : (res.data.data || []);
};
