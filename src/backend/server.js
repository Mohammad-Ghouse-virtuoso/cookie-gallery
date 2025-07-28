// server.js

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto'); // Node.js built-in module for cryptographic functions
require('dotenv').config(); // Load environment variables from .env file

const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());
// Enable CORS for all origins (for development; configure specific origins for production)
app.use(cors());

const PORT = process.env.PORT || 5000;

// Initialize Razorpay instance with keys from environment variables
// IMPORTANT: Ensure .env file has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- ROUTES ---

// 1. Root Route: To confirm the backend is running (avoids 404)
app.get('/', (req, res) => {
  res.status(200).send('Cookie Gallery Backend API is alive and kicking! Ready for payment processing.');
});

// 2. Endpoint to Create Razorpay Order (Called by Frontend)
// @route   POST /create-order
// @desc    Creates a new Razorpay order for payment initiation
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body; // amount is expected in Rupees from frontend, backend converts to paise

  if (!amount || !currency) {
    return res.status(400).json({ message: 'Amount and currency are required.' });
  }

  try {
    const options = {
      amount: amount * 100, // Convert amount to smallest currency unit (paise for INR)
      currency: currency,
      receipt: `receipt_order_${Date.now()}`, // Unique receipt ID for your reference
      payment_capture: 1 // 1 for auto-capture (recommended), 0 for manual capture
    };
    
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: 'Error creating order with Razorpay.' });
    }
    res.status(200).json(order); // Send the Razorpay order object back to the frontend
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: "Failed to create Razorpay order.", error: error.message });
  }
});

// 3. Endpoint to Verify Payment Signature (Called by Frontend after payment success)
// @route   POST /verify-signature
// @desc    Verifies the payment signature received from Razorpay handler on frontend
app.post('/verify-signature', (req, res) => {
  const { order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // IMPORTANT: This secret is your Razorpay Key Secret, NOT the webhook secret.
  // It's used to generate the signature for verification.
  const secret = process.env.RAZORPAY_KEY_SECRET; 

  if (!order_id || !razorpay_payment_id || !razorpay_signature || !secret) {
      return res.status(400).json({ success: false, message: "Missing required verification data." });
  }

  // Generate the expected signature on your backend
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(order_id + "|" + razorpay_payment_id)
    .digest('hex');

  // Compare the generated signature with the one received from the frontend
  if (generated_signature === razorpay_signature) {
    console.log('Payment signature verified successfully (Frontend to Backend)!');
    // You would typically update your database here to mark the order as verified
    // (e.g., updateOrderStatus(order_id, 'verified_by_frontend'));
    res.status(200).json({ success: true, message: "Payment has been verified" });
  } else {
    console.error('Payment signature verification failed (Frontend to Backend)!');
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

// 4. Endpoint to Handle Razorpay Webhooks (Called by Razorpay - Re-introducing this)
// @route   POST /api/razorpay-webhook
// @desc    Receives asynchronous notifications from Razorpay about payment events
// IMPORTANT: This path must match the URL you configure in the Razorpay Dashboard (via ngrok for local dev)
    app.post('/api/razorpay-webhook', (req, res) => {
  // Get the webhook secret from your environment variables
  // IMPORTANT: This is a DIFFERENT secret from your API key secret.
  // You get this from Razorpay Dashboard -> Settings -> Webhooks.
  const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET; 

  if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set in environment variables!');
      return res.status(500).send('Webhook secret not configured.');
  }

  // Verify the webhook signature (CRITICAL for security)
  // Use the raw body for signature verification
  const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET; 

  if (!WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set in environment variables!');
      return res.status(500).send('Webhook secret not configured.');
  }

  // Verify the webhook signature (CRITICAL for security)
  // Use the raw body for signature verification
  const shasum = crypto.createHmac('sha256', WEBHOOK_SECRET);
  shasum.update(JSON.stringify(req.body)); // Ensure req.body is the raw JSON payload
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('Webhook signature verified successfully (Razorpay to Backend)!');
    // Process the webhook payload
    const event = req.body.event;
    const payment = req.body.payload.payment.entity; // Access payment details

    if (event === 'payment.captured') {
      console.log('Payment Captured Event (from Webhook):', payment.id, payment.order_id, payment.amount);
      // **This is the most reliable place to update your database:**
      // Mark order as paid, store payment_id, update inventory, send confirmation email, etc.
      // Example: updateOrderInDb(payment.order_id, payment.id, 'paid');
    } else if (event === 'payment.failed') {
      console.log('Payment Failed Event (from Webhook):', payment.id, payment.order_id);
      // Update your database: Mark order as failed
    }
    // Handle other events like 'refund.processed', 'order.paid' etc. as needed

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
