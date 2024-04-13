import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message: "Name is required."})
        }        
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        }
        const category = await new categoryModel({name, slug: slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "New category created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}

export const updateCategoryController = async(req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name, slug: slugify(name)},
            {new: true},
        )
        res.status(200).send({
            success: true,
            message: "Category updated successfully.",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Update was not completed.",
        })
    }
}

export const categoryController = async(req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories list",
            categories,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: "Error while getting all categories"
        })
    }
}

export const singleCategoryController = async(req, res) => {
    try {
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug})
        res.status(200).send({
            success: true,
            message: "Get Single Category Successfully.",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Couldn't get the category"
        })
    }
}

export const deleteCategoryController = async(req, res) => {
    try {
        const {_id} = req.params;
        await categoryModel.findByIdAndDelete({_id});
        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to delete",
            error,
        })
    }
}