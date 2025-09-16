import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CompanyEdit from "./pages/Company/Edit";
import CompanyCompleteProfile from "./pages/Company/CompleteProfile";
import CompanyDelete from "./pages/Company/Delete";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Dashboard/Home";

function PrivateRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/login" replace /> },
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "login", element: <Login /> },
            { path: "cadastro", element: <Register /> },
            { path: "home", element: <PrivateRoute><Home /></PrivateRoute> },
            {
                path: "empresa",
                children: [
                    { path: "editar", element: <PrivateRoute><CompanyEdit /></PrivateRoute> },
                    { path: "complementar", element: <PrivateRoute><CompanyCompleteProfile /></PrivateRoute> },
                    { path: "excluir", element: <PrivateRoute><CompanyDelete /></PrivateRoute> },
                ],
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}