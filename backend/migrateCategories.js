const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 1. Update 'Bridal' to 'Bridal Dresses'
    const res1 = await Product.updateMany(
      { category: 'Bridal' },
      { $set: { category: 'Bridal Dresses' } }
    );
    console.log(`Updated ${res1.modifiedCount} products from 'Bridal' to 'Bridal Dresses'`);

    // 2. Update 'ladies-wear' to 'Bridal Dresses'
    const res2 = await Product.updateMany(
      { category: 'ladies-wear' },
      { $set: { category: 'Bridal Dresses' } }
    );
    console.log(`Updated ${res2.modifiedCount} products from 'ladies-wear' to 'Bridal Dresses'`);

    // 3. Update 'Hand Bag' to 'Hand Bags' (if found)
    const res3 = await Product.updateMany(
      { category: { $in: ['Hand Bag', 'Handbag', 'bags'] } },
      { $set: { category: 'Hand Bags' } }
    );
    console.log(`Updated ${res3.modifiedCount} products to 'Hand Bags'`);

    console.log('Migration complete!');
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateCategories();
