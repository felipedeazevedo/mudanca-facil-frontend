import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Building2, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
    const { empresa } = useAuth();

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-orange-100 text-orange-600"><Truck /></div>
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Olá{empresa?.nomeResponsavel ? `, ${empresa.nomeResponsavel.split(" ")[0]}` : ""}! 👋
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Bem-vindo ao painel da sua empresa no Mudança Fácil.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to="/empresa/editar"><Button className="bg-orange-600 hover:bg-orange-700"><Pencil className="w-4 h-4 mr-2" />Editar perfil</Button></Link>
                    <Link to="/empresa/complementar"><Button variant="outline"><ShieldCheck className="w-4 h-4 mr-2" />Completar cadastro</Button></Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-2xl">
                    <CardHeader><CardTitle className="text-base">Status da empresa</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">{empresa?.status ?? "—"}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Complete o perfil para ficar apta a receber leads.
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader><CardTitle className="text-base">Dados de contato</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Razão social:</span> {empresa?.razaoSocial ?? "—"}</div>
                            <div><span className="font-medium">E-mail:</span> {empresa?.email ?? "—"}</div>
                            <div><span className="font-medium">Telefone:</span> {empresa?.telefone ?? "—"}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader><CardTitle className="text-base">Ações rápidas</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Link to="/empresa/editar"><Button size="sm" className="bg-orange-600 hover:bg-orange-700"><Building2 className="w-4 h-4 mr-2" />Atualizar dados</Button></Link>
                        <Link to="/empresa/complementar"><Button size="sm" variant="outline"><ShieldCheck className="w-4 h-4 mr-2" />Completar cadastro</Button></Link>
                        <Link to="/empresa/excluir"><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Excluir conta</Button></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
