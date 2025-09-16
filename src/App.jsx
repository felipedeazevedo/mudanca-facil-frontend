import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function App() {
    const { pathname } = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 max-w-6xl mx-auto p-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}