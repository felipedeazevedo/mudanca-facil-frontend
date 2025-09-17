import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState("");
    const [tipo, setTipo] = useState(null);            // "empresa" | "cliente" | null
    const [empresa, setEmpresa] = useState(null);
    const [cliente, setCliente] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem("mf_token");
        const tp = localStorage.getItem("mf_tipo");      // novo
        const e = localStorage.getItem("mf_empresa");
        const c = localStorage.getItem("mf_cliente");

        if (t) setToken(t);
        if (tp) setTipo(tp);
        if (e) setEmpresa(JSON.parse(e));
        if (c) setCliente(JSON.parse(c));
    }, []);

    /**
     * Novo login com suporte a empresa/cliente.
     * Formas de uso:
     * 1) login(jwt, { tipo: "empresa", perfil: { ...me } })
     * 2) login(jwt, { tipo: "cliente", perfil: { ...me } })
     * 3) (compat) login(jwt, empresaObj)
     */
    const login = (jwt, optionsOrEmpresaObj) => {
        setToken(jwt);
        localStorage.setItem("mf_token", jwt);

        // Compatibilidade antiga: segundo argumento era empresaObj
        if (optionsOrEmpresaObj && !optionsOrEmpresaObj?.tipo) {
            const empresaObj = optionsOrEmpresaObj;
            setTipo("empresa");
            localStorage.setItem("mf_tipo", "empresa");

            setEmpresa(empresaObj);
            localStorage.setItem("mf_empresa", JSON.stringify(empresaObj));

            // limpa cliente se houver resquício
            setCliente(null);
            localStorage.removeItem("mf_cliente");
            return;
        }

        // Novo formato
        const { tipo: novoTipo, perfil } = optionsOrEmpresaObj || {};
        if (novoTipo === "empresa") {
            setTipo("empresa");
            localStorage.setItem("mf_tipo", "empresa");

            setEmpresa(perfil || null);
            if (perfil) localStorage.setItem("mf_empresa", JSON.stringify(perfil));
            else localStorage.removeItem("mf_empresa");

            setCliente(null);
            localStorage.removeItem("mf_cliente");
        } else if (novoTipo === "cliente") {
            setTipo("cliente");
            localStorage.setItem("mf_tipo", "cliente");

            setCliente(perfil || null);
            if (perfil) localStorage.setItem("mf_cliente", JSON.stringify(perfil));
            else localStorage.removeItem("mf_cliente");

            setEmpresa(null);
            localStorage.removeItem("mf_empresa");
        } else {
            // caso não informe tipo, apenas salva token
            setTipo(null);
            localStorage.removeItem("mf_tipo");
        }
    };

    const setClienteAndPersist = (obj) => {
        setCliente(obj);
        if (obj) localStorage.setItem("mf_cliente", JSON.stringify(obj));
        else localStorage.removeItem("mf_cliente");
    };

    const setEmpresaAndPersist = (obj) => {
        setEmpresa(obj);
        if (obj) localStorage.setItem("mf_empresa", JSON.stringify(obj));
        else localStorage.removeItem("mf_empresa");
    };

    const logout = () => {
        setToken("");
        setTipo(null);
        setEmpresa(null);
        setCliente(null);

        localStorage.removeItem("mf_token");
        localStorage.removeItem("mf_tipo");
        localStorage.removeItem("mf_empresa");
        localStorage.removeItem("mf_cliente");
    };

    const value = {
        token,
        tipo,
        empresa,
        cliente,
        setEmpresa: setEmpresaAndPersist,
        setCliente: setClienteAndPersist,
        login,
        logout,
        isAuthenticated: !!token,
        isEmpresa: tipo === "empresa",
        isCliente: tipo === "cliente",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
