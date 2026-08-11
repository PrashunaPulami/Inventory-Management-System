const { Product, Supplier } = require("../models");

// GET all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Supplier,
                    attributes: ["id", "name", "email", "phone"]
                }
            ],
            order: [["name", "ASC"]]
        });

        res.status(200).json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to retrieve products."
        });
    }
};


// GET one product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Supplier,
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to retrieve product."
        });
    }
};


// CREATE product
const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            price,
            stockQuantity,
            supplierId
        } = req.body;


        // Validation
        if (
            !name ||
            !category ||
            price === undefined ||
            stockQuantity === undefined ||
            !supplierId
        ) {
            return res.status(400).json({
                message:
                    "Name, category, price, stock quantity and supplier are required."
            });
        }


        // Price validation
        if (Number(price) < 0) {
            return res.status(400).json({
                message: "Price cannot be negative."
            });
        }


        // Stock validation
        if (Number(stockQuantity) < 0) {
            return res.status(400).json({
                message: "Stock quantity cannot be negative."
            });
        }


        // Check supplier
        const supplier =
            await Supplier.findByPk(supplierId);

        if (!supplier) {
            return res.status(400).json({
                message: "Selected supplier does not exist."
            });
        }


        // Get uploaded image
        const image = req.file
            ? `/uploads/${req.file.filename}`
            : null;


        // Create product
        const product = await Product.create({
            name,
            description,
            category,
            price,
            stockQuantity,
            supplierId,
            image
        });


        res.status(201).json({
            message: "Product created successfully.",
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to create product."
        });
    }
};


// UPDATE product
const updateProduct = async (req, res) => {
    try {

        const product =
            await Product.findByPk(req.params.id);


        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }


        const {
            name,
            description,
            category,
            price,
            stockQuantity,
            supplierId
        } = req.body;


        // Validation
        if (
            !name ||
            !category ||
            price === undefined ||
            stockQuantity === undefined ||
            !supplierId
        ) {
            return res.status(400).json({
                message:
                    "Name, category, price, stock quantity and supplier are required."
            });
        }


        // Price validation
        if (Number(price) < 0) {
            return res.status(400).json({
                message: "Price cannot be negative."
            });
        }


        // Stock validation
        if (Number(stockQuantity) < 0) {
            return res.status(400).json({
                message: "Stock quantity cannot be negative."
            });
        }


        // Check supplier
        const supplier =
            await Supplier.findByPk(supplierId);

        if (!supplier) {
            return res.status(400).json({
                message: "Selected supplier does not exist."
            });
        }


        // Keep existing image unless a new image is uploaded
        let image = product.image;

        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }


        // Update product
        await product.update({
            name,
            description,
            category,
            price,
            stockQuantity,
            supplierId,
            image
        });


        res.status(200).json({
            message: "Product updated successfully.",
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to update product."
        });
    }
};


// DELETE product
const deleteProduct = async (req, res) => {
    try {

        const product =
            await Product.findByPk(req.params.id);


        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }


        await product.destroy();


        res.status(200).json({
            message: "Product deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete product."
        });
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};