require("dotenv").config();

const path = require("path");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { sequelize, User } = require("./models");

const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Serve uploaded images
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Middleware
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

// Use hosting provider's PORT or 5000 locally
const PORT = process.env.PORT || 5000;

// Creates the admin user from env vars if it doesn't already exist.
// Runs on every startup so a fresh/ephemeral database (e.g. Render's
// free-tier disk, which resets on every deploy) always ends up with
// a working login, with no manual "shell in and run a script" step needed.
const ensureAdminUser = async () => {
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.warn(
            "ADMIN_USERNAME / ADMIN_PASSWORD not set - skipping admin seed."
        );
        return;
    }

    const existingUser = await User.findOne({
        where: { username: ADMIN_USERNAME }
    });

    if (existingUser) {
        console.log(`Admin user "${ADMIN_USERNAME}" already exists.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
        username: ADMIN_USERNAME,
        password: hashedPassword
    });

    console.log(`Admin user "${ADMIN_USERNAME}" created successfully.`);
};

// Connect database and start server
sequelize
    .sync()
    .then(async () => {
        console.log("Database connected successfully.");

        await ensureAdminUser();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "Unable to connect to database:",
            error
        );
    });