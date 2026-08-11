require("dotenv").config();

const bcrypt = require("bcryptjs");

const { sequelize, User } = require("./models");

const createAdmin = async () => {
    try {
        await sequelize.sync();

        const existingUser = await User.findOne({
            where: {
                username: process.env.ADMIN_USERNAME
            }
        });

        if (existingUser) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        await User.create({
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword
        });

        console.log("Admin user created successfully.");
        console.log(
            `Username: ${process.env.ADMIN_USERNAME}`
        );

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();