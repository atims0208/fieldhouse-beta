"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const ProductModel = models_1.Product;
const UserModel = models_1.User;
exports.default = {
    createProduct: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { title, description, price, images, category } = req.body;
            if (!title || !description || !price || !images || !Array.isArray(images)) {
                res.status(400).json({ message: 'Required fields: title, description, price, and images (array)' });
                return;
            }
            if (images.length > 5) {
                res.status(400).json({ message: 'Maximum 5 images allowed' });
                return;
            }
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
        }
        catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ message: 'Failed to create product' });
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;
            const category = req.query.category;
            const whereConditions = { isAvailable: true };
            if (category) {
                whereConditions.category = category;
            }
            const { count, rows: products } = await ProductModel.findAndCountAll({
                where: whereConditions,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                include: [{
                        model: models_1.User,
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
        }
        catch (error) {
            console.error('Get all products error:', error);
            res.status(500).json({ message: 'Failed to fetch products' });
        }
    },
    getProductById: async (req, res) => {
        try {
            const { productId } = req.params;
            const product = await ProductModel.findByPk(productId, {
                include: [{
                        model: models_1.User,
                        as: 'seller',
                        attributes: ['id', 'username', 'avatarUrl', 'bio']
                    }]
            });
            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        }
        catch (error) {
            console.error('Get product by ID error:', error);
            res.status(500).json({ message: 'Failed to fetch product' });
        }
    },
    updateProduct: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { productId } = req.params;
            const { title, description, price, images, isAvailable, category } = req.body;
            if (images && Array.isArray(images) && images.length > 5) {
                res.status(400).json({ message: 'Maximum 5 images allowed' });
                return;
            }
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
            if (title !== undefined)
                product.title = title;
            if (description !== undefined)
                product.description = description;
            if (price !== undefined)
                product.price = parseFloat(price);
            if (images !== undefined)
                product.images = images;
            if (isAvailable !== undefined)
                product.isAvailable = isAvailable;
            if (category !== undefined)
                product.category = category;
            await product.save();
            res.status(200).json({
                id: product.id,
                title: product.title,
                price: product.price,
                isAvailable: product.isAvailable,
                updatedAt: product.updatedAt
            });
        }
        catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ message: 'Failed to update product' });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const { productId } = req.params;
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
            await product.destroy();
            res.status(200).json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ message: 'Failed to delete product' });
        }
    },
    getProductsByUser: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await UserModel.findOne({
                where: { username }
            });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const products = await ProductModel.findAll({
                where: {
                    userId: user.id,
                    isAvailable: true
                },
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(products);
        }
        catch (error) {
            console.error('Get products by user error:', error);
            res.status(500).json({ message: 'Failed to fetch user products' });
        }
    },
    getMyProducts: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            const products = await ProductModel.findAll({
                where: {
                    userId: req.user.id
                },
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(products);
        }
        catch (error) {
            console.error('Get my products error:', error);
            res.status(500).json({ message: 'Failed to fetch your products' });
        }
    }
};
//# sourceMappingURL=productController.js.map