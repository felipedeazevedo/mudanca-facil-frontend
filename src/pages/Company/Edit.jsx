import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Field from "../../components/layout/Field";
import { BadgePercent, Building2, Mail, Phone, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CompanyEdit() {
    const { token, empresa, setEmpresa } = useAuth();
    const [form, setForm] = useState({
        razaoSocial: empresa?.razaoSocial || "",
        nomeResponsavel: empresa?.nomeResponsavel || "",
        email: empresa?.email || "",
        telefone: empresa?.telefone || "",
    });
    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const salvar = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/empresas/${empresa?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(await res.text());
            const updated = await res.json();
            setEmpresa(updated);
            localStorage.setItem("mf_empresa", JSON.stringify(updated));
            alert("✅ Perfil atualizado!");
        } catch (e) {
            alert("❌ " + (e.message || "Erro ao salvar"));
        }
    };

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="text-orange-500"/> Dados da Empresa</CardTitle>
                <CardDescription>Atualize suas informações básicas</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Razão social" icon={<BadgePercent />} value={form.razaoSocial} onChange={(v)=>update("razaoSocial", v)} />
                <Field label="Responsável" icon={<User2 />} value={form.nomeResponsavel} onChange={(v)=>update("nomeResponsavel", v)} />
                <Field label="E-mail" icon={<Mail />} value={form.email} onChange={(v)=>update("email", v)} />
                <Field label="Telefone" icon={<Phone />} value={form.telefone} onChange={(v)=>update("telefone", v)} />
                <div className="md:col-span-2 flex gap-3">
                    <Button onClick={salvar} className="bg-orange-600 hover:bg-orange-700">Salvar</Button>
                </div>
            </CardContent>
        </Card>
    );
}