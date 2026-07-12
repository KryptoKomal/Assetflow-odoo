import { Routes, Route } from "react-router-dom";

function Placeholder({ label }) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <h1 className="text-2xl font-semibold text-slate-600">{label} — Coming Soon</h1>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Placeholder label="AssetFlow" />} />
            <Route path="/login" element={<Placeholder label="Login" />} />
        </Routes>
    );
}

export default AppRoutes;