const express = require("express");
const router = express.Router();
const searchController = require("../controller/search.controller");

router.post("/search-product", searchController.searchProduct);

module.exports = router;