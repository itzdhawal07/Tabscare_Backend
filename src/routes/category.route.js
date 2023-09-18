const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");

router.post("/add", categoryController.addCategory);
router.get("/get-all", categoryController.getAllCategory);
router.get("/get-all-subcategory", categoryController.getAllSubcategory);
router.get("/get-all-sub-subcategory", categoryController.getAllSubSubCategory);
router.get("/:id", categoryController.getSingleCategory);
router.post("/create-subcategory", categoryController.addSubcategory);
router.get("/subcategory/:id", categoryController.getSingleSubcategory);
router.get("/get-category-wise-subcategory/:id",categoryController.getCategoryWiseSubCategory);
router.post("/create-sub-subcategory", categoryController.addSubSubcategory);
router.get("/get-subcategory-wise-subsubcategory/:id",categoryController.getSubCategoryWiseSubSubCategory);

module.exports = router;