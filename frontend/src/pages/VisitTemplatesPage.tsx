import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Link } from "react-router-dom";


import {
    listVisitTemplates,
    createVisitTemplate,
    updateVisitTemplate,
    deleteVisitTemplate,
    type VisitTemplate,
} from "../api/visitTemplates.api";

type CreateDto = {
    name: string;
    code: string;
    day: number;
    windowBefore: number;
    windowAfter: number;
};

export default function VisitTemplatesPage() {
    const { studyId } = useParams();
    const qc = useQueryClient();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<VisitTemplate | null>(null);

    const [form, setForm] = useState<CreateDto>({
        name: "",
        code: "",
        day: 1,
        windowBefore: 0,
        windowAfter: 0,
    });

    const q = useQuery({
        queryKey: ["visitTemplates", studyId],
        queryFn: () => listVisitTemplates(studyId as string),
        enabled: !!studyId,
    });
    if (!studyId) {
        return <div className="text-sm text-neutral-400">Study seçilmedi.</div>;
    }


    const rows = useMemo(() => q.data ?? [], [q.data]);

    const createMut = useMutation({
        mutationFn: (dto: CreateDto) => createVisitTemplate(studyId, dto),
        onSuccess: async () => {
            setOpen(false);
            setForm({ name: "", code: "", day: 1, windowBefore: 0, windowAfter: 0 });
            await qc.invalidateQueries({ queryKey: ["visitTemplates", studyId] });
        },
    });

    const updateMut = useMutation({
        mutationFn: (dto: Partial<CreateDto> & { id: string }) =>
            updateVisitTemplate(studyId, dto.id, dto),
        onSuccess: async () => {
            setEditing(null);
            await qc.invalidateQueries({ queryKey: ["visitTemplates", studyId] });
        },
    });

    const deleteMut = useMutation({
        mutationFn: (id: string) => deleteVisitTemplate(studyId, id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["visitTemplates", studyId] });
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">Visit Templates</div>
                    <div className="text-sm text-neutral-400">
                        studyId: <span className="text-neutral-200">{studyId}</span>
                    </div>
                </div>
                <Button onClick={() => setOpen(true)}>+ New Visit</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Template list</div>
                </CardHeader>
                <CardContent>
                    {q.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {q.error && <div className="text-sm text-red-300">Hata: {(q.error as any).message}</div>}

                    {rows.length > 0 && (
                        <Table
                            columns={[
                                { header: "Name", key: "name" },
                                { header: "Code", key: "code" },
                                { header: "Day", key: "day" },
                                { header: "Window", key: "windowBefore", render: (r: VisitTemplate) => `${r.windowBefore} / ${r.windowAfter}` },
                                {
                                    header: "",
                                    key: "id",
                                    render: (r: VisitTemplate) => (
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                className="text-sm text-blue-300 hover:underline px-3 py-2"
                                                to={`/studies/${studyId}/visit-templates/${r.id}`}
                                            >
                                                Manage forms →
                                            </Link>

                                            <Button variant="ghost" onClick={() => setEditing(r)}>Edit</Button>
                                            <Button variant="ghost" onClick={() => deleteMut.mutate(r.id)} disabled={deleteMut.isPending}>
                                                Delete
                                            </Button>
                                        </div>
                                    ),

                                },
                            ]}
                            rows={rows}
                        />
                    )}

                    {!q.isLoading && rows.length === 0 && (
                        <div className="text-sm text-neutral-400">Henüz visit template yok.</div>
                    )}
                </CardContent>
            </Card>

            {/* Create */}
            <Modal open={open} onClose={() => setOpen(false)} title="Create Visit Template">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Name</div>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Code</div>
                            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="V1" />
                        </div>
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Day</div>
                            <Input
                                value={String(form.day)}
                                onChange={(e) => setForm({ ...form, day: Number(e.target.value) || 0 })}
                                placeholder="21"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Window Before</div>
                            <Input
                                value={String(form.windowBefore)}
                                onChange={(e) => setForm({ ...form, windowBefore: Number(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Window After</div>
                            <Input
                                value={String(form.windowAfter)}
                                onChange={(e) => setForm({ ...form, windowAfter: Number(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => createMut.mutate(form)} disabled={createMut.isPending}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit */}
            <Modal
                open={!!editing}
                onClose={() => setEditing(null)}
                title="Edit Visit Template"
            >
                {editing && (
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Name</div>
                            <Input
                                value={editing.name}
                                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-sm text-neutral-300 mb-1">Day</div>
                                <Input
                                    value={String(editing.day)}
                                    onChange={(e) => setEditing({ ...editing, day: Number(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <div className="text-sm text-neutral-300 mb-1">Code</div>
                                <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-sm text-neutral-300 mb-1">Window Before</div>
                                <Input
                                    value={String(editing.windowBefore)}
                                    onChange={(e) =>
                                        setEditing({ ...editing, windowBefore: Number(e.target.value) || 0 })
                                    }
                                />
                            </div>
                            <div>
                                <div className="text-sm text-neutral-300 mb-1">Window After</div>
                                <Input
                                    value={String(editing.windowAfter)}
                                    onChange={(e) =>
                                        setEditing({ ...editing, windowAfter: Number(e.target.value) || 0 })
                                    }
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                            <Button
                                onClick={() =>
                                    updateMut.mutate({
                                        id: editing.id,
                                        name: editing.name,
                                        code: editing.code,
                                        day: editing.day,
                                        windowBefore: editing.windowBefore,
                                        windowAfter: editing.windowAfter,
                                    })
                                }
                                disabled={updateMut.isPending}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}

            </Modal>

        </div>

    );

}
