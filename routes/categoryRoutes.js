import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//routes
//create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

//update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);
export default router;

// get categories
router.get("/categories", categoryController);

// get single category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete("/delete-category/:_id", requireSignIn, isAdmin, deleteCategoryController);