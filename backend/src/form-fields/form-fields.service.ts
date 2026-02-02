import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';

@Injectable()
export class FormFieldsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertFormTemplate(studyId: string, formTemplateId: string) {
    const ft = await this.prisma.formTemplate.findFirst({
      where: { id: formTemplateId, studyId },
    });
    if (!ft) throw new NotFoundException('FormTemplate not found');
    return ft;
  }

  async create(studyId: string, formTemplateId: string, dto: CreateFormFieldDto) {
    await this.assertFormTemplate(studyId, formTemplateId);

    return this.prisma.formField.create({
      data: {
        formTemplateId,
        label: dto.label,
        key: dto.key,
        type: dto.type,
        required: dto.required ?? false,
        order: dto.order ?? 0,
      },
    });
  }

  async findAll(studyId: string, formTemplateId: string) {
    await this.assertFormTemplate(studyId, formTemplateId);

    return this.prisma.formField.findMany({
      where: { formTemplateId },
      orderBy: [{ order: 'asc' }, { key: 'asc' }],
    });
  }

  async findOne(studyId: string, formTemplateId: string, fieldId: string) {
    await this.assertFormTemplate(studyId, formTemplateId);

    const field = await this.prisma.formField.findFirst({
      where: { id: fieldId, formTemplateId },
    });
    if (!field) throw new NotFoundException('FormField not found');
    return field;
  }

  async update(studyId: string, formTemplateId: string, fieldId: string, dto: UpdateFormFieldDto) {
    await this.findOne(studyId, formTemplateId, fieldId);

    if (
      dto.label === undefined &&
      dto.key === undefined &&
      dto.type === undefined &&
      dto.required === undefined &&
      dto.order === undefined
    ) {
      throw new BadRequestException('No fields to update');
    }

    return this.prisma.formField.update({
      where: { id: fieldId },
      data: {
        label: dto.label,
        key: dto.key,
        type: dto.type,
        required: dto.required,
        order: dto.order,
      },
    });
  }

  async remove(studyId: string, formTemplateId: string, fieldId: string) {
    await this.findOne(studyId, formTemplateId, fieldId);
    return this.prisma.formField.delete({ where: { id: fieldId } });
  }
}
