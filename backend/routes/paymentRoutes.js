const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create payment intent
router.post('/create-payment-intent', protect, createPaymentIntent);

// ✅ Stripe Webhook (Public, signature verified in controller)
// NOTE: req.body MUST be raw Buffer for signature verification.
// This is handled in server.js via express.raw() for this specific path.
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
