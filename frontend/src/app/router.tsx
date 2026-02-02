import { createBrowserRouter, redirect } from "react-router-dom";
import { isAuthed } from "./auth";
import AppShell from "./layout/AppShell";
import VisitTemplateDetailPage from "../pages/VisitTemplateDetailPage";


import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudiesPage from "../pages/StudiesPage";
import StudyDetailPage from "../pages/StudyDetailPage";
import VisitTemplatesPage from "../pages/VisitTemplatesPage";
import FormTemplatesPage from "../pages/FormTemplatesPage";
import FormTemplateDetailPage from "../pages/FormTemplateDetailPage";
import SubjectsPage from "../pages/SubjectsPage";
import SubjectDetailPage from "../pages/SubjectDetailPage";
import ScheduledVisitPage from "../pages/ScheduledVisitPage";
import FormEntryPage from "../pages/FormEntryPage";

function requireAuth() {
    if (!isAuthed()) throw redirect("/login");
    return null;
}

export const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },

    {
        path: "/",
        loader: requireAuth,
        element: <AppShell />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "studies/:studyId/visit-templates/:visitTemplateId", element: <VisitTemplateDetailPage /> },

            { path: "studies", element: <StudiesPage /> },
            { path: "studies/:studyId", element: <StudyDetailPage /> },
            { path: "studies/:studyId/visit-templates", element: <VisitTemplatesPage /> },
            { path: "studies/:studyId/form-templates", element: <FormTemplatesPage /> },
            { path: "studies/:studyId/form-templates/:formTemplateId", element: <FormTemplateDetailPage /> },
            { path: "studies/:studyId/subjects", element: <SubjectsPage /> },
            { path: "studies/:studyId/subjects/:subjectId", element: <SubjectDetailPage /> },
            { path: "studies/:studyId/subjects/:subjectId/scheduled-visits/:scheduledVisitId", element: <ScheduledVisitPage /> },
            { path: "studies/:studyId/subjects/:subjectId/scheduled-visits/:scheduledVisitId/forms/:formTemplateId", element: <FormEntryPage /> },
        ],
    },
]);
