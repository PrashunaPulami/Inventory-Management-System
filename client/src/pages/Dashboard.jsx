import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>🛍️ Inventory Manager</h1>
                    <p>Welcome, {user?.username}</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>

            <main>

                <h2>Dashboard</h2>

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <span>📦</span>
                        <h3>Products</h3>
                        <p>Manage your inventory</p>

                        <button
                            onClick={() => navigate("/products")}
                        >
                            View Products
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <span>🚚</span>
                        <h3>Suppliers</h3>
                        <p>Manage your suppliers</p>

                        <button
                            onClick={() => navigate("/suppliers")}
                        >
                            View Suppliers
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <span>⚠️</span>
                        <h3>Low Stock</h3>
                        <p>Products needing attention</p>

                        <button
                            onClick={() => navigate("/products")}
                        >
                            Check Stock
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;