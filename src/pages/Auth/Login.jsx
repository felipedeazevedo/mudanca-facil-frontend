import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Building2, LogIn, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner"
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getBackendMessage(e) {
    try {
        const parsed = JSON.parse(e?.message);
        return parsed?.detail || parsed?.message || e?.message || "Erro ao logar";
    } catch {
        return e?.message || "Erro ao logar";
    }
}

export default function Login() {
    const { token, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("empresa"); // "empresa" | "cliente"
    const [loading, setLoading] = useState(false);

    const descricao =
        tipo === "empresa"
            ? "Autentique-se para gerenciar sua empresa"
            : "Autentique-se para achar a empresa ideal pra sua mudança";

    // Se já tiver token, manda para /home
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

            // 2) busca perfil conforme o tipo selecionado
            const meEndpoint = tipo === "empresa" ? "/empresas/me" : "/clientes/me";
            const me = await fetch(`${BASE_URL}${meEndpoint}`, {
                headers: { Authorization: `Bearer ${res.accessToken}` },
            }).then((r) => {
                if (!r.ok) throw new Error("Falha ao obter perfil");
                return r.json();
            });

            // 3) salva no contexto com o tipo correto (isso já persiste no localStorage)
            login(res.accessToken, { tipo, perfil: me });

            toast.success("Login efetuado!", {
                description: "Você será redirecionado para a home.",
            });

            // 4) redireciona para /home (sempre)
            navigate("/home", { replace: true });
        } catch (e) {
            toast.error("Falha no login", { description: getBackendMessage(e) });
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
                        <CardDescription>{descricao}</CardDescription>
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
                                placeholder="Digite aqui seu email"
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
