import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Suppliers() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/suppliers");

            setSuppliers(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load suppliers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Delete supplier
    const deleteSupplier = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/suppliers/${id}`);

            fetchSuppliers();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete supplier."
            );
        }
    };

    // Search suppliers
    const filteredSuppliers = suppliers.filter((supplier) => {
        const searchText = search.toLowerCase().trim();

        return (
            supplier.name
                ?.toLowerCase()
                .includes(searchText) ||
            supplier.email
                ?.toLowerCase()
                .includes(searchText) ||
            supplier.phone
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    return (
        <div className="suppliers-page">

            {/* Header */}
            <header className="page-header">

                <div>
                    <h1>🚚 Suppliers</h1>

                    <p>
                        Manage your inventory suppliers
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
                            navigate("/suppliers/add")
                        }
                    >
                        + Add Supplier
                    </button>

                </div>

            </header>


            <main className="products-container">

                {/* Error */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}


                {/* Search */}
                <section className="filters supplier-filters">

                    <div className="filter-group">

                        <label>
                            Search Supplier
                        </label>

                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </section>


                {/* Loading */}
                {loading ? (

                    <div className="loading">
                        Loading suppliers...
                    </div>

                ) : (

                    <section className="products-table-container">

                        <div className="table-info">

                            Showing{" "}
                            <strong>
                                {filteredSuppliers.length}
                            </strong>{" "}
                            supplier(s)

                        </div>


                        <div className="table-wrapper">

                            <table className="products-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Supplier Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredSuppliers.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty-message"
                                            >
                                                🚚 No suppliers found.
                                            </td>

                                        </tr>

                                    ) : (

                                        filteredSuppliers.map(
                                            (supplier) => (

                                                <tr
                                                    key={supplier.id}
                                                >

                                                    <td>
                                                        {supplier.id}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                supplier.name
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            supplier.email ||
                                                            "N/A"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            supplier.phone ||
                                                            "N/A"
                                                        }
                                                    </td>

                                                    <td>

                                                        <div className="action-buttons">

                                                            <button
                                                                className="edit-button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/suppliers/edit/${supplier.id}`
                                                                    )
                                                                }
                                                            >
                                                                ✏️ Edit
                                                            </button>


                                                            <button
                                                                className="delete-button"
                                                                onClick={() =>
                                                                    deleteSupplier(
                                                                        supplier.id
                                                                    )
                                                                }
                                                            >
                                                                🗑️ Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
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

export default Suppliers;