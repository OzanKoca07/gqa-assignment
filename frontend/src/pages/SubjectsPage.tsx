import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";

import { listSubjects, createSubject, type Subject } from "../api/subjects.api";

export default function SubjectsPage() {
    const { studyId } = useParams();
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);

    const [subjectCode, setSubjectCode] = useState("");
    const [enrollmentDate, setEnrollmentDate] = useState("2026-02-01"); // yyyy-mm-dd

    const q = useQuery({
        queryKey: ["subjects", studyId],
        queryFn: () => listSubjects(studyId as string),
        enabled: !!studyId,
    });

    // ✅ BURAYA EKLE (hook'lardan sonra, return'dan önce)
    if (!studyId) {
        return <div className="text-sm text-neutral-400">Study seçilmedi.</div>;
    }

    const rows = useMemo(() => q.data ?? [], [q.data]);

    const createMut = useMutation({
        mutationFn: () =>
            createSubject(studyId as string, {
                subjectCode,
                enrollmentDate: new Date(enrollmentDate).toISOString(),
            }),
        onSuccess: async () => {
            setOpen(false);
            setSubjectCode("");
            // istersen tarihi resetleme:
            // setEnrollmentDate("2026-02-01");
            await qc.invalidateQueries({ queryKey: ["subjects", studyId] });
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold">Subjects</div>
                    <div className="text-sm text-neutral-400">studyId: {studyId}</div>
                </div>
                <Button onClick={() => setOpen(true)}>+ New Subject</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="text-sm text-neutral-400">Subjects list</div>
                </CardHeader>
                <CardContent>
                    {q.isLoading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
                    {q.error && <div className="text-sm text-red-300">Hata: {(q.error as any).message}</div>}

                    {rows.length > 0 ? (
                        <Table
                            columns={[
                                { header: "Subject Code", key: "subjectCode" },
                                { header: "Enrollment", key: "enrollmentDate" },
                                {
                                    header: "",
                                    key: "id",
                                    render: (r: Subject) => (
                                        <Link
                                            className="text-sm text-blue-300 hover:underline"
                                            to={`/studies/${studyId}/subjects/${r.id}`}
                                        >
                                            Open →
                                        </Link>
                                    ),
                                },
                            ]}
                            rows={rows}
                        />
                    ) : (
                        !q.isLoading && <div className="text-sm text-neutral-400">Henüz subject yok.</div>
                    )}
                </CardContent>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Create Subject">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Subject Code</div>
                        <Input
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            placeholder="SUBJ-001"
                        />
                    </div>

                    <div>
                        <div className="text-sm text-neutral-300 mb-1">Enrollment Date</div>
                        <Input
                            value={enrollmentDate}
                            onChange={(e) => setEnrollmentDate(e.target.value)}
                            placeholder="2026-02-01"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => createMut.mutate()} disabled={createMut.isPending}>
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
