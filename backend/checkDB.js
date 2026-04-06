const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await Product.find({});
    console.log('--- Current Products ---');
    products.forEach(p => {
      console.log(`Name: ${p.name} | Category: ${p.category}`);
    });
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkCategories();
