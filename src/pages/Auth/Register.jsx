import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { BadgePercent, Building2, Hash, Lock, Mail, Phone, Truck, User2 } from "lucide-react";
import Field from "../../components/layout/Field";
import { api } from "../../services/api";

export default function Register() {
    const [tipo, setTipo] = useState("empresa");
    const [form, setForm] = useState({ cnpj: "", razaoSocial: "", nomeResponsavel: "", email: "", senha: "", telefone: "" });
    const [loading, setLoading] = useState(false);
    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const cadastrarEmpresa = async () => {
        try {
            setLoading(true);
            await api(`/empresas`, { method: "POST", body: JSON.stringify(form) });
            alert("✅ Empresa cadastrada com sucesso!");
            window.location.href = "/login";
        } catch (e) {
            alert("❌ " + (e.message || "Erro ao cadastrar"));
        } finally {
            setLoading(false);
        }
    };

    const cadastrarCliente = async () => {
        alert("✅ Cadastro de cliente (mock)");
    };

    const onSubmit = () => (tipo === "empresa" ? cadastrarEmpresa() : cadastrarCliente());

    return (
        <Tabs defaultValue="cadastro" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login" asChild>
                    <a href="/login" className="inline-flex items-center"><User2 className="w-4 h-4 mr-2"/>Login</a>
                </TabsTrigger>
                <TabsTrigger value="cadastro"><Truck className="w-4 h-4 mr-2"/>Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="cadastro">
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building2 className="text-orange-500"/> Criar conta</CardTitle>
                        <CardDescription>Cadastre-se como <b>cliente</b> ou <b>empresa</b></CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
                            <div className="flex items-center gap-2 text-sm">
                                <User2 className={tipo === "cliente" ? "text-orange-600" : "text-gray-400"} />
                                Cliente
                            </div>
                            <Switch checked={tipo === "empresa"} onCheckedChange={(v) => setTipo(v ? "empresa" : "cliente")} />
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className={tipo === "empresa" ? "text-orange-600" : "text-gray-400"} />
                                Empresa
                            </div>
                        </div>

                        {tipo === "empresa" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="CNPJ" icon={<Hash />} value={form.cnpj} onChange={(v)=>update("cnpj", v)} placeholder="Apenas dígitos (14)" />
                                <Field label="Razão social" icon={<BadgePercent />} value={form.razaoSocial} onChange={(v)=>update("razaoSocial", v)} />
                                <Field label="Responsável" icon={<User2 />} value={form.nomeResponsavel} onChange={(v)=>update("nomeResponsavel", v)} />
                                <Field label="E-mail" type="email" icon={<Mail />} value={form.email} onChange={(v)=>update("email", v)} />
                                <Field label="Telefone" icon={<Phone />} value={form.telefone} onChange={(v)=>update("telefone", v)} placeholder="+55..." />
                                <Field label="Senha" type="password" icon={<Lock />} value={form.senha} onChange={(v)=>update("senha", v)} />
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-orange-50 text-sm text-orange-700">Em breve: cadastro de cliente (MVP atual foca empresa).</div>
                        )}

                        <Button disabled={loading} onClick={onSubmit} className="bg-orange-600 hover:bg-orange-700">
                            {loading ? "Enviando..." : "Cadastrar"}
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}