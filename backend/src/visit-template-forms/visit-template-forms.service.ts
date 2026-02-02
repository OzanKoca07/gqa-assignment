import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttachFormDto } from './dto/attach-form.dto';

@Injectable()
export class VisitTemplateFormsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertVisitTemplateInStudy(studyId: string, visitTemplateId: string) {
    const vt = await this.prisma.visitTemplate.findFirst({
      where: { id: visitTemplateId, studyId },
      select: { id: true },
    });
    if (!vt) throw new NotFoundException('VisitTemplate not found for this study.');
  }

  private async assertFormTemplateInStudy(studyId: string, formTemplateId: string) {
    const ft = await this.prisma.formTemplate.findFirst({
      where: { id: formTemplateId, studyId },
      select: { id: true },
    });
    if (!ft) throw new NotFoundException('FormTemplate not found for this study.');
  }

  async attach(studyId: string, visitTemplateId: string, dto: AttachFormDto) {
    await this.assertVisitTemplateInStudy(studyId, visitTemplateId);
    await this.assertFormTemplateInStudy(studyId, dto.formTemplateId);

    try {
      return await this.prisma.visitTemplateForm.create({
        data: {
          visitTemplateId,
          formTemplateId: dto.formTemplateId,
        },
      });
    } catch (e: any) {
      // Unique constraint → aynı attach tekrar denenirse
      if (e?.code === 'P2002') {
        throw new BadRequestException('This form is already attached to this visit template.');
      }
      throw e;
    }
  }

  async listAttachedForms(studyId: string, visitTemplateId: string) {
    await this.assertVisitTemplateInStudy(studyId, visitTemplateId);

    // İstersen sadece join tabloyu döndür, istersen formTemplate detayını include et.
    return this.prisma.visitTemplateForm.findMany({
      where: { visitTemplateId },
      include: {
        formTemplate: {
          include: { fields: true }, // istersen kapatabilirsin
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async detach(studyId: string, visitTemplateId: string, formTemplateId: string) {
    await this.assertVisitTemplateInStudy(studyId, visitTemplateId);
    await this.assertFormTemplateInStudy(studyId, formTemplateId);

    const existing = await this.prisma.visitTemplateForm.findFirst({
      where: { visitTemplateId, formTemplateId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Attachment not found.');

    return this.prisma.visitTemplateForm.delete({ where: { id: existing.id } });
  }
}
