const { Supplier, Product } = require("../models");

// GET all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            include: [
                {
                    model: Product,
                    attributes: ["id", "name", "stockQuantity"]
                }
            ],
            order: [["name", "ASC"]]
        });

        res.status(200).json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to retrieve suppliers."
        });
    }
};

// GET one supplier
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id, {
            include: [
                {
                    model: Product,
                    attributes: ["id", "name", "stockQuantity"]
                }
            ]
        });

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found."
            });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to retrieve supplier."
        });
    }
};

// CREATE supplier
const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Server-side validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                message: "Name, email and phone are required."
            });
        }

        const supplier = await Supplier.create({
            name,
            email,
            phone,
            address
        });

        res.status(201).json({
            message: "Supplier created successfully.",
            supplier
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to create supplier."
        });
    }
};

// UPDATE supplier
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found."
            });
        }

        const { name, email, phone, address } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                message: "Name, email and phone are required."
            });
        }

        await supplier.update({
            name,
            email,
            phone,
            address
        });

        res.status(200).json({
            message: "Supplier updated successfully.",
            supplier
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to update supplier."
        });
    }
};

// DELETE supplier
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found."
            });
        }

        const productCount = await Product.count({
            where: {
                supplierId: supplier.id
            }
        });

        if (productCount > 0) {
            return res.status(400).json({
                message: "Cannot delete supplier because products are linked to this supplier."
            });
        }

        await supplier.destroy();

        res.status(200).json({
            message: "Supplier deleted successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to delete supplier."
        });
    }
};

module.exports = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};