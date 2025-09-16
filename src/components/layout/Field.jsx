import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Field({ label, icon, value, onChange, type = "text", placeholder }) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                {icon && <div className="p-2 rounded-xl bg-orange-100 text-orange-600">{icon}</div>}
                <Input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} />
            </div>
        </div>
    );
}