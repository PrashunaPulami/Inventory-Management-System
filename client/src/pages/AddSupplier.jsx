import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddSupplier() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // Basic validation
        if (!formData.name.trim()) {
            setError("Supplier name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/suppliers", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim()
            });

            alert("Supplier added successfully!");

            navigate("/suppliers");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to add supplier."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-page">

            {/* Header */}
            <header className="page-header">

                <div>
                    <h1>🚚 Add Supplier</h1>

                    <p>
                        Add a new supplier to your inventory
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/suppliers")
                    }
                >
                    ← Back to Suppliers
                </button>

            </header>


            {/* Form */}
            <main className="products-container">

                <section className="form-card">

                    <h2>
                        Supplier Information
                    </h2>

                    <p className="form-description">
                        Enter the details of the new supplier below.
                    </p>


                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* Supplier Name */}
                        <div className="form-group">

                            <label htmlFor="name">
                                Supplier Name *
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter supplier name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Email */}
                        <div className="form-group">

                            <label htmlFor="email">
                                Email *
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="supplier@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Phone */}
                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number *
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Buttons */}
                        <div className="form-buttons">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/suppliers")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "➕ Add Supplier"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default AddSupplier;