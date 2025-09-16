const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status !== 204 ? res.json() : null;
};