const NodeCache = require('node-cache');
// Cache expires in 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

exports.apiCache = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache Hit for ${key}`);
    // Guard: if headers already sent, skip
    if (res.headersSent) return;
    return res.json(cachedResponse);
  }

  console.log(`Cache Miss for ${key}`);

  // ✅ Fix: guard against calling res.json multiple times
  const originalJson = res.json.bind(res);
  let sent = false;

  res.json = (body) => {
    if (sent) return; // prevent double-send
    sent = true;

    // Restore original before calling to avoid infinite recursion
    res.json = originalJson;

    // Only cache successful responses
    if (res.statusCode === 200) {
      cache.set(key, body);
    }
    return originalJson(body);
  };

  next();
};

// Allow explicit cache invalidation from controllers
exports.invalidateCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach(k => {
    if (k.includes(pattern)) cache.del(k);
  });
};
