import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listStudies, createStudy, type Study } from "../api/studies.api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Link } from "react-router-dom";

function statusBadge(status: Study["status"]) {
    return status === "ACTIVE" ? <Badge variant="success">ACTIVE</Badge> : <Badge variant="warning">DRAFT</Badge>;
}

export default function StudiesPage() {
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [protocolCode, setProtocolCode] = useState("");
    const [status, setStatus] = useState<Study["status"]>("DRAFT");

    const { data, isLoading, error } = useQuery({
        queryKey: ["studies"],
        queryFn: listStudies,
    });

    const createMut = useMutation({
        mutationFn: createStudy,
        onSuccess: async () => {
            setOpen(false);
            setName("");
            setProtocolCode("");
            setStatus("DRAFT");
            await qc.invalidateQueries({ queryKey: ["studies"] });
        },
    });

    const rows = useMemo(() => data ?? [], [data]);

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">Studies</div>
                    <div className="text-sm text-neutral-400">Çalışmaları yönet (create/list/detail)</div>
                </div>
                <Button onClick={() => setOpen(true)}>+ New Study</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Liste</div>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {error && <div className="text-sm text-red-300">Hata: {(error as any).message}</div>}

                    {!isLoading && rows.length === 0 && (
                        <div className="text-sm text-neutral-400">Henüz study yok. “New Study” ile oluştur.</div>
                    )}

                    {rows.length > 0 && (
                        <Table
                            columns={[
                                { header: "Name", key: "name" },
                                { header: "Protocol", key: "protocolCode" },
                                {
                                    header: "Status",
                                    key: "status",
                                    render: (r: Study) => statusBadge(r.status),
                                },
                                {
                                    header: "",
                                    key: "id",
                                    render: (r: Study) => (
                                        <Link className="text-sm text-blue-300 hover:underline" to={`/studies/${r.id}`}>
                                            Open →
                                        </Link>
                                    ),
                                },
                            ]}
                            rows={rows}
                        />
                    )}
                </CardContent>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Create Study">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Name</div>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Demo Study" />
                    </div>
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Protocol Code</div>
                        <Input value={protocolCode} onChange={(e) => setProtocolCode(e.target.value)} placeholder="PROT-001" />
                    </div>
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Status</div>
                        <select
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Study["status"])}
                        >
                            <option value="DRAFT">DRAFT</option>
                            <option value="ACTIVE">ACTIVE</option>
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => createMut.mutate({ name, protocolCode, status })}
                            disabled={createMut.isPending}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
