const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");

router.post("/add", categoryController.addCategory);
router.get("/get-all", categoryController.getAllCategory);
router.get("/get-all-subcategory", categoryController.getAllSubcategory);
router.get("/:id", categoryController.getSingleCategory);
router.post("/subcategory/add", categoryController.addSubcategory);
router.get("/subcategory/:id", categoryController.getSingleSubcategory);

module.exports = router;