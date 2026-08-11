import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [suppliers, setSuppliers] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stockQuantity: "",
        supplierId: ""
    });

    const [existingImage, setExistingImage] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // Load product and suppliers
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [productResponse, supplierResponse] =
                    await Promise.all([
                        api.get(`/products/${id}`),
                        api.get("/suppliers")
                    ]);

                const product = productResponse.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    category: product.category || "",
                    price: product.price ?? "",
                    stockQuantity: product.stockQuantity ?? "",
                    supplierId: product.supplierId || ""
                });

                setSuppliers(supplierResponse.data);

                if (product.image) {
                    setExistingImage(product.image);
                }

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load product."
                );

            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);


    // Handle text fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // Handle new image
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Only JPG, PNG, WEBP and GIF images are allowed."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB.");

            e.target.value = "";
            return;
        }

        setError("");
        setImage(file);

        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
    };


    // Update product
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !formData.name ||
            !formData.category ||
            formData.price === "" ||
            formData.stockQuantity === "" ||
            !formData.supplierId
        ) {
            setError(
                "Name, category, price, stock quantity and supplier are required."
            );

            return;
        }


        if (Number(formData.price) < 0) {
            setError("Price cannot be negative.");
            return;
        }


        if (Number(formData.stockQuantity) < 0) {
            setError("Stock quantity cannot be negative.");
            return;
        }


        try {
            setSaving(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append(
                "stockQuantity",
                formData.stockQuantity
            );
            data.append(
                "supplierId",
                formData.supplierId
            );

            // Only send a new image if one was selected
            if (image) {
                data.append("image", image);
            }


            await api.put(`/products/${id}`, data);

            setSuccess("Product updated successfully!");


            setTimeout(() => {
                navigate("/products");
            }, 1000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to update product."
            );

        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="products-page">
                <div className="loading">
                    Loading product...
                </div>
            </div>
        );
    }


    return (
        <div className="products-page">

            <header className="page-header">

                <div>
                    <h1>✏️ Edit Product</h1>

                    <p>
                        Update your inventory product
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() => navigate("/products")}
                >
                    ← Back to Products
                </button>

            </header>


            <main className="products-container">

                <section className="product-form-container">

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            ✅ {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Price *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Stock Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="stockQuantity"
                                    min="0"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Supplier *
                            </label>

                            <select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select a supplier
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


                        {/* Existing image */}

                        {existingImage && !imagePreview && (
                            <div className="image-preview">

                                <p>
                                    Current Image
                                </p>

                                <img
                                    src={`http://localhost:5000${existingImage}`}
                                    alt={formData.name}
                                />

                            </div>
                        )}


                        {/* New image */}

                        <div className="form-group">

                            <label>
                                Change Product Image
                            </label>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                            />

                            <small>
                                Leave empty to keep the current image.
                                Maximum 5MB.
                            </small>

                        </div>


                        {/* New image preview */}

                        {imagePreview && (
                            <div className="image-preview">

                                <p>
                                    New Image Preview
                                </p>

                                <img
                                    src={imagePreview}
                                    alt="New product preview"
                                />

                            </div>
                        )}


                        <div className="form-buttons">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "✏️ Update Product"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default EditProduct;