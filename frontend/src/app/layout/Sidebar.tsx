import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList } from "lucide-react";

const linkBase =
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition border border-transparent";
const active = "bg-neutral-900 text-white border-neutral-800";
const inactive = "text-neutral-300 hover:bg-neutral-900/60 hover:text-white";

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-72 shrink-0 border-r border-neutral-900 bg-neutral-950/60 px-4 py-5">
            <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-300/20 to-blue-400/20 border border-neutral-800" />
                <div>
                    <div className="text-sm font-semibold tracking-wide">GQA Portal</div>
                    <div className="text-xs text-neutral-400">Öğrenci Otomasyonu</div>
                </div>
            </div>

            <nav className="mt-6 space-y-2">
                <NavLink
                    to="/"
                    className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                    end
                >
                    <LayoutDashboard size={16} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/studies"
                    className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                >
                    <ClipboardList size={16} />
                    Studies
                </NavLink>
            </nav>

            {/* ENV card */}
            <div className="mt-8 rounded-2xl border border-neutral-900 bg-neutral-950 p-4">
                <div className="text-xs text-neutral-400">Env</div>
                <div className="mt-1 text-xs text-neutral-200">
                    API:{" "}
                    <span className="text-neutral-400">
                        {import.meta.env.VITE_API_URL ?? "http://localhost:3001"}
                    </span>
                </div>
                <div className="mt-2 text-[11px] text-neutral-500">
                    İpucu: Subjects & Templates için bir Study seç.
                </div>
            </div>

            <div className="mt-auto pt-8 text-xs text-neutral-500 px-2">
                v0.1 • GQA Assignment
            </div>
        </aside>
    );
}
