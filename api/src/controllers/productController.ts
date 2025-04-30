import { Request, Response } from 'express';
import { Product, User } from '../models';

// Type assertions for models
const ProductModel = Product as any;
const UserModel = User as any;

export default {
  // Create a new product
  createProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { title, description, price, images, category } = req.body;
      
      // Validation
      if (!title || !description || !price || !images || !Array.isArray(images)) {
        res.status(400).json({ message: 'Required fields: title, description, price, and images (array)' });
        return;
      }
      
      // Validate image count
      if (images.length > 5) {
        res.status(400).json({ message: 'Maximum 5 images allowed' });
        return;
      }
      
      // Create product
      const product = await ProductModel.create({
        userId: req.user.id,
        title,
        description,
        price: parseFloat(price),
        images,
        category: category || null,
        isAvailable: true
      });
      
      res.status(201).json({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
        createdAt: product.createdAt
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  },
  
  // Get all products (with pagination)
  getAllProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      const category = req.query.category as string;
      
      // Build filter conditions
      const whereConditions: any = { isAvailable: true };
      if (category) {
        whereConditions.category = category;
      }
      
      // Get products with pagination
      const { count, rows: products } = await ProductModel.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'avatarUrl']
        }]
      });
      
      res.status(200).json({
        products,
        totalProducts: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  },
  
  // Get a single product by ID
  getProductById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      
      const product = await ProductModel.findByPk(productId, {
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'avatarUrl', 'bio']
        }]
      });
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Get product by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  },
  
  // Update a product
  updateProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { productId } = req.params;
      const { title, description, price, images, isAvailable, category } = req.body;
      
      // Validate image count if provided
      if (images && Array.isArray(images) && images.length > 5) {
        res.status(400).json({ message: 'Maximum 5 images allowed' });
        return;
      }
      
      // Find the product
      const product = await ProductModel.findOne({
        where: {
          id: productId,
          userId: req.user.id
        }
      });
      
      if (!product) {
        res.status(404).json({ message: 'Product not found or unauthorized' });
        return;
      }
      
      // Update product fields
      if (title !== undefined) product.title = title;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = parseFloat(price);
      if (images !== undefined) product.images = images;
      if (isAvailable !== undefined) product.isAvailable = isAvailable;
      if (category !== undefined) product.category = category;
      
      await product.save();
      
      res.status(200).json({
        id: product.id,
        title: product.title,
        price: product.price,
        isAvailable: product.isAvailable,
        updatedAt: product.updatedAt
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Failed to update product' });
    }
  },
  
  // Delete a product
  deleteProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const { productId } = req.params;
      
      // Find the product
      const product = await ProductModel.findOne({
        where: {
          id: productId,
          userId: req.user.id
        }
      });
      
      if (!product) {
        res.status(404).json({ message: 'Product not found or unauthorized' });
        return;
      }
      
      // Delete the product
      await product.destroy();
      
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  },
  
  // Get products by user
  getProductsByUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      
      // Find user
      const user = await UserModel.findOne({
        where: { username }
      });
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Get user's products
      const products = await ProductModel.findAll({
        where: {
          userId: user.id,
          isAvailable: true
        },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'avatarUrl']
        }]
      });
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Get products by user error:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  },
  
  // Get my products (for authenticated user)
  getMyProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const products = await ProductModel.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'avatarUrl']
        }]
      });
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Get my products error:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  }
}; 