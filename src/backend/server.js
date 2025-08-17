
// server.js

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const admin = require('firebase-admin');

// Load env (supports multiline private key with \n)
// 1) Root .env
require('dotenv').config();
// 2) Backend-local .env (src/backend/.env) as fallback without overriding existing vars
require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: false });

const app = express();
app.use(express.json());
// Optionally restrict CORS to a specific origin via env; defaults to '*'
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.CORS_ORIGIN,
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;
// Server boot ID to detect restarts from the client
const SERVER_BOOT_ID = (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Optional API key protection (not used when ID token is required)
// const API_SHARED_SECRET = process.env.API_SHARED_SECRET;
// const requireApiKey = (req, res, next) => {
//   if (!API_SHARED_SECRET) return next();
//   const key = req.headers['x-api-key'];
//   if (key && key === API_SHARED_SECRET) return next();
//   return res.status(403).json({ success: false, message: 'Forbidden: invalid API key' });
// };

// --- Initialize Firebase Admin for ID token verification and server-side Firestore ---
let adminDb = null;
(() => {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (projectId && clientEmail && privateKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        });
      }
      adminDb = admin.firestore();
      console.log('Firebase Admin initialized for Auth and Firestore.');
    } else {
      console.warn('Firebase Admin not initialized: missing FIREBASE_* env. ID token verification and Firestore writes will fail.');
    }
  } catch (e) {
    console.warn('Firebase Admin initialization failed:', e.message);
  }
})();

// Auth middleware: verify Firebase ID token from Authorization: Bearer <token>
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const decoded = await admin.auth().verifyIdToken(parts[1]);
      req.user = { uid: decoded.uid, email: decoded.email || null };
      return next();
    }
    return res.status(401).json({ success: false, message: 'Unauthorized: missing or invalid Authorization header' });
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid ID token', error: e.message });
  }
};

// Initialize Razorpay instance (optional)
let razorpay = null;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized: Payments enabled.');
  } catch (e) {
    console.warn('Failed to initialize Razorpay, payments disabled:', e.message);
  }
} else {
  console.warn('Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET. /create-order will be disabled.');
}
// Health endpoint exposes a non-sensitive boot id so client can detect backend restarts
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, boot_id: SERVER_BOOT_ID });
});


// --- ROUTES ---

app.get('/test-db', async (req, res) => {
  try {
    console.log('[diag] admin.apps.length =', admin.apps.length, 'adminDb set =', !!adminDb);
    if (!adminDb) {
      return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
    }
    const testDocRef = adminDb.collection('test_collection').doc('test_doc');
    await testDocRef.set({
      message: 'Test data saved successfully!',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Successfully wrote to Firestore from /test-db route.');
    res.status(200).json({ success: true, message: 'Test data saved to Firestore.' });
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    res.status(500).json({ success: false, message: 'Failed to write test data to Firestore.' });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Cookie Gallery Backend API is alive and kicking! Ready for payment processing.');
});

app.post('/create-order', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payments not configured on server.' });
  }
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ message: 'Amount and currency are required.' });
  }
  try {
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: 'Error creating order with Razorpay.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: "Failed to create Razorpay order.", error: error.message });
  }
});

// Endpoint to save user profile via Admin SDK
app.post('/save-user', requireAuth, async (req, res) => {
  if (!adminDb) {
    return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
  }
  try {
    if (!req.user || !req.user.email) {
      return res.status(400).json({ success: false, message: 'Authenticated email not available on token.' });
    }
    const emailKey = String(req.user.email).toLowerCase();
    const { displayName, phoneNumber } = req.body || {};
    const userRef = adminDb.collection('users').doc(emailKey);
    await userRef.set({
      uid: emailKey,              // Store Gmail as UID per requirement
      authUid: req.user.uid || null, // Preserve actual Firebase UID separately
      email: emailKey,
      displayName: displayName || null,
      phoneNumber: phoneNumber || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log('Saved user profile for', emailKey);
    res.status(200).json({ success: true, message: 'User saved.' });
  } catch (err) {
    console.error('Error saving user profile:', err);
    res.status(500).json({ success: false, message: 'Failed to save user.' });
  }
});

// New Endpoint to save payment data to Firestore
// @route   POST /save-order-data
// @desc    Saves user and payment data to Firestore
app.post('/save-order-data', requireAuth, async (req, res) => {
  if (!adminDb) {
    return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
  }
  const { orderId, items, paymentStatus, paymentAmount, paymentCurrency } = req.body;

  if (!orderId || !items || !paymentStatus) {
    return res.status(400).json({ message: 'Missing required order data.' });
  }

  if (!req.user || !req.user.email) {
    return res.status(400).json({ message: 'Authenticated email not available on token.' });
  }
  const userId = String(req.user.email).toLowerCase();

  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    await orderRef.set({
      userId,
      items,
      paymentStatus,
      payment_amount: typeof paymentAmount === 'number' ? paymentAmount : null,
      payment_currency: paymentCurrency || 'INR',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ success: true, message: 'Order data saved successfully.' });
  } catch (error) {
    console.error('Error saving order data:', error);
    res.status(500).json({ success: false, message: 'Failed to save order data.' });
  }
});

app.post('/verify-signature', (req, res) => {
  const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!order_id || !razorpay_payment_id || !razorpay_signature || !secret) {
      return res.status(400).json({ success: false, message: "Missing required verification data." });
  }
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    console.log('Payment signature verified successfully (Frontend to Backend)!');
    res.status(200).json({ success: true, message: "Payment has been verified" });
  } else {
    console.error('Payment signature verification failed (Frontend to Backend)!');
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

// IMPORTANT: This path must match the URL you configure in the Razorpay Dashboard (via ngrok for local dev)
app.post('/api/razorpay-webhook', (req, res) => {
  const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set in environment variables!');
      return res.status(500).send('Webhook secret not configured.');
  }
  const shasum = crypto.createHmac('sha256', WEBHOOK_SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('Webhook signature verified successfully (Razorpay to Backend)!');
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    if (event === 'payment.captured') {
      console.log('Payment Captured Event (from Webhook):', payment.id, payment.order_id, payment.amount);
      // **This is the most reliable place to update your database:**
      // Mark order as paid, store payment_id, update inventory, send confirmation email, etc.
      // Example: updateOrderInDb(payment.order_id, payment.id, 'paid');
    } else if (event === 'payment.failed') {
      console.log('Payment Failed Event (from Webhook):', payment.id, payment.order_id);
    }
    res.status(200).send('Webhook received and processed.');
  } else {
    console.error('Webhook signature verification failed (Razorpay to Backend)!');
    res.status(403).send('Invalid signature');
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
