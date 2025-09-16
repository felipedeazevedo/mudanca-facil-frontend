import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CompanyDelete() {
    const { token, empresa } = useAuth();

    const excluir = async () => {
        if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/empresas/${empresa?.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(await res.text());
            alert("✅ Conta excluída com sucesso. Faça login novamente se necessário.");
            localStorage.removeItem("mf_token");
            localStorage.removeItem("mf_empresa");
            window.location.href = "/login";
        } catch (e) {
            alert("❌ " + (e.message || "Erro ao excluir"));
        }
    };

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600"><Trash2/> Excluir conta</CardTitle>
                <CardDescription>Esta ação não pode ser desfeita.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={excluir} className="bg-orange-600 hover:bg-orange-700">
                    Confirmar exclusão
                </Button>
            </CardContent>
        </Card>
    );
}