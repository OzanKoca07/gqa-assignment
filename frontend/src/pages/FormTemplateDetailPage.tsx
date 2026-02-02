import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";

import { getFormTemplate, createFormField } from "../api/formTemplates.api";
import type { FormTemplateWithFields, FormField } from "../api/formTemplates.api";

type FieldDto = {
    label: string;
    key: string;
    type: "TEXT" | "NUMBER" | "DATE";
    required: boolean;
    order: number;
};

export default function FormTemplateDetailPage() {
    const { studyId, formTemplateId } = useParams();
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);

    const [field, setField] = useState<FieldDto>({
        label: "",
        key: "",
        type: "TEXT",
        required: false,
        order: 0,
    });

    const hasParams = Boolean(studyId && formTemplateId);

    const q = useQuery({
        queryKey: ["formTemplate", studyId, formTemplateId],
        queryFn: () => getFormTemplate(studyId as string, formTemplateId as string),
        enabled: hasParams, // ✅ params yoksa request atma
    });

    const tpl = q.data as FormTemplateWithFields | undefined;
    const fields = useMemo(() => tpl?.fields ?? [], [tpl]);

    const addFieldMut = useMutation({
        mutationFn: (dto: FieldDto) =>
            createFormField(studyId as string, formTemplateId as string, dto),
        onSuccess: async () => {
            setOpen(false);
            setField({ label: "", key: "", type: "TEXT", required: false, order: 0 });
            await qc.invalidateQueries({
                queryKey: ["formTemplate", studyId, formTemplateId],
            });
        },
    });

    // ✅ Hooks'tan sonra koşullu render yapabiliriz
    if (!hasParams) {
        return (
            <div className="text-sm text-neutral-400">
                Missing route params: studyId / formTemplateId
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-sm text-neutral-400">
                <Link className="hover:underline" to={`/studies/${studyId}/form-templates`}>
                    Form Templates
                </Link>{" "}
                / {formTemplateId}
            </div>

            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">{tpl?.name ?? "Form Template"}</div>
                    <div className="text-sm text-neutral-400">code: {tpl?.code ?? "-"}</div>
                </div>
                <Button onClick={() => setOpen(true)}>+ Add Field</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Fields</div>
                </CardHeader>
                <CardContent>
                    {q.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {q.error && (
                        <div className="text-sm text-red-300">
                            Hata: {(q.error as Error).message}
                        </div>
                    )}

                    {fields.length > 0 ? (
                        <Table<FormField>
                            columns={[
                                { header: "Label", key: "label" },
                                { header: "Key", key: "key" },
                                {
                                    header: "Type",
                                    key: "type",
                                    render: (r) => <Badge>{r.type}</Badge>,
                                },
                                {
                                    header: "Req",
                                    key: "required",
                                    render: (r) =>
                                        r.required ? (
                                            <Badge variant="success">Yes</Badge>
                                        ) : (
                                            <Badge>No</Badge>
                                        ),
                                },
                                { header: "Order", key: "order" },
                            ]}
                            rows={fields}
                        />
                    ) : (
                        !q.isLoading && (
                            <div className="text-sm text-neutral-400">Bu formda field yok.</div>
                        )
                    )}
                </CardContent>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Add Field">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Label</div>
                        <Input
                            value={field.label}
                            onChange={(e) => setField({ ...field, label: e.target.value })}
                            placeholder="Systolic BP"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Key</div>
                            <Input
                                value={field.key}
                                onChange={(e) => setField({ ...field, key: e.target.value })}
                                placeholder="systolic_bp"
                            />
                        </div>

                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Order</div>
                            <Input
                                value={String(field.order)}
                                onChange={(e) =>
                                    setField({ ...field, order: Number(e.target.value) || 0 })
                                }
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-sm text-neutral-300 mb-1">Type</div>
                            <select
                                aria-label="Field type"
                                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
                                value={field.type}
                                onChange={(e) =>
                                    setField({ ...field, type: e.target.value as FieldDto["type"] })
                                }
                            >
                                <option value="TEXT">TEXT</option>
                                <option value="NUMBER">NUMBER</option>
                                <option value="DATE">DATE</option>
                            </select>
                        </div>

                        <label className="flex items-end gap-2 text-sm text-neutral-300">
                            <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={field.required}
                                onChange={(e) => setField({ ...field, required: e.target.checked })}
                            />
                            Required
                        </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => addFieldMut.mutate(field)}
                            disabled={addFieldMut.isPending}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
