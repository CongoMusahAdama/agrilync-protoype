const admin = require('firebase-admin');

// Service account would normally be loaded from an environment variable or a secure JSON file
// For the prototype, we assume the configuration is injected or uses placeholders
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? 
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : 
    null;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
} else {
    console.warn('Firebase Service Account not found. Push notifications will be disabled.');
}

const sendPushNotification = async (token, payload) => {
    if (!admin.apps.length || !token) return;

    try {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            token: token
        };

        const response = await admin.messaging().send(message);
        console.log('Push notification sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
};

module.exports = {
    admin,
    sendPushNotification
};
