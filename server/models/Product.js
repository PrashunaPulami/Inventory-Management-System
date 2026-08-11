const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    image: {
        type: DataTypes.STRING,
        allowNull: true
    },

    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Product;