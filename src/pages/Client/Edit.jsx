import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Field from "../../components/layout/Field";
import { Mail, Phone, User2, MapPin, Hash, Home, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ClientEdit() {
    const { token, cliente, setCliente } = useAuth();
    const [form, setForm] = useState({
        nome: cliente?.nome || "",
        email: cliente?.email || "",
        telefone: cliente?.telefone || "",
        endereco: {
            cep: cliente?.endereco?.cep || "",
            logradouro: cliente?.endereco?.logradouro || "",
            numero: cliente?.endereco?.numero || "",
            complemento: cliente?.endereco?.complemento || "",
            bairro: cliente?.endereco?.bairro || "",
            cidade: cliente?.endereco?.cidade || "",
            uf: cliente?.endereco?.uf || "",
        },
    });

    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    const updateEndereco = (k, v) =>
        setForm((s) => ({ ...s, endereco: { ...s.endereco, [k]: v } }));

    const salvar = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/clientes/${cliente?.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );
            if (!res.ok) throw new Error(await res.text());
            const updated = await res.json();
            setCliente(updated);
            localStorage.setItem("mf_cliente", JSON.stringify(updated));
            alert("✅ Perfil de cliente atualizado!");
        } catch (e) {
            alert("❌ " + (e.message || "Erro ao salvar"));
        }
    };

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User2 className="text-orange-500" /> Dados do Cliente
                </CardTitle>
                <CardDescription>Atualize suas informações básicas e de endereço</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome" icon={<User2 />} value={form.nome} onChange={(v) => update("nome", v)} />
                <Field label="E-mail" icon={<Mail />} value={form.email} onChange={(v) => update("email", v)} />
                <Field label="Telefone" icon={<Phone />} value={form.telefone} onChange={(v) => update("telefone", v)} />

                {/* Endereço */}
                <Field label="CEP" icon={<MapPin />} value={form.endereco.cep} onChange={(v) => updateEndereco("cep", v)} />
                <Field label="Logradouro" icon={<Home />} value={form.endereco.logradouro} onChange={(v) => updateEndereco("logradouro", v)} />
                <Field label="Número" icon={<Hash />} value={form.endereco.numero} onChange={(v) => updateEndereco("numero", v)} />
                <Field label="Complemento" icon={<Building2 />} value={form.endereco.complemento} onChange={(v) => updateEndereco("complemento", v)} />
                <Field label="Bairro" icon={<Building2 />} value={form.endereco.bairro} onChange={(v) => updateEndereco("bairro", v)} />
                <Field label="Cidade" icon={<Building2 />} value={form.endereco.cidade} onChange={(v) => updateEndereco("cidade", v)} />
                <Field label="UF" icon={<Building2 />} value={form.endereco.uf} onChange={(v) => updateEndereco("uf", v)} />

                <div className="md:col-span-2 flex gap-3">
                    <Button onClick={salvar} className="bg-orange-600 hover:bg-orange-700">
                        Salvar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
