/**
 * Dashboard Constants and Configuration for AgriLync
 */

// Ghana region coordinates for weather lookup
export const GHANA_COORDS: Record<string, { lat: number; lng: number }> = {
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
  'Bono Region': { lat: 7.9497, lng: -2.3347 },
  'Oti Region': { lat: 7.9000, lng: 0.3000 },
  'Savannah Region': { lat: 9.0880, lng: -1.8230 },
  'North East Region': { lat: 10.5105, lng: -0.3616 },
  'Ahafo Region': { lat: 7.5600, lng: -2.5500 },
  'Western North Region': { lat: 6.3093, lng: -2.7905 },
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
