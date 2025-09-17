import React from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const { token, tipo, logout } = useAuth(); // agora lemos o tipo
    const navigate = useNavigate();

    const goToAccount = () => {
        if (tipo === "cliente") navigate("/cliente/editar");
        else navigate("/empresa/editar"); // default empresa
    };

    const accountLabel = tipo === "cliente" ? "Minha conta" : "Minha Empresa";

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="border-b bg-white/80 backdrop-blur sticky top-0 z-30">
            <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="p-2 rounded-2xl bg-orange-100 text-orange-600">
                        <Truck />
                    </div>
                    <span className="font-semibold text-xl">Mudança Fácil</span>
                </Link>

                {token ? (
                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={goToAccount}
                        >
                            {accountLabel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Link to="/login">Login</Link>
                        <span>·</span>
                        <Link to="/cadastro">Cadastro</Link>
                    </div>
                )}
            </div>
        </div>
    );
}