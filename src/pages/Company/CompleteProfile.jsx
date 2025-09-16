import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Field from "../../components/layout/Field";
import { BadgePercent, Boxes, MapPin, Ruler, ShieldCheck } from "lucide-react";

export default function CompanyCompleteProfile() {
    const [form, setForm] = useState({
        endereco: "",
        coberturaRaioKm: 20,
        cidadesAtendidas: "",
        tiposServico: "Residencial, Comercial",
        precoBase: "",
        precoPorKm: "",
        adicionais: "Piano: 300, Cofre: 200",
        descricao: "",
    });
    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    const salvarMock = () => alert("✅ Dados salvos localmente (mock). Integre quando o backend estiver pronto.");

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-orange-500"/> Complementar cadastro</CardTitle>
                <CardDescription>Defina endereço, cobertura e serviços. (MVP – sem persistência)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Endereço" icon={<MapPin />} value={form.endereco} onChange={(v)=>update("endereco", v)} placeholder="Rua, número, bairro, cidade" />
                <Field label="Raio de cobertura (km)" icon={<Ruler />} value={form.coberturaRaioKm} onChange={(v)=>update("coberturaRaioKm", v)} />
                <Field label="Cidades atendidas" icon={<MapPin />} value={form.cidadesAtendidas} onChange={(v)=>update("cidadesAtendidas", v)} placeholder="Lista separada por vírgula" />
                <Field label="Tipos de serviço" icon={<Boxes />} value={form.tiposServico} onChange={(v)=>update("tiposServico", v)} />
                <Field label="Preço base (R$)" icon={<BadgePercent />} value={form.precoBase} onChange={(v)=>update("precoBase", v)} />
                <Field label="Preço por km (R$)" icon={<BadgePercent />} value={form.precoPorKm} onChange={(v)=>update("precoPorKm", v)} />
                <div className="md:col-span-2 grid gap-2">
                    <label className="text-sm font-medium">Adicionais (texto livre)</label>
                    <textarea className="border rounded-md p-2" value={form.adicionais} onChange={(e)=>update("adicionais", e.target.value)} placeholder="Ex.: Piano: 300, Cofre: 200" />
                </div>
                <div className="md:col-span-2 grid gap-2">
                    <label className="text-sm font-medium">Descrição da empresa</label>
                    <textarea className="border rounded-md p-2" value={form.descricao} onChange={(e)=>update("descricao", e.target.value)} placeholder="Conte sobre sua empresa, diferenciais, experiência." />
                </div>
                <div className="md:col-span-2 flex gap-3">
                    <Button onClick={salvarMock} className="bg-orange-600 hover:bg-orange-700">Salvar (mock)</Button>
                </div>
            </CardContent>
        </Card>
    );
}