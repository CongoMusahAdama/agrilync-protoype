# 🔌 AgriLync — Third-Party API Services Reference

A complete reference of every external API and service integrated into AgriLync, why it is used, which dashboard uses it, and exactly what you need to do to go live.

---

## ✅ Currently Active & Configured

### 1. 🗄️ MongoDB Atlas
| Field | Detail |
|:---|:---|
| **Used In** | All dashboards (backend database) |
| **Why** | Cloud-hosted NoSQL database — stores all Agents, Farmers, Blogs, Visits, Tasks, Matches, etc. |
| **Status** | ✅ Live & connected |
| **Go-Live Action** | Already connected to production cluster. Ensure IP whitelisting includes your production server. |
| **Env Variable** | `MONGODB_URI=mongodb+srv://...` |

---

### 2. 🖼️ Cloudinary
| Field | Detail |
|:---|:---|
| **Used In** | Agent Dashboard (farmer profile photos, KYC uploads), Blog Admin Dashboard (inline blog images) |
| **Why** | Handles image uploads, auto-compression, transformation, and CDN delivery. Farmer profile photos and blog media are stored here. |
| **Status** | ✅ Credentials configured (`dp9lv8q5e`) |
| **Go-Live Action** | Already live. Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are in `.env`. Verify upload preset settings in Cloudinary dashboard. |
| **Env Variables** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

---

### 3. 🌦️ Open-Meteo API
| Field | Detail |
|:---|:---|
| **Used In** | Agent Field Dashboard (weather widget) |
| **Why** | Real-time weather data for Ghana — shows temperature, precipitation, and weather code for the agent's GPS coordinates. |
| **Status** | ✅ Active — **no API key needed** (completely free) |
| **Go-Live Action** | Nothing required — it's a fully free, open API. Just ensure the agent's location coordinates are correctly resolved. |
| **API URL** | `https://api.open-meteo.com/v1/forecast` |

---

## ⚠️ Configured But Needs Real Key to Go Live

### 4. 📧 Resend (Email Service)
| Field | Detail |
|:---|:---|
| **Used In** | Blog Admin Dashboard (newsletter broadcast to subscribers), Agent notifications, Scheduled visit reminders |
| **Why** | Sends all system emails — blog newsletters, agent password resets, field visit notifications, and subscriber broadcasts. **This is the single email engine for the whole platform.** |
| **Status** | ⚠️ Library installed but placeholder key `re_your_resend_api_key` in `.env` |
| **Go-Live Action** | 1. Sign up at [resend.com](https://resend.com) → 2. Add & verify your domain `agrilync.com` → 3. Generate API key → 4. Set `RESEND_API_KEY=re_xxxxxxx` in `.env` → 5. Update `RESEND_FROM_EMAIL=AgriLync <notifications@agrilync.com>` |
| **Env Variables** | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |

---

### 5. 🗂️ AWS S3 (Amazon Simple Storage Service)
| Field | Detail |
|:---|:---|
| **Used In** | Backend file uploads (large documents, reports, backups) |
| **Why** | Secure, scalable storage for bulk files that are too large or sensitive for Cloudinary — such as audit reports, PDF exports, and backup archives. |
| **Status** | ⚠️ SDK integrated (`@aws-sdk/client-s3`) but placeholder credentials in `.env` |
| **Go-Live Action** | 1. Sign in to AWS Console → 2. Create S3 bucket named `agrilync-assets` in `us-east-1` → 3. Create IAM user with S3 full access → 4. Generate `Access Key ID` & `Secret Access Key` → 5. Update `.env` |
| **Env Variables** | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` |

---

### 6. 🔔 Firebase Cloud Messaging (FCM)
| Field | Detail |
|:---|:---|
| **Used In** | Agent Dashboard (push notifications in browser), DashboardLayout (notification listener) |
| **Why** | Enables real-time browser push notifications to agents — e.g., "New farmer assigned", "Scheduled visit reminder", "System alert". |
| **Status** | ⚠️ SDK installed but no credentials — currently **falling back to Resend email** as a substitute |
| **Go-Live Action** | 1. Go to [console.firebase.google.com](https://console.firebase.google.com) → 2. Create project "AgriLync" → 3. Add Web App → 4. Copy all config keys → 5. Add VAPID key from Cloud Messaging settings → 6. Add all values to frontend `.env` |
| **Env Variables (Frontend `.env`)** | `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_VAPID_KEY` |

---

## 📦 Installed But Not Yet Fully Active

### 7. 🧠 Supabase
| Field | Detail |
|:---|:---|
| **Used In** | Frontend integration (`/src/integrations/supabase/`) — scaffolded but not actively used in current workflows |
| **Why** | Originally scaffolded for extended real-time features. Currently superseded by the MongoDB + Express backend. |
| **Status** | 🟡 Client key present (`ffdgcvxwrwirbqvspncu.supabase.co`) but not actively called in production flows |
| **Go-Live Action** | No immediate action required. Only activate if real-time collaborative features (e.g. live dashboards) are planned. |

---

### 8. 🔴 Redis
| Field | Detail |
|:---|:---|
| **Used In** | Backend (`REDIS_URL` in `.env`) — for session caching and rate limiting |
| **Why** | Would handle fast in-memory caching for high-traffic operations (e.g. login throttling, session management). |
| **Status** | 🟡 URL configured (`redis://127.0.0.1:6379`) — local only |
| **Go-Live Action** | For production: provision a managed Redis instance (e.g. Redis Cloud, Railway, or AWS ElastiCache) and update `REDIS_URL` in `.env`. |

---

## 📋 Quick Go-Live Checklist

| Service | Action Needed | Priority |
|:---|:---|:---|
| MongoDB Atlas | Whitelist production server IP | 🔴 Critical |
| Cloudinary | Already live — verify upload limits | 🟢 Done |
| Open-Meteo | Nothing — free & keyless | 🟢 Done |
| Resend | Get real API key, verify `agrilync.com` domain | 🔴 Critical |
| AWS S3 | Create bucket + IAM user + keys | 🟡 Medium |
| Firebase FCM | Create project + add all VITE keys | 🟡 Medium |
| Supabase | Not urgent — review if real-time features needed | ⚪ Low |
| Redis | Provision cloud Redis for production | 🟡 Medium |

---

> **Note:** The `FRONTEND_URL` in `.env` is currently `http://localhost:5173`. Update to your production domain (e.g. `https://agrilync.com`) before deploying.
