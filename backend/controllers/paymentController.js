const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'PLACEHOLDER_STRIPE_SECRET_KEY');
const Order = require('../models/Order');

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in smallest currency unit (paise/cents)
      currency: 'inr',                  // Changed to INR for Indian e-commerce
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe webhook — auto-confirm payment and mark order as paid
// @route   POST /api/payments/webhook
// @access  Public (Stripe only, verified by signature)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // req.body must be the raw Buffer — configured in server.js for this route
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle relevant events
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Find order by payment intent metadata (orderId should be set when creating the intent)
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult = {
            id:          paymentIntent.id,
            status:      paymentIntent.status,
            update_time: new Date().toISOString(),
          };
          await order.save();
          console.log(`✅ Order ${orderId} marked as paid via Stripe webhook`);
        }
      } catch (err) {
        console.error('Error updating order from webhook:', err.message);
      }
    }
  }

  // Acknowledge receipt to Stripe
  res.json({ received: true });
};
