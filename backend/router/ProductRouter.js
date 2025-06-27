import express from 'express';
import { createProduct, getProducts , deleteProduct ,getProductByName} from '../controllers/ProductController.js';

const ProductRouter = express.Router();

ProductRouter.post('/create', createProduct);
ProductRouter.get('/get', getProducts);
ProductRouter.get('/getbyName', getProductByName);
ProductRouter.delete('/delete/:id', deleteProduct);

export default ProductRouter;