-- CreateEnum
CREATE TYPE "StudyStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'NUMBER', 'DATE');

-- CreateTable
CREATE TABLE "Study" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "protocolCode" TEXT NOT NULL,
    "status" "StudyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitTemplate" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "windowBefore" INTEGER NOT NULL DEFAULT 0,
    "windowAfter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitTemplateForm" (
    "id" TEXT NOT NULL,
    "visitTemplateId" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitTemplateForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledVisit" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "visitTemplateId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "scheduledVisitId" TEXT NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmissionFieldValue" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL,
    "valueText" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueDate" TIMESTAMP(3),

    CONSTRAINT "FormSubmissionFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Study_protocolCode_key" ON "Study"("protocolCode");

-- CreateIndex
CREATE INDEX "Study_status_idx" ON "Study"("status");

-- CreateIndex
CREATE INDEX "VisitTemplate_studyId_day_idx" ON "VisitTemplate"("studyId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "VisitTemplate_studyId_code_key" ON "VisitTemplate"("studyId", "code");

-- CreateIndex
CREATE INDEX "FormTemplate_studyId_idx" ON "FormTemplate"("studyId");

-- CreateIndex
CREATE UNIQUE INDEX "FormTemplate_studyId_code_key" ON "FormTemplate"("studyId", "code");

-- CreateIndex
CREATE INDEX "FormField_formTemplateId_order_idx" ON "FormField"("formTemplateId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FormField_formTemplateId_key_key" ON "FormField"("formTemplateId", "key");

-- CreateIndex
CREATE INDEX "VisitTemplateForm_formTemplateId_idx" ON "VisitTemplateForm"("formTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitTemplateForm_visitTemplateId_formTemplateId_key" ON "VisitTemplateForm"("visitTemplateId", "formTemplateId");

-- CreateIndex
CREATE INDEX "Subject_studyId_enrollmentDate_idx" ON "Subject"("studyId", "enrollmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_studyId_subjectCode_key" ON "Subject"("studyId", "subjectCode");

-- CreateIndex
CREATE INDEX "ScheduledVisit_subjectId_scheduledDate_idx" ON "ScheduledVisit"("subjectId", "scheduledDate");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledVisit_subjectId_visitTemplateId_key" ON "ScheduledVisit"("subjectId", "visitTemplateId");

-- CreateIndex
CREATE INDEX "FormSubmission_formTemplateId_idx" ON "FormSubmission"("formTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_scheduledVisitId_formTemplateId_key" ON "FormSubmission"("scheduledVisitId", "formTemplateId");

-- CreateIndex
CREATE INDEX "FormSubmissionFieldValue_formFieldId_idx" ON "FormSubmissionFieldValue"("formFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmissionFieldValue_submissionId_formFieldId_key" ON "FormSubmissionFieldValue"("submissionId", "formFieldId");

-- AddForeignKey
ALTER TABLE "VisitTemplate" ADD CONSTRAINT "VisitTemplate_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTemplate" ADD CONSTRAINT "FormTemplate_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitTemplateForm" ADD CONSTRAINT "VisitTemplateForm_visitTemplateId_fkey" FOREIGN KEY ("visitTemplateId") REFERENCES "VisitTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitTemplateForm" ADD CONSTRAINT "VisitTemplateForm_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledVisit" ADD CONSTRAINT "ScheduledVisit_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledVisit" ADD CONSTRAINT "ScheduledVisit_visitTemplateId_fkey" FOREIGN KEY ("visitTemplateId") REFERENCES "VisitTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_scheduledVisitId_fkey" FOREIGN KEY ("scheduledVisitId") REFERENCES "ScheduledVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionFieldValue" ADD CONSTRAINT "FormSubmissionFieldValue_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionFieldValue" ADD CONSTRAINT "FormSubmissionFieldValue_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
