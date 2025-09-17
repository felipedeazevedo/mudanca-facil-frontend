import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Uso:
 *   <PrivateRoute>
 *      <Home />
 *   </PrivateRoute>
 */
export default function PrivateRoute({ children }) {
    const { token } = useAuth();
    const location = useLocation();

    // Se não estiver autenticado, redireciona para /login
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Caso contrário, renderiza o conteúdo protegido
    return children;
}