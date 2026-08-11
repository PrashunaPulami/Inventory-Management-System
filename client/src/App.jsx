import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import EditSupplier from "./pages/EditSupplier";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

    <Route
        path="/"
        element={<Navigate to="/login" replace />}
    />

    <Route
        path="/login"
        element={<Login />}
    />

    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />

    <Route
        path="/products"
        element={
            <ProtectedRoute>
                <Products />
            </ProtectedRoute>
        }
    />

    <Route
        path="/products/add"
        element={
            <ProtectedRoute>
                <AddProduct />
            </ProtectedRoute>
        }
    />

    <Route
    path="/products/edit/:id"
    element={
        <ProtectedRoute>
            <EditProduct />
        </ProtectedRoute>
         }
    />

    <Route
    path="/suppliers"
    element={
        <ProtectedRoute>
            <Suppliers />
        </ProtectedRoute>
        }
    />

    <Route
    path="/suppliers/add"
    element={
        <ProtectedRoute>
            <AddSupplier />
        </ProtectedRoute>
        }
    />

    <Route
    path="/suppliers/edit/:id"
    element={
        <ProtectedRoute>
            <EditSupplier />
        </ProtectedRoute>
        }
    />

</Routes>

        </BrowserRouter>
    );
}

export default App;