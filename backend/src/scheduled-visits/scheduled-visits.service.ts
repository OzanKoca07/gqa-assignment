import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

@Injectable()
export class ScheduledVisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateForSubject(studyId: string, subjectId: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId, studyId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    const visitTemplates = await this.prisma.visitTemplate.findMany({
      where: { studyId },
      orderBy: { day: 'asc' },
    });

    // Idempotent: @@unique([subjectId, visitTemplateId]) var, upsert ile tekrar çalıştırılabilir.
    const createdOrUpdated = await this.prisma.$transaction(
      visitTemplates.map((vt) =>
        this.prisma.scheduledVisit.upsert({
          where: {
            subjectId_visitTemplateId: {
              subjectId,
              visitTemplateId: vt.id,
            },
          },
          create: {
            subjectId,
            visitTemplateId: vt.id,
            scheduledDate: addDays(subject.enrollmentDate, vt.day),
            // status default schema'da var
          },
          update: {
            // enrollmentDate değişmişse schedule güncellensin istiyorsan:
            scheduledDate: addDays(subject.enrollmentDate, vt.day),
          },
        }),
      ),
    );

    return createdOrUpdated;
  }

  async listForSubject(studyId: string, subjectId: string) {
    // subject doğrulama
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId, studyId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    return this.prisma.scheduledVisit.findMany({
      where: { subjectId },
      orderBy: { scheduledDate: 'asc' },
      include: {
        visitTemplate: {
          include: {
            attachedForms: {
              include: {
                formTemplate: {
                  include: {
                    fields: { orderBy: { order: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getOne(studyId: string, subjectId: string, scheduledVisitId: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId, studyId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    const sv = await this.prisma.scheduledVisit.findFirst({
      where: { id: scheduledVisitId, subjectId },
      include: {
        visitTemplate: {
          include: {
            attachedForms: {
              include: {
                formTemplate: {
                  include: {
                    fields: { orderBy: { order: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sv) throw new NotFoundException('Scheduled visit not found');
    return sv;
  }
}
