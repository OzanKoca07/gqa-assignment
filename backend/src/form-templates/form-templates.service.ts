import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormTemplateDto } from './dto/create-form-templates.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Injectable()
export class FormTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(studyId: string, dto: CreateFormTemplateDto) {
    return this.prisma.formTemplate.create({
      data: {
        studyId,
        name: dto.name,
        code: dto.code,
      },
    });
  }

  findAll(studyId: string) {
    return this.prisma.formTemplate.findMany({
      where: { studyId },
      orderBy: [{ code: 'asc' }],
      include: { fields: true }, // istersen kaldır
    });
  }

  async findOne(studyId: string, formTemplateId: string) {
    const ft = await this.prisma.formTemplate.findFirst({
      where: { id: formTemplateId, studyId },
      include: { fields: true },
    });
    if (!ft) throw new NotFoundException('FormTemplate not found');
    return ft;
  }

  async update(studyId: string, formTemplateId: string, dto: UpdateFormTemplateDto) {
    await this.findOne(studyId, formTemplateId);

    // boş patch istemiyorsan:
    if (dto.name === undefined && dto.code === undefined) {
      throw new BadRequestException('No fields to update');
    }

    return this.prisma.formTemplate.update({
      where: { id: formTemplateId },
      data: {
        name: dto.name,
        code: dto.code,
      },
    });
  }

  async remove(studyId: string, formTemplateId: string) {
    await this.findOne(studyId, formTemplateId);
    return this.prisma.formTemplate.delete({ where: { id: formTemplateId } });
  }
}
