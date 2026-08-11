import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch products and suppliers
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [productsResponse, suppliersResponse] =
                await Promise.all([
                    api.get("/products"),
                    api.get("/suppliers")
                ]);

            setProducts(productsResponse.data);
            setSuppliers(suppliersResponse.data);

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Delete product
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);

            // Refresh product list
            fetchData();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    // Filter products
    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            categoryFilter === "" ||
            product.category === categoryFilter;

        const matchesSupplier =
            supplierFilter === "" ||
            String(product.supplierId) === String(supplierFilter);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSupplier
        );
    });

    // Get unique categories
    const categories = [
        ...new Set(
            products.map((product) => product.category)
        )
    ];

    return (
        <div className="products-page">

            <header className="page-header">

                <div>
                    <h1>📦 Products</h1>

                    <p>
                        Manage your inventory products
                    </p>
                </div>

                <div className="header-buttons">

                    <button
                        className="secondary-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/products/add")}
                    >
                        + Add Product
                    </button>

                </div>

            </header>

            <main className="products-container">

                {/* Search and filters */}

                <section className="filters">

                    <div className="filter-group">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <div className="filter-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="filter-group">

                        <label>
                            Supplier
                        </label>

                        <select
                            value={supplierFilter}
                            onChange={(e) =>
                                setSupplierFilter(e.target.value)
                            }
                        >

                            <option value="">
                                All Suppliers
                            </option>

                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.name}
                                </option>
                            ))}

                        </select>

                    </div>

                </section>

                {/* Error */}

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

                        <div className="table-info">
                            <p>
                                Showing{" "}
                                <strong>
                                    {filteredProducts.length}
                                </strong>{" "}
                                product(s)
                            </p>
                        </div>

                        <div className="table-wrapper">

                            <table className="products-table">

                                <thead>

                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Supplier</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredProducts.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="empty-message"
                                            >
                                                No products found.
                                            </td>
                                        </tr>

                                    ) : (

                                        filteredProducts.map((product) => {

                                            const isLowStock =
                                                Number(product.stockQuantity) < 5;

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className={
                                                        isLowStock
                                                            ? "low-stock-row"
                                                            : ""
                                                    }
                                                >

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

                                                    <td>
                                                        {product.category}
                                                    </td>

                                                    <td>
                                                        {product.Supplier?.name ||
                                                            "Unknown supplier"}
                                                    </td>

                                                    <td>
                                                        ${Number(
                                                            product.price
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                isLowStock
                                                                    ? "stock-badge low"
                                                                    : "stock-badge"
                                                            }
                                                        >

                                                            {product.stockQuantity}

                                                            {isLowStock && (
                                                                <span>
                                                                    {" "}⚠️
                                                                </span>
                                                            )}

                                                        </span>

                                                    </td>

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
                                                                    handleDelete(
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
                                        })

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