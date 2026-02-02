import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

export default function StudyDetailPage() {
    const { studyId } = useParams();
    if (!studyId) return null;

    return (
        <div className="space-y-6">
            <div className="text-sm text-neutral-400">
                <Link className="hover:underline" to="/studies">Studies</Link> / {studyId}
            </div>

            <div>
                <div className="text-2xl font-semibold">Study Detail</div>
                <div className="text-sm text-neutral-400">
                    Bu study altındaki şablonları ve subject akışını buradan yönet.
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">Visit Templates</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-neutral-300">
                            Gün / pencere (±) tanımları.
                        </div>
                        <Link
                            to={`/studies/${studyId}/visit-templates`}
                            className="mt-3 inline-block text-sm text-blue-300 hover:underline"
                        >
                            Open →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">Form Templates</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-neutral-300">
                            Form + field builder (text/number/date).
                        </div>
                        <Link
                            to={`/studies/${studyId}/form-templates`}
                            className="mt-3 inline-block text-sm text-blue-300 hover:underline"
                        >
                            Open →
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="text-sm text-neutral-400">Subjects</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-neutral-300">
                            Enrollment + scheduled visits generation.
                        </div>
                        <Link
                            to={`/studies/${studyId}/subjects`}
                            className="mt-3 inline-block text-sm text-blue-300 hover:underline"
                        >
                            Open →
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
