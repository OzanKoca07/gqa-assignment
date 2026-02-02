import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";

import {
    listFormTemplates,
    createFormTemplate,
    type FormTemplate,
} from "../api/formTemplates.api";

export default function FormTemplatesPage() {
    const { studyId } = useParams();
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    // ✅ En temiz hali: studyId yoksa hiç devam etme
    if (!studyId) {
        return <div className="text-sm text-neutral-400">Study seçilmedi.</div>;
    }

    const q = useQuery({
        queryKey: ["formTemplates", studyId],
        queryFn: () => listFormTemplates(studyId),
    });

    const rows = useMemo(() => q.data ?? [], [q.data]);

    const createMut = useMutation({
        mutationFn: (dto: { name: string; code: string }) => createFormTemplate(studyId, dto),
        onSuccess: async () => {
            setOpen(false);
            setName("");
            setCode("");
            await qc.invalidateQueries({ queryKey: ["formTemplates", studyId] });
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">Form Templates</div>
                    <div className="text-sm text-neutral-400">
                        studyId: <span className="text-neutral-200">{studyId}</span>
                    </div>
                </div>
                <Button onClick={() => setOpen(true)}>+ New Form</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Forms list</div>
                </CardHeader>
                <CardContent>
                    {q.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {q.error && <div className="text-sm text-red-300">Hata: {(q.error as any).message}</div>}

                    {rows.length > 0 && (
                        <Table
                            columns={[
                                { header: "Name", key: "name" },
                                { header: "Code", key: "code" },
                                {
                                    header: "",
                                    key: "id",
                                    render: (r: FormTemplate) => (
                                        <Link
                                            className="text-sm text-blue-300 hover:underline"
                                            to={`/studies/${studyId}/form-templates/${r.id}`}
                                        >
                                            Manage fields →
                                        </Link>
                                    ),
                                },
                            ]}
                            rows={rows}
                        />
                    )}

                    {!q.isLoading && rows.length === 0 && (
                        <div className="text-sm text-neutral-400">Henüz form template yok.</div>
                    )}
                </CardContent>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Create Form Template">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Name</div>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vitals" />
                    </div>
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Code</div>
                        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VITALS" />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => createMut.mutate({ name, code })}
                            disabled={createMut.isPending || !name.trim() || !code.trim()}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
