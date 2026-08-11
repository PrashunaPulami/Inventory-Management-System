const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

// All product routes require authentication
router.use(authenticateToken);

router.get("/", getProducts);

router.get("/:id", getProductById);

// Create product with image upload
router.post(
    "/",
    upload.single("image"),
    createProduct
);

// Update product with optional image upload
router.put(
    "/:id",
    upload.single("image"),
    updateProduct
);

router.delete("/:id", deleteProduct);

module.exports = router;