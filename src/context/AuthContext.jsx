import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState("");
    const [empresa, setEmpresa] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem("mf_token");
        const e = localStorage.getItem("mf_empresa");
        if (t) setToken(t);
        if (e) setEmpresa(JSON.parse(e));
    }, []);

    const login = (jwt, empresaObj) => {
        setToken(jwt);
        localStorage.setItem("mf_token", jwt);
        if (empresaObj) {
            setEmpresa(empresaObj);
            localStorage.setItem("mf_empresa", JSON.stringify(empresaObj));
        }
    };

    const logout = () => {
        setToken("");
        setEmpresa(null);
        localStorage.removeItem("mf_token");
        localStorage.removeItem("mf_empresa");
    };

    return (
        <AuthContext.Provider value={{ token, empresa, setEmpresa, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}