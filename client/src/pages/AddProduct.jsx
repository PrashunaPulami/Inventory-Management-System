import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddProduct() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stockQuantity: "",
        supplierId: ""
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Get suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get("/suppliers");
                setSuppliers(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load suppliers."
                );
            }
        };

        fetchSuppliers();
    }, []);


    // Handle text fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Handle image
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Check file type
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

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB.");

            e.target.value = "";
            return;
        }

        setError("");
        setImage(file);

        // Preview
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
    };


    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        // Frontend validation
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
            setLoading(true);

            // FormData is required for image upload
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

            if (image) {
                data.append("image", image);
            }


            // Send to backend
            await api.post("/products", data);


            setSuccess("Product added successfully!");


            // Clear form
            setFormData({
                name: "",
                description: "",
                category: "",
                price: "",
                stockQuantity: "",
                supplierId: ""
            });

            setImage(null);
            setImagePreview("");


            // Go back to products after short delay
            setTimeout(() => {
                navigate("/products");
            }, 1000);


        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to add product."
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
                    <h1>➕ Add Product</h1>

                    <p>
                        Add a new product to your inventory
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

                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}


                    {/* Success */}
                    {success && (
                        <div className="success-message">
                            ✅ {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* Product Name */}
                        <div className="form-group">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Pink Cat Notebook"
                                value={formData.name}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Description */}
                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Enter product description..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />

                        </div>


                        {/* Category */}
                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <input
                                type="text"
                                name="category"
                                placeholder="e.g. Notebooks"
                                value={formData.category}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Price */}
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
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* Stock */}
                            <div className="form-group">

                                <label>
                                    Stock Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="stockQuantity"
                                    min="0"
                                    placeholder="0"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Supplier */}
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


                        {/* Image */}
                        <div className="form-group">

                            <label>
                                Product Image
                            </label>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                            />

                            <small>
                                JPG, PNG, WEBP or GIF. Maximum 5MB.
                            </small>

                        </div>


                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="image-preview">

                                <p>
                                    Image Preview
                                </p>

                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                />

                            </div>
                        )}


                        {/* Buttons */}
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
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "➕ Add Product"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default AddProduct;