require("dotenv").config();

const path = require("path");

const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use(cors());
app.use(express.json());

// Authentication
app.use("/api/auth", authRoutes);

// Protected API routes
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Inventory Management API is running!"
    });
});

const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(() => {
        console.log("Database connected successfully.");

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "Unable to connect to database:",
            error
        );
    });