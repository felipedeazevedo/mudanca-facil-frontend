import React, {useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Switch} from "@/components/ui/switch";
import {BadgePercent, Building2, Hash, Lock, Mail, Phone, Truck, User2} from "lucide-react";
import {api} from "@/services/api.js";
import { toast } from "sonner"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";

const onlyDigits = (s = "") => s.replace(/\D/g, "");

const maskCNPJ = (v) => {
    const d = onlyDigits(v).slice(0, 14);
    return d
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};

const maskCPF = (v) => {
    const d = onlyDigits(v).slice(0, 11);
    return d
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

const maskCEP = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    return d.replace(/^(\d{5})(\d)/, "$1-$2");
};

const maskPhoneBR = (v) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length <= 10) {
        // (99) 9999-9999
        return d
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    // (99) 9 9999-9999
    return d
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/^(\(\d{2}\)\s\d)(\d{4})(\d)/, "$1 $2-$3");
};

// Validações com Zod
const passwordSchema = z
    .string()
    .min(8, "Mínimo de 8 caracteres")
    .refine((s) => /[A-Z]/.test(s), "Inclua ao menos 1 maiúscula")
    .refine((s) => /[a-z]/.test(s), "Inclua ao menos 1 minúscula")
    .refine((s) => /\d/.test(s), "Inclua ao menos 1 número");


const empresaSchema = z.object({
    cnpj: z
        .string()
        .transform(onlyDigits)
        .refine((v) => v.length === 14, "CNPJ deve ter 14 dígitos"),
    razaoSocial: z.string().min(2, "Informe a razão social"),
    nomeResponsavel: z.string().min(2, "Informe o responsável"),
    email: z.string().email("E-mail inválido"),
    telefone: z
        .string()
        .transform(onlyDigits)
        .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido"),
    senha: passwordSchema,
});

const enderecoSchema = z.object({
    cep: z
        .string()
        .transform(onlyDigits)
        .refine((v) => v.length === 8, "CEP deve conter 8 dígitos (sem máscara)"),
    logradouro: z.string().min(1, "Informe o logradouro").max(120),
    numero: z.string().min(1, "Informe o número").max(10),
    complemento: z.string().max(60).optional().or(z.literal("")),
    bairro: z.string().min(1, "Informe o bairro").max(80),
    cidade: z.string().min(1, "Informe a cidade").max(120),
    uf: z
        .string()
        .transform((s) => (s || "").toUpperCase())
        .refine((v) => /^[A-Z]{2}$/.test(v), "UF deve conter 2 letras maiúsculas (ex.: DF)"),
});

const clienteSchema = z.object({
    cpf: z.string().transform(onlyDigits).refine((v) => v.length === 11, "CPF deve conter 11 dígitos"),
    nome: z.string().min(1, "Informe o nome").max(150),
    email: z.string().email("E-mail inválido").max(150),
    senha: passwordSchema.max(255, "Máximo de 255 caracteres"),
    telefone: z
        .string()
        .transform(onlyDigits)
        .refine((v) => v.length >= 10 && v.length <= 20, "Telefone inválido"),
    endereco: enderecoSchema,
});

function FieldRow({ id, label, icon: Icon, error, children }) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="flex items-center gap-2">
                {Icon ? <Icon className="w-4 h-4" /> : null}
                {label}
            </Label>
            {children}
            {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
        </div>
    );
}

function getBackendMessage(e) {
    try {
        const parsed = JSON.parse(e?.message);
        return parsed?.detail || parsed?.message || e?.message || "Erro ao cadastrar";
    } catch {
        return e?.message || "Erro ao cadastrar";
    }
}

function EmpresaForm() {

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting, isValid },
        watch,
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            cnpj: "",
            razaoSocial: "",
            nomeResponsavel: "",
            email: "",
            telefone: "",
            senha: "",
        },
    });

    // força da senha simples (0-4)
    const pwd = watch("senha");
    const passwordScore = useMemo(() => {
        if (!pwd) return 0;
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[a-z]/.test(pwd)) s++;
        if (/\d/.test(pwd)) s++;
        return s;
    }, [pwd]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            // normalizar payload
            const payload = {
                ...data,
                cnpj: onlyDigits(data.cnpj),
                telefone: onlyDigits(data.telefone),
            };

            await api("/empresas", { method: "POST", body: JSON.stringify(payload) });

            toast("Conta criada com sucesso!", {
                description: "Você será redirecionado para o login.",
            });
            setTimeout(() => (window.location.href = "/login"), 800);
        } catch (e) {
            console.log(JSON.parse(e?.message));
            const backendMessage =
                JSON.parse(e?.message).detail || "Erro ao cadastrar";

            // se backend mandar errors por campo (ex.: { errors: { email: 'já existe' } })
            const fieldErrors = e?.response?.data?.errors;
            if (fieldErrors && typeof fieldErrors === "object") {
                Object.entries(fieldErrors).forEach(([field, message]) => {
                    setError(field, { type: "server", message: String(message) });
                });
            }

            toast.error("Falha no cadastro", {
                description: backendMessage,
            });
        }
    });

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                    <FieldRow id="cnpj" label="CNPJ" icon={Hash} error={errors.cnpj}>
                        <Input
                            id="cnpj"
                            inputMode="numeric"
                            placeholder="00.000.000/0000-00"
                            value={maskCNPJ(field.value)}
                            onChange={(e) => field.onChange(maskCNPJ(e.target.value))}
                        />
                    </FieldRow>
                )}
            />

            <FieldRow
                id="razaoSocial"
                label="Razão social"
                icon={BadgePercent}
                error={errors.razaoSocial}
            >
                <Input id="razaoSocial" {...register("razaoSocial")} />
            </FieldRow>

            <FieldRow
                id="nomeResponsavel"
                label="Responsável"
                icon={User2}
                error={errors.nomeResponsavel}
            >
                <Input id="nomeResponsavel" {...register("nomeResponsavel")} />
            </FieldRow>

            <FieldRow id="email" label="E-mail" icon={Mail} error={errors.email}>
                <Input id="email" type="email" placeholder="nome@empresa.com" {...register("email")} />
            </FieldRow>

            <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                    <FieldRow id="telefone" label="Telefone" icon={Phone} error={errors.telefone}>
                        <Input
                            id="telefone"
                            inputMode="tel"
                            placeholder="(61) 9 9999-9999"
                            value={maskPhoneBR(field.value)}
                            onChange={(e) => field.onChange(maskPhoneBR(e.target.value))}
                        />
                    </FieldRow>
                )}
            />

            <FieldRow id="senha" label="Senha" icon={Lock} error={errors.senha}>
                <div className="space-y-1">
                    <Input id="senha" type="password" {...register("senha")} />
                    <div className="text-xs text-muted-foreground">
                        Força da senha: {["Fraca", "OK", "Boa", "Forte", "Excelente"][passwordScore]}
                    </div>
                </div>
            </FieldRow>

            <div className="md:col-span-2">
                <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={!isValid || isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? "Enviando..." : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}

function ClienteForm() {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting, isValid },
        watch
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            cpf: "",
            nome: "",
            email: "",
            senha: "",
            telefone: "",
            endereco: {
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                uf: "",
            },
        },
    });

    // força da senha simples (0-4)
    const pwd = watch("senha");
    const passwordScore = useMemo(() => {
        if (!pwd) return 0;
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[a-z]/.test(pwd)) s++;
        if (/\d/.test(pwd)) s++;
        return s;
    }, [pwd]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                ...data,
                cpf: onlyDigits(data.cpf),
                telefone: onlyDigits(data.telefone),
                endereco: {
                    ...data.endereco,
                    cep: onlyDigits(data.endereco.cep),
                    uf: (data.endereco.uf || "").toUpperCase(),
                },
            };

            await api("/clientes", { method: "POST", body: JSON.stringify(payload) });

            toast.success("Conta criada com sucesso!", {
                description: "Você será redirecionado para o login.",
            });
            setTimeout(() => (window.location.href = "/login"), 800);
        } catch (e) {
            const backendMessage = getBackendMessage(e);

            // Caso seu backend também envie errors por campo em algum formato:
            const fieldErrors = e?.response?.data?.errors;
            if (fieldErrors && typeof fieldErrors === "object") {
                Object.entries(fieldErrors).forEach(([field, message]) => {
                    setError(field, { type: "server", message: String(message) });
                });
            }

            toast.error("Falha no cadastro", { description: backendMessage });
        }
    });

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPF */}
            <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                    <FieldRow id="cpf" label="CPF" icon={Hash} error={errors.cpf}>
                        <Input
                            id="cpf"
                            inputMode="numeric"
                            placeholder="000.000.000-00"
                            value={maskCPF(field.value)}
                            onChange={(e) => field.onChange(maskCPF(e.target.value))}
                        />
                    </FieldRow>
                )}
            />

            {/* Nome */}
            <FieldRow id="nome" label="Nome completo" icon={User2} error={errors.nome}>
                <Input id="nome" {...register("nome")} />
            </FieldRow>

            {/* Email */}
            <FieldRow id="email-cliente" label="E-mail" icon={Mail} error={errors.email}>
                <Input id="email-cliente" type="email" placeholder="nome@email.com" {...register("email")} />
            </FieldRow>

            {/* Telefone */}
            <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                    <FieldRow id="telefone-cliente" label="Telefone" icon={Phone} error={errors.telefone}>
                        <Input
                            id="telefone-cliente"
                            inputMode="tel"
                            placeholder="(61) 9 9999-9999"
                            value={maskPhoneBR(field.value)}
                            onChange={(e) => field.onChange(maskPhoneBR(e.target.value))}
                        />
                    </FieldRow>
                )}
            />

            {/* Senha */}
            <FieldRow id="senha-cliente" label="Senha" icon={Lock} error={errors.senha}>
                <div className="space-y-1">
                    <Input id="senha-cliente" type="password" {...register("senha")} />
                    <div className="text-xs text-muted-foreground">
                        Força da senha: {["Fraca", "OK", "Boa", "Forte", "Excelente"][passwordScore]}
                    </div>
                </div>
            </FieldRow>

            {/* Endereço - CEP */}
            <Controller
                name="endereco.cep"
                control={control}
                render={({ field }) => (
                    <FieldRow id="cep" label="CEP" icon={BadgePercent} error={errors?.endereco?.cep}>
                        <Input
                            id="cep"
                            inputMode="numeric"
                            placeholder="00000-000"
                            value={maskCEP(field.value)}
                            onChange={(e) => field.onChange(maskCEP(e.target.value))}
                        />
                    </FieldRow>
                )}
            />

            {/* Endereço - Logradouro */}
            <FieldRow
                id="logradouro"
                label="Logradouro"
                icon={Building2}
                error={errors?.endereco?.logradouro}
            >
                <Input id="logradouro" {...register("endereco.logradouro")} />
            </FieldRow>

            {/* Endereço - Número */}
            <FieldRow id="numero" label="Número" icon={Hash} error={errors?.endereco?.numero}>
                <Input id="numero" {...register("endereco.numero")} />
            </FieldRow>

            {/* Endereço - Complemento */}
            <FieldRow
                id="complemento"
                label="Complemento"
                icon={BadgePercent}
                error={errors?.endereco?.complemento}
            >
                <Input id="complemento" {...register("endereco.complemento")} />
            </FieldRow>

            {/* Endereço - Bairro */}
            <FieldRow id="bairro" label="Bairro" icon={Building2} error={errors?.endereco?.bairro}>
                <Input id="bairro" {...register("endereco.bairro")} />
            </FieldRow>

            {/* Endereço - Cidade */}
            <FieldRow id="cidade" label="Cidade" icon={Building2} error={errors?.endereco?.cidade}>
                <Input id="cidade" {...register("endereco.cidade")} />
            </FieldRow>

            {/* Endereço - UF */}
            <FieldRow id="uf" label="UF" icon={Building2} error={errors?.endereco?.uf}>
                <Input
                    id="uf"
                    maxLength={2}
                    placeholder="DF"
                    {...register("endereco.uf", {
                        onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
                    })}
                />
            </FieldRow>

            <div className="md:col-span-2">
                <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={!isValid || isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? "Enviando..." : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}

export default function Register() {
    const [tipo, setTipo] = useState("empresa");

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
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="text-orange-500" /> Criar conta
                        </CardTitle>
                        <CardDescription>
                            Cadastre-se como <b>cliente</b> ou <b>empresa</b>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
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

                        {tipo === "empresa" ? <EmpresaForm /> : <ClienteForm />}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}