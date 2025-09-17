export const formatPhoneBR = (v) => {
    if (!v) return "—";
    let d = String(v).replace(/\D/g, "");

    // trata DDI +55
    if (d.startsWith("55") && (d.length === 12 || d.length === 13)) {
        d = d.slice(2);
    }

    if (d.length === 11) {
        // (99) 9 9999-9999
        return d.replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    }
    if (d.length === 10) {
        // (99) 9999-9999
        return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
    return v; // fallback
};
