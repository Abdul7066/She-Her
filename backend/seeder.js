const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products');

mongoose.connect('mongodb://127.0.0.1:27017/she_and_her');

const importData = async () => {
  try {
    await Product.deleteMany(); // Clear all current blanks
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
