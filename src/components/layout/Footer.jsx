import React from "react";

export default function Footer() {
    return (
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
            Grupo Mudança Fácil UCB – {new Date().getFullYear()}
        </div>
    );
}