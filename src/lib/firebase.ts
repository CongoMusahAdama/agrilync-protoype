import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import api from '@/utils/api';

// ─── Firebase Configuration ────────────────────────────────────────────────
// Replace each placeholder with your actual Firebase project values from:
// https://console.firebase.google.com → Project Settings → General → Your Apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY";

// ─── Guard: Detect placeholder / unconfigured state ───────────────────────
const isConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith('YOUR_') &&
  typeof firebaseConfig.projectId === 'string' &&
  !firebaseConfig.projectId.startsWith('YOUR_') &&
  typeof VAPID_KEY === 'string' &&
  !VAPID_KEY.startsWith('YOUR_');

// ─── Conditional Initialization ───────────────────────────────────────────
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

if (isConfigured && typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (e) {
    console.warn('[AgriLync] Firebase init failed — push notifications disabled.', e);
    messaging = null;
  }
} else if (!isConfigured) {
  console.info(
    '[AgriLync] Firebase is not configured. Push notifications are disabled.\n' +
    'To enable, add your Firebase credentials to the .env file:\n' +
    '  VITE_FIREBASE_API_KEY=...\n' +
    '  VITE_FIREBASE_AUTH_DOMAIN=...\n' +
    '  VITE_FIREBASE_PROJECT_ID=...\n' +
    '  VITE_FIREBASE_STORAGE_BUCKET=...\n' +
    '  VITE_FIREBASE_MESSAGING_SENDER_ID=...\n' +
    '  VITE_FIREBASE_APP_ID=...\n' +
    '  VITE_FIREBASE_VAPID_KEY=...'
  );
}

// ─── Public API ───────────────────────────────────────────────────────────

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging || !isConfigured) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (fcmToken) {
      console.log('[AgriLync] FCM Token acquired:', fcmToken);
      // Persist token to backend
      await api.put('/agents/profile', { fcmToken }).catch((err) =>
        console.warn('[AgriLync] Failed to save FCM token to backend:', err)
      );
      return fcmToken;
    }
    return null;
  } catch (error) {
    console.warn('[AgriLync] Notification permission error:', error);
    return null;
  }
};

export const onMessageListener = (): Promise<unknown> =>
  new Promise((resolve) => {
    if (!messaging || !isConfigured) return;
    onMessage(messaging, (payload) => {
      console.log('[AgriLync] FCM foreground message:', payload);
      resolve(payload);
    });
  });

export { messaging };
