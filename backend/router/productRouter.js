import express from 'express';
import { getAllProducts, createProduct } from '../controllers/productControllar.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getAllProducts);

export default productRouter;