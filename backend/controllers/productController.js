const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const { invalidateCache } = require('../middleware/cacheMiddleware');

// Helper: build the public URL path for an uploaded file
const fileUrl = (file) => `/uploads/${file.filename}`;

// Helper: delete old upload file from disk
const deleteFile = (filePath) => {
  if (!filePath || filePath.startsWith('http')) return; // skip external URLs
  const abs = path.join(__dirname, '..', filePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

// @desc    Get all products / Search products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product (with image upload)
// @route   POST /api/products
// @access  Private (Admin / Manager)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, inStock } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }

    const imageUrl = fileUrl(req.files.image[0]);
    const hoverImageUrl = req.files?.hoverImage ? fileUrl(req.files.hoverImage[0]) : '';

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      imageUrl,
      hoverImageUrl,
      category: category || 'ladies-wear',
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      inStock: inStock === 'true' || inStock === true,
    });

    const savedProduct = await newProduct.save();
    invalidateCache(); // Clear GET products cache
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (image upload optional)
// @route   PUT /api/products/:id
// @access  Private (Admin / Manager)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, description, price, category, sizes, colors, inStock } = req.body;

    // Handle image replacement
    let imageUrl = product.imageUrl;
    if (req.files?.image) {
      deleteFile(product.imageUrl);
      imageUrl = fileUrl(req.files.image[0]);
    }

    let hoverImageUrl = product.hoverImageUrl;
    if (req.files?.hoverImage) {
      deleteFile(product.hoverImageUrl);
      hoverImageUrl = fileUrl(req.files.hoverImage[0]);
    }

    const updates = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(category && { category }),
      ...(sizes && { sizes: JSON.parse(sizes) }),
      ...(colors && { colors: JSON.parse(colors) }),
      inStock: inStock === 'true' || inStock === true,
      imageUrl,
      hoverImageUrl,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    invalidateCache(); // Clear GET products cache
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Clean up uploaded images from disk
    deleteFile(product.imageUrl);
    deleteFile(product.hoverImageUrl);

    await product.deleteOne();
    invalidateCache(); // Clear GET products cache
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'Item already reviewed' });

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
