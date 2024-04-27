import fs from "fs";
import slugify from "slugify";
import productModel from "../models/productModel.js";

export const createProductController = async (req, res) => {
    console.log("inside createproductcontroller");
    try {
        console.log(req.fields);
        const { title, slug, description, price, quantity, category, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !title:
                return res.status(500).send({ error: "Title is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "photo is required and shouldn't more than 1mb." });
        }

        const product = new productModel({ ...req.fields, slug: slugify(title) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(200).send({
            success: true,
            message: "Product created successfully.",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Product couldn't be created.",
        })
    }
}

export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createAt: -1 });
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "All products",
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Failed to get all products",
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: "Sigle product fetched successfully.",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error
        })
    }
}

export const productPhotoController = async(req, res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product photo",
            error,
        })
    }
}

export const deleteProductController = async(req, res) =>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully."
        })
    } catch (error) {
        console.log(error);
        req.status(500).send({
            success: false,
            message: "Error while deleting product.",
            error,
        })
    }
}

export const updateProductController = async(req, res) =>{
    try {
        const { title, slug, description, price, quantity, category, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !title:
                return res.status(500).send({ error: "Title is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "photo is required and shouldn't more than 1mb." });
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(title)}, {new: true})
        await product.save();
        res.status(200).send({
            success: true,
            message: "Product updated successfully.",
            product,
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to update product.",
            error,
        })
    }
}