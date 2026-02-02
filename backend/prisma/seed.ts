import { PrismaClient, FieldType, StudyStatus } from "@prisma/client";

const prisma = new PrismaClient();

function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

async function main() {
    console.log("🌱 Seeding database...");

    // 1) Study
    const study = await prisma.study.upsert({
        where: { protocolCode: "DEMO-001" },
        update: {
            name: "Demo Study",
            status: StudyStatus.ACTIVE,
        },
        create: {
            name: "Demo Study",
            protocolCode: "DEMO-001",
            status: StudyStatus.ACTIVE,
        },
    });

    // 2) Visit Templates
    const v1 = await prisma.visitTemplate.upsert({
        where: { studyId_code: { studyId: study.id, code: "V1" } },
        update: {
            name: "Visit 1",
            day: 1,
            windowBefore: 0,
            windowAfter: 0,
        },
        create: {
            studyId: study.id,
            name: "Visit 1",
            code: "V1",
            day: 1,
            windowBefore: 0,
            windowAfter: 0,
        },
    });

    const v7 = await prisma.visitTemplate.upsert({
        where: { studyId_code: { studyId: study.id, code: "V7" } },
        update: {
            name: "Visit 7",
            day: 7,
            windowBefore: 1,
            windowAfter: 2,
        },
        create: {
            studyId: study.id,
            name: "Visit 7",
            code: "V7",
            day: 7,
            windowBefore: 1,
            windowAfter: 2,
        },
    });

    // 3) Form Templates
    const vitals = await prisma.formTemplate.upsert({
        where: { studyId_code: { studyId: study.id, code: "VITALS" } },
        update: { name: "Vitals" },
        create: {
            studyId: study.id,
            name: "Vitals",
            code: "VITALS",
        },
    });

    const labs = await prisma.formTemplate.upsert({
        where: { studyId_code: { studyId: study.id, code: "LABS" } },
        update: { name: "Labs" },
        create: {
            studyId: study.id,
            name: "Labs",
            code: "LABS",
        },
    });

    // 4) Fields for Vitals
    // Unique: @@unique([formTemplateId, key]) so we upsert by that composite constraint
    // Prisma "where" for composite unique uses generated name: formTemplateId_key
    const tempField = await prisma.formField.upsert({
        where: { formTemplateId_key: { formTemplateId: vitals.id, key: "temperature" } },
        update: {
            label: "Temperature (°C)",
            type: FieldType.NUMBER,
            required: true,
            order: 1,
        },
        create: {
            formTemplateId: vitals.id,
            label: "Temperature (°C)",
            key: "temperature",
            type: FieldType.NUMBER,
            required: true,
            order: 1,
        },
    });

    const noteField = await prisma.formField.upsert({
        where: { formTemplateId_key: { formTemplateId: vitals.id, key: "notes" } },
        update: {
            label: "Notes",
            type: FieldType.TEXT,
            required: false,
            order: 2,
        },
        create: {
            formTemplateId: vitals.id,
            label: "Notes",
            key: "notes",
            type: FieldType.TEXT,
            required: false,
            order: 2,
        },
    });

    const visitDateField = await prisma.formField.upsert({
        where: { formTemplateId_key: { formTemplateId: vitals.id, key: "visit_date" } },
        update: {
            label: "Visit Date",
            type: FieldType.DATE,
            required: true,
            order: 3,
        },
        create: {
            formTemplateId: vitals.id,
            label: "Visit Date",
            key: "visit_date",
            type: FieldType.DATE,
            required: true,
            order: 3,
        },
    });

    // 5) Fields for Labs
    await prisma.formField.upsert({
        where: { formTemplateId_key: { formTemplateId: labs.id, key: "hemoglobin" } },
        update: {
            label: "Hemoglobin",
            type: FieldType.NUMBER,
            required: false,
            order: 1,
        },
        create: {
            formTemplateId: labs.id,
            label: "Hemoglobin",
            key: "hemoglobin",
            type: FieldType.NUMBER,
            required: false,
            order: 1,
        },
    });

    await prisma.formField.upsert({
        where: { formTemplateId_key: { formTemplateId: labs.id, key: "collection_date" } },
        update: {
            label: "Collection Date",
            type: FieldType.DATE,
            required: true,
            order: 2,
        },
        create: {
            formTemplateId: labs.id,
            label: "Collection Date",
            key: "collection_date",
            type: FieldType.DATE,
            required: true,
            order: 2,
        },
    });

    // 6) Attach forms to visits
    // Unique: @@unique([visitTemplateId, formTemplateId])
    await prisma.visitTemplateForm.upsert({
        where: { visitTemplateId_formTemplateId: { visitTemplateId: v1.id, formTemplateId: vitals.id } },
        update: {},
        create: { visitTemplateId: v1.id, formTemplateId: vitals.id },
    });

    await prisma.visitTemplateForm.upsert({
        where: { visitTemplateId_formTemplateId: { visitTemplateId: v1.id, formTemplateId: labs.id } },
        update: {},
        create: { visitTemplateId: v1.id, formTemplateId: labs.id },
    });

    await prisma.visitTemplateForm.upsert({
        where: { visitTemplateId_formTemplateId: { visitTemplateId: v7.id, formTemplateId: vitals.id } },
        update: {},
        create: { visitTemplateId: v7.id, formTemplateId: vitals.id },
    });

    // 7) Subject
    const enrollmentDate = new Date("2026-02-01T00:00:00.000Z");

    const subject = await prisma.subject.upsert({
        where: { studyId_subjectCode: { studyId: study.id, subjectCode: "SUBJ-001" } },
        update: { enrollmentDate },
        create: {
            studyId: study.id,
            subjectCode: "SUBJ-001",
            enrollmentDate,
        },
    });

    // 8) Scheduled visits (day offset from enrollment)
    const sv1 = await prisma.scheduledVisit.upsert({
        where: { subjectId_visitTemplateId: { subjectId: subject.id, visitTemplateId: v1.id } },
        update: {
            scheduledDate: addDays(enrollmentDate, v1.day),
            status: "SCHEDULED",
        },
        create: {
            subjectId: subject.id,
            visitTemplateId: v1.id,
            scheduledDate: addDays(enrollmentDate, v1.day),
            status: "SCHEDULED",
        },
    });

    const sv7 = await prisma.scheduledVisit.upsert({
        where: { subjectId_visitTemplateId: { subjectId: subject.id, visitTemplateId: v7.id } },
        update: {
            scheduledDate: addDays(enrollmentDate, v7.day),
            status: "SCHEDULED",
        },
        create: {
            subjectId: subject.id,
            visitTemplateId: v7.id,
            scheduledDate: addDays(enrollmentDate, v7.day),
            status: "SCHEDULED",
        },
    });

    // 9) Example submission (Vitals on scheduled visit V1)
    // Unique: @@unique([scheduledVisitId, formTemplateId])
    const submission = await prisma.formSubmission.upsert({
        where: { scheduledVisitId_formTemplateId: { scheduledVisitId: sv1.id, formTemplateId: vitals.id } },
        update: {},
        create: {
            scheduledVisitId: sv1.id,
            formTemplateId: vitals.id,
        },
    });

    // Values (unique per submissionId + formFieldId)
    await prisma.formSubmissionFieldValue.upsert({
        where: { submissionId_formFieldId: { submissionId: submission.id, formFieldId: tempField.id } },
        update: { valueNumber: 37.2 },
        create: {
            submissionId: submission.id,
            formFieldId: tempField.id,
            valueNumber: 37.2,
        },
    });

    await prisma.formSubmissionFieldValue.upsert({
        where: { submissionId_formFieldId: { submissionId: submission.id, formFieldId: noteField.id } },
        update: { valueText: "Patient feels good." },
        create: {
            submissionId: submission.id,
            formFieldId: noteField.id,
            valueText: "Patient feels good.",
        },
    });

    await prisma.formSubmissionFieldValue.upsert({
        where: { submissionId_formFieldId: { submissionId: submission.id, formFieldId: visitDateField.id } },
        update: { valueDate: sv1.scheduledDate },
        create: {
            submissionId: submission.id,
            formFieldId: visitDateField.id,
            valueDate: sv1.scheduledDate,
        },
    });

    console.log("✅ Seed completed!");
    console.log({
        studyId: study.id,
        subjectId: subject.id,
        visitTemplateIds: { v1: v1.id, v7: v7.id },
        formTemplateIds: { vitals: vitals.id, labs: labs.id },
        scheduledVisitIds: { sv1: sv1.id, sv7: sv7.id },
    });
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
