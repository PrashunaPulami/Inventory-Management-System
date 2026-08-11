import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/suppliers");

            setSuppliers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Load products and suppliers
    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    // Delete product
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);

            fetchProducts();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    // Get categories
    const categories = [
        ...new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
        )
    ];

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            category === "" ||
            product.category === category;

        const matchesSupplier =
            supplier === "" ||
            String(product.supplierId) === String(supplier);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSupplier
        );
    });

    return (
        <div className="products-page">

            {/* Header */}
            <header className="page-header">

                <div>
                    <h1>📦 Products</h1>

                    <p>
                        Manage your inventory
                    </p>
                </div>

                <div className="header-buttons">

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/products/add")
                        }
                    >
                        + Add Product
                    </button>

                </div>

            </header>


            <main className="products-container">

                {/* Search and Filters */}
                <section className="filters">

                    {/* Search */}
                    <div className="filter-group">

                        <label>
                            Search Product
                        </label>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* Category Filter */}
                    <div className="filter-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >

                            <option value="">
                                All Categories
                            </option>

                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* Supplier Filter */}
                    <div className="filter-group">

                        <label>
                            Supplier
                        </label>

                        <select
                            value={supplier}
                            onChange={(e) =>
                                setSupplier(e.target.value)
                            }
                        >

                            <option value="">
                                All Suppliers
                            </option>

                            {suppliers.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}

                        </select>

                    </div>

                </section>


                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}


                {/* Loading */}
                {loading ? (

                    <div className="loading">
                        Loading products...
                    </div>

                ) : (

                    <section className="products-table-container">

                        {/* Table Information */}
                        <div className="table-info">

                            Showing{" "}
                            <strong>
                                {filteredProducts.length}
                            </strong>{" "}
                            product(s)

                        </div>


                        <div className="table-wrapper">

                            <table className="products-table">

                                {/* Table Header */}
                                <thead>

                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Supplier</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                {/* Table Body */}
                                <tbody>

                                    {filteredProducts.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="empty-message"
                                            >
                                                📦 No products found.
                                            </td>

                                        </tr>

                                    ) : (

                                        filteredProducts.map(
                                            (product) => {

                                                const lowStock =
                                                    Number(
                                                        product.stockQuantity
                                                    ) < 5;

                                                return (

                                                    <tr
                                                        key={product.id}
                                                        className={
                                                            lowStock
                                                                ? "low-stock-row"
                                                                : ""
                                                        }
                                                    >

                                                        {/* Product Image */}
                                                        <td>

                                                            {product.image ? (

                                                                <img
                                                                    src={`http://localhost:5000${product.image}`}
                                                                    alt={product.name}
                                                                    className="product-table-image"
                                                                />

                                                            ) : (

                                                                <div className="no-product-image">
                                                                    📦
                                                                </div>

                                                            )}

                                                        </td>


                                                        {/* Product Name */}
                                                        <td>

                                                            <strong>
                                                                {product.name}
                                                            </strong>

                                                            {product.description && (
                                                                <small>
                                                                    {
                                                                        product.description
                                                                    }
                                                                </small>
                                                            )}

                                                        </td>


                                                        {/* Category */}
                                                        <td>
                                                            {product.category}
                                                        </td>


                                                        {/* Supplier */}
                                                        <td>
                                                            {product.Supplier?.name ||
                                                                "Unknown"}
                                                        </td>


                                                        {/* Price */}
                                                        <td>
                                                            $
                                                            {Number(
                                                                product.price
                                                            ).toFixed(2)}
                                                        </td>


                                                        {/* Stock */}
                                                        <td>

                                                            <span
                                                                className={
                                                                    lowStock
                                                                        ? "stock-badge low"
                                                                        : "stock-badge"
                                                                }
                                                            >

                                                                {
                                                                    product.stockQuantity
                                                                }

                                                                {lowStock &&
                                                                    " ⚠️"}

                                                            </span>

                                                        </td>


                                                        {/* Actions */}
                                                        <td>

                                                            <div className="action-buttons">

                                                                <button
                                                                    className="edit-button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/products/edit/${product.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    ✏️ Edit
                                                                </button>


                                                                <button
                                                                    className="delete-button"
                                                                    onClick={() =>
                                                                        deleteProduct(
                                                                            product.id
                                                                        )
                                                                    }
                                                                >
                                                                    🗑️ Delete
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
}

export default Products;