const Redis = require('ioredis');

// Get Redis URL from environment or default to localhost
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redis = null;
let isRedisEnabled = false;

try {
    // Create Redis client with a short retry strategy to avoid hanging
    redis = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
            if (times > 3) {
                console.warn('⚠️ [REDIS] Max retries reached. Switching to in-memory fallback.');
                isRedisEnabled = false;
                return null; // Stop retrying
            }
            return 2000; // Retry after 2 seconds
        },
        connectTimeout: 5000,
    });

    redis.on('connect', () => {
        console.log('✅ [REDIS] Connected successfully');
        isRedisEnabled = true;
    });

    redis.on('error', (err) => {
        // Only log if it was previously enabled to avoid spam during startup failure
        if (isRedisEnabled) {
            console.error('❌ [REDIS] Connection error:', err.message);
        }
        isRedisEnabled = false;
    });

} catch (err) {
    console.error('❌ [REDIS] Initialization failed:', err.message);
}

/**
 * Proxy object to handle Redis operations with automatic fallback
 */
const redisProxy = {
    get: async (key) => {
        if (!isRedisEnabled || !redis) return null;
        try {
            return await redis.get(key);
        } catch (e) {
            return null;
        }
    },
    set: async (key, value, expirySeconds = 300) => {
        if (!isRedisEnabled || !redis) return null;
        try {
            return await redis.set(key, value, 'EX', expirySeconds);
        } catch (e) {
            return null;
        }
    },
    del: async (key) => {
        if (!isRedisEnabled || !redis) return null;
        try {
            return await redis.del(key);
        } catch (e) {
            return null;
        }
    },
    isEnabled: () => isRedisEnabled
};

module.exports = redisProxy;
