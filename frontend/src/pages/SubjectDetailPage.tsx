import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table } from "../components/ui/Table";

import { getSubject, type Subject } from "../api/subjects.api";
import { listScheduledVisits, generateScheduledVisits, type ScheduledVisit } from "../api/subjects.api";

export default function SubjectDetailPage() {
    const { studyId, subjectId } = useParams();
    const qc = useQueryClient();

    if (!studyId || !subjectId) return null;

    const subjectQ = useQuery({
        queryKey: ["subject", studyId, subjectId],
        queryFn: () => getSubject(studyId, subjectId),
    });

    const visitsQ = useQuery({
        queryKey: ["scheduledVisits", studyId, subjectId],
        queryFn: () => listScheduledVisits(studyId, subjectId),
    });

    const generateMut = useMutation({
        mutationFn: () => generateScheduledVisits(studyId, subjectId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["scheduledVisits", studyId, subjectId] });
        },
    });

    const visits = useMemo(() => visitsQ.data ?? [], [visitsQ.data]);
    const subject = subjectQ.data as Subject | undefined;

    return (
        <div className="space-y-6">
            <div className="text-sm text-neutral-400">
                <Link className="hover:underline" to={`/studies/${studyId}/subjects`}>Subjects</Link> / {subjectId}
            </div>

            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">{subject?.subjectCode ?? "Subject"}</div>
                    <div className="text-sm text-neutral-400">
                        enrollment: {subject?.enrollmentDate ?? "-"}
                    </div>
                </div>

                <Button onClick={() => generateMut.mutate()} disabled={generateMut.isPending}>
                    Generate scheduled visits
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Scheduled Visits</div>
                </CardHeader>
                <CardContent>
                    {visitsQ.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {visitsQ.error && <div className="text-sm text-red-300">Hata: {(visitsQ.error as any).message}</div>}

                    {visits.length > 0 ? (
                        <Table
                            columns={[
                                { header: "Date", key: "scheduledDate" },
                                { header: "Status", key: "status" },
                                { header: "Visit Template", key: "visitTemplateId" },
                                {
                                    header: "",
                                    key: "id",
                                    render: (r: ScheduledVisit) => (
                                        <Link
                                            className="text-sm text-blue-300 hover:underline"
                                            to={`/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${r.id}`}
                                        >
                                            Open →
                                        </Link>
                                    ),
                                },
                            ]}
                            rows={visits}
                        />
                    ) : (
                        !visitsQ.isLoading && <div className="text-sm text-neutral-400">Henüz scheduled visit yok.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
