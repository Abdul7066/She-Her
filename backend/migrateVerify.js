const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await User.updateMany(
    { role: { $in: ['admin', 'manager'] } },
    { $set: { isVerified: true } }
  );
  console.log(`✅ Marked ${result.modifiedCount} admin/manager accounts as verified`);
  process.exit();
}).catch(e => { console.error(e); process.exit(1); });
