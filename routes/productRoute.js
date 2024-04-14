import express from "express";
import { createProductController, deleteProductController, getAllProductsController, getSingleProductController, productPhotoController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();
// routes
// create product
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);

// get products
router.get("/all-products", requireSignIn, getAllProductsController);

// get single product
router.get("/single-product/:slug", requireSignIn, getSingleProductController);

// get photo
router.get("/product-photo/:pid", requireSignIn, productPhotoController);

// delete product
router.delete("/product-delete/:pid", deleteProductController);

// update product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);
export default router;