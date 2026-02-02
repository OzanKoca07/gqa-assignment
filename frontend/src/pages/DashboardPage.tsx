import { Card, CardContent, CardHeader } from "../components/ui/Card";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <div className="text-2xl font-semibold">Dashboard</div>
                <div className="text-neutral-400 text-sm">GQA çalışma portalına hoş geldin.</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">Durum</div>
                        <div className="text-lg font-semibold">Sistem Aktif</div>
                    </CardHeader>
                    <CardContent className="text-sm text-neutral-300">
                        Backend + DB çalışıyor. Artık ekranları API’ye bağlayacağız.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">Akış</div>
                        <div className="text-lg font-semibold">Study → Visit → Form</div>
                    </CardHeader>
                    <CardContent className="text-sm text-neutral-300">
                        Template attach, subject create, scheduled visit generate, submission.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">UI</div>
                        <div className="text-lg font-semibold">Portal Layout</div>
                    </CardHeader>
                    <CardContent className="text-sm text-neutral-300">
                        Sidebar + Topbar + Table/Card yapısı hazır.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
