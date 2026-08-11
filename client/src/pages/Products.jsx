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

    const fetchProducts = async () => {
        try {
            setLoading(true);

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

    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/suppliers");

            setSuppliers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    // Get categories
    const categories = [
        ...new Set(
            products.map((product) => product.category)
        )
    ];

    // Filter products
    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
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

                {/* Search and filters */}
                <section className="filters">

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

                            Showing{" "}
                            <strong>
                                {filteredProducts.length}
                            </strong>{" "}
                            product(s)

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
                                                                "Unknown"}
                                                        </td>


                                                        <td>
                                                            $
                                                            {Number(
                                                                product.price
                                                            ).toFixed(2)}
                                                        </td>


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

                                                                {lowStock && " ⚠️"}

                                                            </span>

                                                        </td>


                                                        <td>

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