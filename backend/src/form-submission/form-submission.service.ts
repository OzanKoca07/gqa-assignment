import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';

@Injectable()
export class FormSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseISODate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) throw new BadRequestException('valueDate must be a valid ISO date');
    return d;
  }

  async create(
    studyId: string,
    subjectId: string,
    scheduledVisitId: string,
    formTemplateId: string,
    dto: CreateFormSubmissionDto,
  ) {
    // 1) ScheduledVisit doğrula (subject + study)
    const scheduledVisit = await this.prisma.scheduledVisit.findFirst({
      where: {
        id: scheduledVisitId,
        subjectId,
        subject: { studyId },
      },
      include: { visitTemplate: true },
    });
    if (!scheduledVisit) throw new NotFoundException('Scheduled visit not found');

    // 2) Bu form, visitTemplate’e attach edilmiş mi?
    const attached = await this.prisma.visitTemplateForm.findFirst({
      where: {
        visitTemplateId: scheduledVisit.visitTemplateId,
        formTemplateId,
      },
    });
    if (!attached) throw new BadRequestException('Form template is not attached to this visit template');

    // 3) FormTemplate + fields çek
    const formTemplate = await this.prisma.formTemplate.findFirst({
      where: { id: formTemplateId, studyId },
      include: { fields: true },
    });
    if (!formTemplate) throw new NotFoundException('Form template not found');

    // 4) values doğrula: field id’ler bu form’a ait mi? required alanlar var mı? type uyumu?
    const fieldById = new Map(formTemplate.fields.map((f) => [f.id, f]));
    const seen = new Set<string>();

    for (const v of dto.values) {
      if (!fieldById.has(v.formFieldId)) {
        throw new BadRequestException(`Field ${v.formFieldId} does not belong to this form template`);
      }
      if (seen.has(v.formFieldId)) {
        throw new BadRequestException(`Duplicate value for field ${v.formFieldId}`);
      }
      seen.add(v.formFieldId);

      const field = fieldById.get(v.formFieldId)!;

      // Tip kontrolü: TEXT/NUMBER/DATE
      if (field.type === 'TEXT') {
        if (v.valueText === undefined || v.valueText === '') {
          if (field.required) throw new BadRequestException(`Field ${field.key} is required`);
        }
        if (v.valueNumber !== undefined || v.valueDate !== undefined) {
          throw new BadRequestException(`Field ${field.key} expects TEXT`);
        }
      }

      if (field.type === 'NUMBER') {
        if (v.valueNumber === undefined) {
          if (field.required) throw new BadRequestException(`Field ${field.key} is required`);
        } else if (typeof v.valueNumber !== 'number' || Number.isNaN(v.valueNumber)) {
          throw new BadRequestException(`Field ${field.key} expects NUMBER`);
        }
        if (v.valueText !== undefined || v.valueDate !== undefined) {
          throw new BadRequestException(`Field ${field.key} expects NUMBER`);
        }
      }

      if (field.type === 'DATE') {
        if (v.valueDate === undefined) {
          if (field.required) throw new BadRequestException(`Field ${field.key} is required`);
        } else {
          this.parseISODate(v.valueDate);
        }
        if (v.valueText !== undefined || v.valueNumber !== undefined) {
          throw new BadRequestException(`Field ${field.key} expects DATE`);
        }
      }
    }

    // required ama hiç gönderilmemiş field var mı?
    for (const f of formTemplate.fields) {
      if (f.required && !seen.has(f.id)) {
        throw new BadRequestException(`Field ${f.key} is required`);
      }
    }

    // 5) Transaction: submission + field values
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const submission = await tx.formSubmission.create({
          data: {
            scheduledVisitId,
            formTemplateId,
          },
        });

        // values insert
        await tx.formSubmissionFieldValue.createMany({
          data: dto.values.map((v) => {
            const field = fieldById.get(v.formFieldId)!;
            return {
              submissionId: submission.id,
              formFieldId: v.formFieldId,
              valueText: field.type === 'TEXT' ? (v.valueText ?? null) : null,
              valueNumber: field.type === 'NUMBER' ? (v.valueNumber ?? null) : null,
              valueDate: field.type === 'DATE' ? (v.valueDate ? this.parseISODate(v.valueDate) : null) : null,
            };
          }),
        });

        return tx.formSubmission.findUnique({
          where: { id: submission.id },
          include: {
            formTemplate: { include: { fields: { orderBy: { order: 'asc' } } } },
            values: { include: { formField: true } },
          },
        });
      });

      return created;
    } catch (e: any) {
      // Unique constraint: same scheduledVisitId + formTemplateId
      if (e?.code === 'P2002') {
        throw new BadRequestException('This form has already been submitted for this scheduled visit');
      }
      throw e;
    }
  }

  async listForScheduledVisit(studyId: string, subjectId: string, scheduledVisitId: string) {
    // scheduledVisit doğrulama
    const sv = await this.prisma.scheduledVisit.findFirst({
      where: { id: scheduledVisitId, subjectId, subject: { studyId } },
    });
    if (!sv) throw new NotFoundException('Scheduled visit not found');

    return this.prisma.formSubmission.findMany({
      where: { scheduledVisitId },
      orderBy: { submittedAt: 'desc' },
      include: {
        formTemplate: true,
        values: { include: { formField: true } },
      },
    });
  }

  async getOne(studyId: string, subjectId: string, scheduledVisitId: string, submissionId: string) {
    const sv = await this.prisma.scheduledVisit.findFirst({
      where: { id: scheduledVisitId, subjectId, subject: { studyId } },
    });
    if (!sv) throw new NotFoundException('Scheduled visit not found');

    const submission = await this.prisma.formSubmission.findFirst({
      where: { id: submissionId, scheduledVisitId },
      include: {
        formTemplate: { include: { fields: { orderBy: { order: 'asc' } } } },
        values: { include: { formField: true } },
      },
    });

    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }
}
