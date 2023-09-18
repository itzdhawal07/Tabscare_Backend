const responseHelper = require("../helpers/responseHelper");
const productValidation = require("../validations/product.validation");
const {
	SERVERERROR,
	SUCCESS,
	FAILURE,
	ACTIVE_STATUS,
} = require("../../config/key");
const { Product, Category, Subcategory, User, ProductImage, SubSubcategory, Manufacturer } = require('../models/index');
const { v4: uuidv4 } = require('uuid');

exports.createProduct = async (req, res) => {
    try {
        const reqParam = req.body;

        // Sync the Product table to ensure it exists
        await Product.sync({ force: false });
        await ProductImage.sync({ force: false });

        // Validate create product Request.
        let validationMessage = await productValidation.createProductValidation(reqParam);
        if (validationMessage) return responseHelper.error(res, res.__(validationMessage), FAILURE);

        const productList = reqParam.products;
        console.log(productList, 'productList');

        // Array to store the responses for each product
        const addedProducts = [];

        for (const productData of productList) {
            const categoryId = productData.categoryId;
            const subCategoryId = productData.subCategoryId;
            const subSubCategoryId = productData.subSubCategoryId; // Optional
            const manufacturerId = productData.manufacturerId; // Mandatory

            // Find the Category and Subcategory by their UUIDs
            const category = await Category.findOne({
                where: {
                    uuid: categoryId,
                },
                raw: true
            });

            if (!category) return responseHelper.error(res, res.__("Category not found"), FAILURE);

            const subcategory = await Subcategory.findOne({
                where: {
                    uuid: subCategoryId,
                    categoryId: category.id
                },
                raw: true
            });

            if(!subcategory) return responseHelper.error(res, res.__("Subcategory not found"), FAILURE);

            // Check if subSubCategoryId is provided and valid
            let subSubcategory;
            if (subSubCategoryId) {
                subSubcategory = await SubSubcategory.findOne({
                    where: {
                        uuid: subSubCategoryId,
                        subCategoryId: subcategory.id
                    },
                    raw: true
                });

                if (!subSubcategory) {
                    // If subSubCategoryId is provided but not found, return an appropriate message
                    return responseHelper.error(res, res.__("SubSubcategory not found"), FAILURE);
                }
            }

            // Check if manufacturerId is provided and valid
            const manufacturer = await Manufacturer.findOne({
                where: {
                    uuid: manufacturerId
                },
                raw: true
            });

            if (!manufacturer) {
                // If manufacturerId is provided but not found, return an appropriate message
                return responseHelper.error(res, res.__("Manufacturer not found"), FAILURE);
            }

            const productUUID = uuidv4();

            // Create the product
            const product = await Product.create({
                uuid: productUUID,
                sku_code: productData.sku_code,
                name: productData.name,
                schedule: productData.schedule,
                categoryId: category.id,
                subCategoryId: subcategory.id,
                subSubCategoryId: subSubcategory ? subSubcategory.id : null,
                manufacturerId: manufacturer.id,
                salt_composition: productData.salt_composition,
                medicine_type: productData.medicine_type,
                stock: productData.stock,
                introduction: productData.introduction,
                ingredients: productData.ingredients,
                benefits: productData.benefits,
                description: productData.description,
                how_to_use: productData.how_to_use,
                safety_advice: productData.safety_advice,
                if_miss: productData.if_miss,
                packaging: productData.packaging,
                mrp: productData.mrp,
                discount: productData.discount,
                gst: productData.gst,
                price: productData.price,
                prescription_required: productData.prescription_required,
                label: productData.label,
                fact_box: productData.fact_box,
                primary_use: productData.primary_use,
                salt_synonyms: productData.salt_synonyms,
                storage: productData.storage,
                use_of: productData.use_of,
                common_side_effect: productData.common_side_effect,
                alcohol_interaction: productData.alcohol_interaction,
                pregnancy_interaction: productData.pregnancy_interaction,
                lactatin_interaction: productData.lactatin_interaction,
                driving_interaction: productData.driving_interaction,
                kidney_interaction: productData.kidney_interaction,
                liver_interaction: productData.liver_interaction,
                otherDrugs_interaction: productData.otherDrugs_interaction,
                country_of_origin: productData.country_of_origin,
                isActive: productData.isActive
            });

            if (product) {
                addedProducts.push(product); // Add the product to the list of added products

                // Create product images
                const productImages = productData.images.map((image) => {
                    return {
                        productId: product.id,
                        image_url: image, // Assuming image contains the URL or filename
                    };
                });

                // Bulk insert product images
                await ProductImage.bulkCreate(productImages);
            } else {
                // If product creation failed, return an appropriate message
                return responseHelper.error(res, res.__("Product creation failed"), FAILURE);
            }
        }

        // If all products were successfully created
        return responseHelper.successapi(res, res.__("Products created successfully"), SUCCESS, addedProducts);
    } catch (error) {
        // Error Response
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.findAll();

        // Check if any products were found
        if (products.length > 0) {
            return responseHelper.successapi(res, "Products retrieved successfully", SUCCESS, products);
        } else {
            // If no products were found, return an appropriate message
            return responseHelper.error(res, "No products found", FAILURE);
        }
    } catch (error) {
        console.log(error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the product by its UUID
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        if (!product) return responseHelper.error(res, res.__("Product not found"), FAILURE);

        let user = req.user;

        if(user) {
            const userId = user.id;

            // Find the user's wishlist and cart
            const userDetails = await User.findOne({
                where: {
                    uuid: userId,
                },
                include: [
                    {
                        model: Product,
                        as: 'wishlist',
                        attributes: ['uuid'],
                    },
                    {
                        model: Cart, // Assuming you have a Cart model defined
                        attributes: ['uuid', 'productId'],
                    },
                ],
            });

            let isWishlistProduct = false;
            let isCartProduct = false;

            // Check if the product is in the user's wishlist
            if (userDetails.wishlist.some((wishlistItem) => wishlistItem.uuid === productId)) {
                isWishlistProduct = true;
            }

            // Check if the product is in the user's cart
            if (userDetails.cart.some((cartItem) => cartItem.productId === productId)) {
                isCartProduct = true;
            }

            const productDetails = {
                "product": product,
                "isWishlistProduct": isWishlistProduct,
                "isCartProduct": isCartProduct,
            };

            return responseHelper.successapi(res, "Product retrieved successfully", SUCCESS, productDetails);
        } else {
            // If the user is not authenticated, return product details without cart and wishlist information
            const productDetails = {
                "product": product,
                "isWishlistProduct": false,
                "isCartProduct": false,
            };

            return responseHelper.successapi(res, "Product retrieved successfully", SUCCESS, productDetails);
        }
    } catch (error) {
        console.log('error', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
};

exports.deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id;

        // Find the product by its UUID
        const product = await Product.findOne({
            where: {
                uuid: productId,
            },
        });

        if (!product) return responseHelper.error(res, "Product not found", FAILURE);

        await product.destroy();
       
        return responseHelper.successapi(res, "Product deleted successfully", SUCCESS, []);
    }catch(error){
        console.log('error getting transactions ', error);
        return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
    }
}