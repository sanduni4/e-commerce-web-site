import express from 'express';
import { 
    getAllProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productControllar.js';

const productRouter = express.Router();

// GET all products
productRouter.get('/', getAllProducts);

// GET single product by ID
productRouter.get('/:id', getProductById);

// POST create new product (admin only)
productRouter.post('/', createProduct);

// PUT update product (admin only)
productRouter.put('/:id', updateProduct);

// DELETE product (admin only)
productRouter.delete('/:id', deleteProduct);

export default productRouter;