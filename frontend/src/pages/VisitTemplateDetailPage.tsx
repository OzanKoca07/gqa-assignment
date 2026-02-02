import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";

import { listFormTemplates, type FormTemplate } from "../api/formTemplates.api";
import { listAttachedForms, attachFormToVisit, detachFormFromVisit } from "../api/visitTemplates.api";

// Backend genelde bunu döndürür:
// { formTemplateId: string, formTemplate?: { id, name, code } }
type AttachedFormRow = {
    formTemplateId: string;
    formTemplate?: { id: string; name: string; code: string };
};

type AttachedDisplayRow = {
    formTemplateId: string;
    name: string;
    code: string;
};

export default function VisitTemplateDetailPage() {
    const { studyId, visitTemplateId } = useParams();
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState<string>("");

    if (!studyId || !visitTemplateId) {
        return <div className="text-sm text-neutral-400">Study / Visit Template seçilmedi.</div>;
    }

    const attachedQ = useQuery({
        queryKey: ["visitTemplateForms", studyId, visitTemplateId],
        queryFn: () => listAttachedForms(studyId, visitTemplateId),
    });

    const allFormsQ = useQuery({
        queryKey: ["formTemplates", studyId],
        queryFn: () => listFormTemplates(studyId),
    });

    const attachedRaw = useMemo(
        () => (attachedQ.data ?? []) as AttachedFormRow[],
        [attachedQ.data]
    );

    const allForms = useMemo(
        () => (allFormsQ.data ?? []) as FormTemplate[],
        [allFormsQ.data]
    );

    // allForms -> map (id -> FormTemplate)
    const allFormsMap = useMemo(() => {
        const m = new Map<string, FormTemplate>();
        for (const f of allForms) m.set(f.id, f);
        return m;
    }, [allForms]);

    // ✅ Attached listeyi ekranda göstereceğimiz hale çevir (name/code doldur)
    const attachedRows: AttachedDisplayRow[] = useMemo(() => {
        return attachedRaw.map((a) => {
            const embedded = a.formTemplate;
            const fromAll = allFormsMap.get(a.formTemplateId);

            return {
                formTemplateId: a.formTemplateId,
                name: embedded?.name ?? fromAll?.name ?? a.formTemplateId,
                code: embedded?.code ?? fromAll?.code ?? "-",
            };
        });
    }, [attachedRaw, allFormsMap]);

    // ✅ Dropdown’da zaten attached olanları göstermeyelim
    const attachedIdsSet = useMemo(() => {
        return new Set(attachedRaw.map((x) => x.formTemplateId));
    }, [attachedRaw]);

    const selectableForms = useMemo(() => {
        return allForms.filter((f) => !attachedIdsSet.has(f.id));
    }, [allForms, attachedIdsSet]);

    const attachMut = useMutation({
        mutationFn: (formTemplateId: string) =>
            attachFormToVisit(studyId, visitTemplateId, formTemplateId),
        onSuccess: async () => {
            setOpen(false);
            setSelectedFormId("");
            await qc.invalidateQueries({ queryKey: ["visitTemplateForms", studyId, visitTemplateId] });
            // allForms değişmez ama yine de gerekirse:
            // await qc.invalidateQueries({ queryKey: ["formTemplates", studyId] });
        },
    });

    const detachMut = useMutation({
        mutationFn: (formTemplateId: string) =>
            detachFormFromVisit(studyId, visitTemplateId, formTemplateId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["visitTemplateForms", studyId, visitTemplateId] });
        },
    });

    return (
        <div className="space-y-6">
            <div className="text-sm text-neutral-400">
                <Link className="hover:underline" to={`/studies/${studyId}/visit-templates`}>
                    Visit Templates
                </Link>{" "}
                / {visitTemplateId}
            </div>

            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">Visit Template Forms</div>
                    <div className="text-sm text-neutral-400">Bu visit template’e hangi formlar bağlı?</div>
                </div>

                <Button onClick={() => setOpen(true)}>+ Attach Form</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Attached Forms</div>
                </CardHeader>
                <CardContent>
                    {attachedQ.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {attachedQ.error && (
                        <div className="text-sm text-red-300">Hata: {(attachedQ.error as any).message}</div>
                    )}

                    {attachedRows.length > 0 ? (
                        <Table
                            columns={[
                                { header: "Name", key: "name" },
                                { header: "Code", key: "code" },
                                {
                                    header: "",
                                    key: "formTemplateId",
                                    render: (r: AttachedDisplayRow) => (
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                onClick={() => detachMut.mutate(r.formTemplateId)}
                                                disabled={detachMut.isPending}
                                            >
                                                Detach
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                            rows={attachedRows}
                        />
                    ) : (
                        !attachedQ.isLoading && (
                            <div className="text-sm text-neutral-400">Henüz attached form yok.</div>
                        )
                    )}
                </CardContent>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Attach Form Template">
                <div className="space-y-3">
                    <div className="text-sm text-neutral-300">Form seç</div>

                    {allFormsQ.isLoading && <div className="text-sm text-neutral-400">Formlar yükleniyor…</div>}
                    {allFormsQ.error && (
                        <div className="text-sm text-red-300">Hata: {(allFormsQ.error as any).message}</div>
                    )}

                    <select
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
                        value={selectedFormId}
                        onChange={(e) => setSelectedFormId(e.target.value)}
                    >
                        <option value="">Seçiniz…</option>
                        {selectableForms.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name} ({f.code})
                            </option>
                        ))}
                    </select>

                    {selectableForms.length === 0 && !allFormsQ.isLoading && (
                        <div className="text-xs text-neutral-500">
                            Tüm formlar zaten bu visit template’e bağlı.
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => attachMut.mutate(selectedFormId)}
                            disabled={!selectedFormId || attachMut.isPending}
                        >
                            Attach
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
