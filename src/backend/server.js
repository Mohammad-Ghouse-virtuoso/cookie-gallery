// server.js

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Firebase Admin SDK (optional)

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// --- Initialize Firebase Admin SDK (optional) ---
// Attempts to require firebase-admin and a local service account JSON; if unavailable, Firestore routes are disabled.
let admin;
let db = null;
try {
  admin = require('firebase-admin');
  const serviceAccount = require('./cookie-gallery-firebase-adminsdk.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  db = admin.firestore();
  console.log('Firebase Admin initialized: Firestore enabled.');
} catch (e) {
  console.warn('Firebase Admin not initialized. Firestore routes disabled:', e.message);
}

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

// --- ROUTES ---

app.get('/test-db', async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
  }
  try {
    const testDocRef = db.collection('test_collection').doc('test_doc');
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
app.post('/save-user', async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
  }
  try {
    const { uid, email, displayName, phoneNumber } = req.body || {};
    if (!email || !uid) {
      return res.status(400).json({ success: false, message: 'Missing uid or email.' });
    }
    const emailKey = String(email).toLowerCase();
    const userRef = db.collection('users').doc(emailKey);
    await userRef.set({
      uid,
      email: emailKey,
      displayName: displayName || null,
      phoneNumber: phoneNumber || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
app.post('/save-order-data', async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, message: 'Firestore not configured on server.' });
  }
  const { userId, orderId, items, paymentStatus } = req.body;

  if (!userId || !orderId || !items || !paymentStatus) {
    return res.status(400).json({ message: 'Missing required order data.' });
  }

  try {
    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.set({
      userId,
      items,
      paymentStatus,
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