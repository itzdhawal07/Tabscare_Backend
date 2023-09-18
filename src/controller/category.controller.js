const responseHelper = require("../helpers/responseHelper");
// const ContactusModel = require("../models/contactus.model");
const categoryValidation = require("../validations/category.validation");
const helper = require("../helpers/helper");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
	ACTIVE_STATUS,
} = require("../../config/key");
const { Category, Subcategory, SubSubcategory } = require('../models/index');

// Add New Contactus
exports.addCategory = async (req, res) => {
    try{
        // Check if the Category table exists and create it if not
        await Category.sync({ force: false });

        const reqParam = req.body;

        // Validate create category Request.
        let validationMessage = await categoryValidation.createCategoryValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if a category with the same title already exists
        const existingCategory = await Category.findOne({
            where: {
                title: reqParam.title,
            },
        });

        if(existingCategory) return responseHelper.error(res, res.__("Category with the same title already exists"), FAILURE);

        // Create a new user instance
        const newCategory = Category.build({
            title: reqParam.title,
            description: reqParam.desc,
            img: reqParam.img
        });

        // Save the user to the database
        await newCategory.save();
        let createdCategory = newCategory.toJSON();

        // Now you can access the id assigned by the database
        console.log('Saved Category:', createdCategory);

        // Success Response
        return responseHelper.successapi(res, res.__("categoryCreatedSuccessfully"), SUCCESS, createdCategory);
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getAllCategory = async (req, res) => {
    try{
        // Fetch all categories from the database
        const categories = await Category.findAll();

        // If categories are found, return them in the response
        if (categories && categories.length > 0) {
            return responseHelper.successapi(res, res.__("Categories fetched successfully"), SUCCESS, categories);
        }else {
            // If no categories are found, you can return an empty array or an appropriate message
            return responseHelper.successapi(res, res.__("No categories found"), SUCCESS, []);
        }
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getAllSubcategory = async (req, res) => {
    try{
        // Fetch all subcategories from the database
        const subcategories = await Subcategory.findAll();

        // If subcategories are found, return them in the response
        if (subcategories && subcategories.length > 0) {
            return responseHelper.successapi(res, res.__("Subcategories fetched successfully"), SUCCESS, subcategories);
        }else {
            // If no subcategories are found, you can return an empty array or an appropriate message
            return responseHelper.successapi(res, res.__("No subcategories found"), SUCCESS, []);
        }
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getSingleCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;

        // Validate get single category Request.
        let validationMessage = await categoryValidation.getSingleCategoryOrSubCategoryValidation({ id: categoryId });
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the category by its UUID
        const category = await Category.findOne({
            where: {
                uuid: categoryId
            },
        });

        // If the category is found, return it in the response
        if (category) {
            return responseHelper.successapi(res, res.__("Category retrieved successfully"), SUCCESS, category);
        } else {
            // If the category is not found, return an appropriate message
            return responseHelper.error(res, res.__("Category not found"), FAILURE);
        }
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.addSubcategory = async (req, res) => {
    try{
        // Check if the subcategory table exists and create it if not
        await Subcategory.sync({ force: false });

        const reqParam = req.body;

        // Validate create category Request.
        let validationMessage = await categoryValidation.createSubCategoryValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if a subcategory with the same title already exists
        const existingSubCategory = await Subcategory.findOne({
            where: {
                title: reqParam.title,
            },
        });

        if(existingSubCategory) return responseHelper.error(res, res.__("SubCategory with the same title already exists"), FAILURE);

        // Check if the user with the given phone number exists
        const category = await Category.findOne({
            where: {
                uuid: reqParam.categoryId,
            },
        });

        const categoryData = category.get({ plain: true });

        if (!category) return responseHelper.error(res, res.__("Category not found with the provided categoryId"), FAILURE);

        const newSubcategory = await Subcategory.create({
            categoryId: categoryData?.id,
            title: reqParam.title,
            description: reqParam.desc,
            img: reqParam.img,
        });

        console.log(newSubcategory,'newSubcategory');

        // Associate the subcategory with the category
        await category.addSubcategory(newSubcategory);

        // Success Response
        return responseHelper.successapi(res, res.__("subCategoryCreatedSuccessfully"), SUCCESS, newSubcategory);
    }catch(error){
        // Error Response
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getSingleSubcategory = async (req, res) => {
    try{
        const subcategoryId = req.params.id;
        // Validate get single subcategory Request.
        let validationMessage = await categoryValidation.getSingleCategoryOrSubCategoryValidation({ id: subcategoryId });
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the subcategory by its UUID
        const subcategory = await Subcategory.findOne({
            where: {
                uuid: subcategoryId
            },
        });

        // If the subcategory is found, return it in the response
        if (subcategory) {
            return responseHelper.successapi(res, res.__("Subcategory retrieved successfully"), SUCCESS, subcategory);
        } else {
            // If the subcategory is not found, return an appropriate message
            return responseHelper.error(res, res.__("Subcategory not found"), FAILURE);
        }
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getCategoryWiseSubCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;

        // Validate get category wise subcategory Request.
        let validationMessage = await categoryValidation.getCategoryWiseSubCategoryValidation({ id: categoryId });
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the subcategory by its UUID
        const category = await Category.findOne({
            where: {
                uuid: categoryId
            },
        });

        console.log(category);

        if(!category) return responseHelper.error(res, res.__("CategoryNotFound"), FAILURE);

        // Find the subcategory by its UUID
        const subcategory = await Subcategory.findAll({
            where: {
                categoryId: category.id
            },
        });


        // If the subcategory is found, return it in the response
        if (subcategory && subcategory.length > 0) {
            return responseHelper.successapi(res, res.__("Category wise subcategories retrieved successfully"), SUCCESS, subcategory);
        } else {
            // If the subcategory is not found, return an appropriate message
            return responseHelper.error(res, res.__("Subcategory not found"), FAILURE);
        }
    }catch(error){
        // Error Response
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.addSubSubcategory = async (req, res) => {
    try{
        // Check if the subcategory table exists and create it if not
        await Subcategory.sync({ force: false });
        await SubSubcategory.sync({ force: false });

        const reqParam = req.body;

        // Validate create category Request.
        let validationMessage = await categoryValidation.createSubSubcategoryValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Check if a subcategory with the same title already exists
        const existingSubSubcategory = await SubSubcategory.findOne({
            where: {
                title: reqParam.title,
            },
        });

        if(existingSubSubcategory) return responseHelper.error(res, res.__("SubSubCategory with the same title already exists"), FAILURE);

        const subCategory = await Subcategory.findOne({
            where: {
                uuid: reqParam.subCategoryId,
            },
            raw: true
        });

        if (!subCategory) return responseHelper.error(res, res.__("SubCategory not found with the provided subCategoryId"), FAILURE);

        const newSubSubcategory = await SubSubcategory.create({
            subCategoryId: subCategory?.id,
            title: reqParam.title,
            description: reqParam.desc,
            img: reqParam.img,
        });

        console.log(newSubSubcategory,'newSubSubcategory');

        // Success Response
        return responseHelper.successapi(res, res.__("SubSubCategoryCreatedSuccessfully"), SUCCESS, newSubSubcategory);
    }catch(error){
        // Error Response
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getSubCategoryWiseSubSubCategory = async (req, res) => {
    try{
        const subCategoryId = req.params.id;

        // Validate get category wise subcategory Request.
        let validationMessage = await categoryValidation.getSubCategoryWiseSubSubCategoryValidation({ id: subCategoryId });
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        // Find the subcategory by its UUID
        const subCategory = await Subcategory.findOne({
            where: {
                uuid: subCategoryId
            },
        });

        console.log(subCategory);

        if(!subCategory) return responseHelper.error(res, res.__("SubCategoryNotFound"), FAILURE);

        // Find the subcategory by its UUID
        const subSubCategory = await SubSubcategory.findAll({
            where: {
                subCategoryId: subCategory.id
            },
        });


        // If the subcategory is found, return it in the response
        if (subSubCategory && subSubCategory.length > 0) {
            return responseHelper.successapi(res, res.__("SubCategory wise SubSubCategories retrieved successfully"), SUCCESS, subSubCategory);
        } else {
            // If the subcategory is not found, return an appropriate message
            return responseHelper.error(res, res.__("SubSubcategoryNotFound"), FAILURE);
        }
    }catch(error){
        // Error Response
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}