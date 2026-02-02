import { useNavigate } from "react-router-dom";
import { Search, LogOut } from "lucide-react";
import { getUser, logout } from "../auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function Topbar() {
    const nav = useNavigate();
    const user = getUser();

    return (
        <header className="sticky top-0 z-10 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                    <Search size={16} className="text-neutral-400" />
                    <div className="w-full max-w-md">
                        <Input placeholder="Ara: study, subject, template..." />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-medium leading-4">{user?.name ?? "Öğrenci"}</div>
                        <div className="text-xs text-neutral-400">{user?.email ?? "demo@gqa.edu"}</div>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => {
                            logout();
                            nav("/login");
                        }}
                    >
                        <LogOut size={16} />
                        Çıkış
                    </Button>
                </div>
            </div>
        </header>
    );
}
