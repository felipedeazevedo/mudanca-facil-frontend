import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Building2, LogIn, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login() {
    const { token, login, setEmpresa } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("empresa");
    const [loading, setLoading] = useState(false);

    // se já tiver token, manda para home
    useEffect(() => {
        if (token) navigate("/home", { replace: true });
    }, [token, navigate]);

    const handleLogin = async () => {
        try {
            setLoading(true);

            // 1) autentica e guarda o token
            const res = await api("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, senha }),
            });
            login(res.accessToken, null);

            // 2) busca os dados da empresa logada e guarda no contexto
            const me = await fetch(`${BASE_URL}/empresas/me`, {
                headers: { Authorization: `Bearer ${res.accessToken}` },
            }).then((r) => {
                if (!r.ok) throw new Error("Falha ao obter perfil");
                return r.json();
            });

            setEmpresa(me);
            localStorage.setItem("mf_empresa", JSON.stringify(me));

            alert("✅ Login efetuado!");
            navigate("/home", { replace: true });
        } catch (e) {
            alert("❌ " + (e.message || "Erro ao logar"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login"><LogIn className="w-4 h-4 mr-2" />Login</TabsTrigger>
                <TabsTrigger value="cadastro" asChild>
                    <a href="/cadastro" className="inline-flex items-center">
                        <User2 className="w-4 h-4 mr-2" />
                        Cadastro
                    </a>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card className="rounded-2xl shadow-sm max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="text-orange-500" /> Entrar
                        </CardTitle>
                        <CardDescription>Autentique-se para gerenciar sua empresa</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-center gap-8 p-3 rounded-xl bg-orange-50">
                            <div className="flex items-center gap-2 text-sm">
                                <User2 className={tipo === "cliente" ? "text-orange-600" : "text-gray-400"} />
                                Cliente
                            </div>
                            <Switch
                                checked={tipo === "empresa"}
                                onCheckedChange={(v) => setTipo(v ? "empresa" : "cliente")}
                            />
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className={tipo === "empresa" ? "text-orange-600" : "text-gray-400"} />
                                Empresa
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="empresa@dominio.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <Button
                            disabled={loading}
                            onClick={handleLogin}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
