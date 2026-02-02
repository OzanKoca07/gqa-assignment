import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { getFormTemplate, type FormField } from "../api/formTemplates.api";
import { createSubmission, type SubmissionValue } from "../api/submissions.api";

function toIsoFromDateInput(v: string) {
    // input[type="date"] => "YYYY-MM-DD"
    // backend genelde ISO bekler
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "" : d.toISOString();
}

export default function FormEntryPage() {
    const { studyId, subjectId, scheduledVisitId, formTemplateId } = useParams();
    const qc = useQueryClient();

    if (!studyId || !subjectId || !scheduledVisitId || !formTemplateId) return null;

    const tplQ = useQuery({
        queryKey: ["formTemplate", studyId, formTemplateId],
        queryFn: () => getFormTemplate(studyId, formTemplateId),
        enabled: !!studyId && !!formTemplateId,
    });

    const fields = useMemo(
        () => ((tplQ.data?.fields ?? []) as FormField[]).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [tplQ.data]
    );

    // fieldId -> string
    const [values, setValues] = useState<Record<string, string>>({});
    const [clientError, setClientError] = useState<string | null>(null);

    const submitMut = useMutation({
        mutationFn: async () => {
            setClientError(null);

            // 1) required validation (client-side)
            const missing = fields.filter((f) => f.required && !(values[f.id] ?? "").trim());
            if (missing.length > 0) {
                throw new Error(`Zorunlu alan(lar) boş: ${missing.map((m) => m.label).join(", ")}`);
            }

            // 2) build payload: boş optional alanları göndermeyelim
            const payloadValues: SubmissionValue[] = [];

            for (const f of fields) {
                const raw = (values[f.id] ?? "").trim();

                // boş ve required değilse skip
                if (!raw && !f.required) continue;

                if (f.type === "NUMBER") {
                    const num = raw === "" ? null : Number(raw);
                    if (num !== null && Number.isNaN(num)) {
                        throw new Error(`${f.label} sayısal olmalı.`);
                    }
                    payloadValues.push({ formFieldId: f.id, valueNumber: num });
                    continue;
                }

                if (f.type === "DATE") {
                    const iso = raw ? toIsoFromDateInput(raw) : "";
                    if (raw && !iso) throw new Error(`${f.label} geçerli bir tarih olmalı.`);
                    payloadValues.push({ formFieldId: f.id, valueDate: iso || null });
                    continue;
                }

                // TEXT / default
                payloadValues.push({ formFieldId: f.id, valueText: raw });
            }

            return createSubmission(studyId, subjectId, scheduledVisitId, formTemplateId, {
                values: payloadValues,
            });
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["submissions", studyId, subjectId, scheduledVisitId] });
        },
        onError: (err: any) => {
            // createSubmission içindeki hata mesajını da burada göstereceğiz
            setClientError(err?.message ?? "Submit başarısız.");
        },
    });

    return (
        <div className="space-y-6">
            <div className="text-sm text-neutral-400">
                <Link
                    className="hover:underline"
                    to={`/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}`}
                >
                    Scheduled Visit
                </Link>{" "}
                / form / {formTemplateId}
            </div>

            <Card>
                <CardHeader>
                    <div className="text-lg font-semibold">{tplQ.data?.name ?? "Form"}</div>
                    <div className="text-sm text-neutral-400">code: {tplQ.data?.code ?? "-"}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {tplQ.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {tplQ.error && <div className="text-sm text-red-300">Hata: {(tplQ.error as any).message}</div>}

                    {!tplQ.isLoading && fields.length === 0 && (
                        <div className="text-sm text-neutral-400">Bu formda field yok.</div>
                    )}

                    {fields.length > 0 && (
                        <div className="space-y-3">
                            {fields.map((f) => (
                                <div key={f.id}>
                                    <div className="text-sm text-neutral-300 mb-1">
                                        {f.label} {f.required && <span className="text-xs text-amber-200">(required)</span>}
                                    </div>

                                    {f.type === "DATE" ? (
                                        <Input
                                            type="date"
                                            value={values[f.id] ?? ""}
                                            onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))}
                                        />
                                    ) : (
                                        <Input
                                            type={f.type === "NUMBER" ? "number" : "text"}
                                            value={values[f.id] ?? ""}
                                            onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))}
                                            placeholder={f.key}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end">
                        <Button
                            onClick={() => submitMut.mutate()}
                            disabled={submitMut.isPending || tplQ.isLoading || fields.length === 0}
                        >
                            {submitMut.isPending ? "Submitting..." : "Submit"}
                        </Button>
                    </div>

                    {clientError && <div className="text-sm text-red-300">Submit hata: {clientError}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
