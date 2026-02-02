import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(studyId: string, dto: CreateSubjectDto) {
    // study var mı?
    const study = await this.prisma.study.findUnique({ where: { id: studyId } });
    if (!study) throw new NotFoundException('Study not found');

    const enrollmentDate = new Date(dto.enrollmentDate);
    if (Number.isNaN(enrollmentDate.getTime())) {
      throw new BadRequestException('enrollmentDate must be a valid ISO date');
    }

    try {
      return await this.prisma.subject.create({
        data: {
          studyId,
          subjectCode: dto.subjectCode,
          enrollmentDate,
        },
      });
    } catch (e: any) {
      // Unique constraint (studyId, subjectCode)
      if (e?.code === 'P2002') {
        throw new BadRequestException('subjectCode must be unique within the study');
      }
      throw e;
    }
  }

  async findAll(studyId: string) {
    return this.prisma.subject.findMany({
      where: { studyId },
      orderBy: { enrollmentDate: 'asc' },
    });
  }

  async findOne(studyId: string, subjectId: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId, studyId },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(studyId: string, subjectId: string, dto: UpdateSubjectDto) {
    await this.findOne(studyId, subjectId);

    const data: any = {};
    if (dto.subjectCode !== undefined) data.subjectCode = dto.subjectCode;

    if (dto.enrollmentDate !== undefined) {
      const d = new Date(dto.enrollmentDate);
      if (Number.isNaN(d.getTime())) throw new BadRequestException('enrollmentDate must be a valid ISO date');
      data.enrollmentDate = d;
    }

    try {
      return await this.prisma.subject.update({
        where: { id: subjectId },
        data,
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('subjectCode must be unique within the study');
      }
      throw e;
    }
  }
}
