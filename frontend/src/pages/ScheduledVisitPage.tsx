import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

import { getScheduledVisit } from "../api/subjects.api";
import { listVisitTemplateForms, type VisitTemplateForm } from "../api/visitTemplateForms.api";
import { listSubmissions, type Submission } from "../api/submissions.api"; // sende bu dosya var

export default function ScheduledVisitPage() {
    const { studyId, subjectId, scheduledVisitId } = useParams();

    // 1) scheduled visit detail
    const visitQ = useQuery({
        queryKey: ["scheduledVisit", studyId, subjectId, scheduledVisitId],
        queryFn: () => getScheduledVisit(studyId as string, subjectId as string, scheduledVisitId as string),
        enabled: !!studyId && !!subjectId && !!scheduledVisitId,
    });

    const visit = visitQ.data;

    // 2) available forms (visitTemplateId üzerinden)
    const formsQ = useQuery({
        queryKey: ["visitTemplateForms", studyId, visit?.visitTemplateId],
        queryFn: () => listVisitTemplateForms(studyId as string, visit!.visitTemplateId),
        enabled: !!studyId && !!visit?.visitTemplateId,
    });

    // 3) submissions list
    const subsQ = useQuery({
        queryKey: ["submissions", studyId, subjectId, scheduledVisitId],
        queryFn: () => listSubmissions(studyId as string, subjectId as string, scheduledVisitId as string),
        enabled: !!studyId && !!subjectId && !!scheduledVisitId,
    });

    const forms = useMemo(() => formsQ.data ?? [], [formsQ.data]);
    const submissions = useMemo(() => subsQ.data ?? [], [subsQ.data]);

    if (!studyId || !subjectId || !scheduledVisitId) {
        return <div className="text-sm text-neutral-400">Parametreler eksik.</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="text-xl font-semibold">Scheduled Visit</div>
                    <div className="text-sm text-neutral-400">
                        date: {visit?.scheduledDate ?? "-"} • status:{" "}
                        <Badge>{visit?.status ?? "-"}</Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Available Forms */}
                    <div className="space-y-2">
                        <div className="text-sm text-neutral-400">Available Forms</div>

                        {formsQ.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                        {formsQ.error && <div className="text-sm text-red-300">Hata: {(formsQ.error as any).message}</div>}

                        {forms.length === 0 && !formsQ.isLoading && (
                            <div className="text-sm text-neutral-400">Bu visit’e form attach edilmemiş.</div>
                        )}

                        {forms.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {forms.map((f: VisitTemplateForm) => {
                                    const ft = f.formTemplate;
                                    const formTemplateId = ft?.id ?? f.formTemplateId;

                                    const title = ft?.name ?? `Form ${formTemplateId.slice(0, 6)}…`;
                                    const code = ft?.code ?? "-";

                                    return (
                                        <Link
                                            key={formTemplateId}
                                            to={`/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}/forms/${formTemplateId}`}
                                            className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4 hover:bg-neutral-900/30 transition"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="font-medium">{title}</div>
                                                    <div className="text-xs text-neutral-400">code: {code}</div>
                                                </div>
                                                <div className="text-sm text-blue-300">Open →</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Submissions */}
                    <div className="space-y-2">
                        <div className="text-sm text-neutral-400">Submissions</div>

                        {subsQ.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                        {subsQ.error && <div className="text-sm text-red-300">Hata: {(subsQ.error as any).message}</div>}

                        {submissions.length === 0 && !subsQ.isLoading && (
                            <div className="text-sm text-neutral-400">Henüz submission yok.</div>
                        )}

                        {submissions.length > 0 && (
                            <div className="space-y-2">
                                {submissions.map((s: Submission) => (
                                    <div key={s.id} className="rounded-xl border border-neutral-900 bg-neutral-950/40 p-3 text-sm">
                                        <div className="text-neutral-200">submittedAt: {s.submittedAt}</div>
                                        <div className="text-xs text-neutral-400">formTemplateId: {s.formTemplateId}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
