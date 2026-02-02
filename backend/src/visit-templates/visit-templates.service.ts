import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitTemplateDto } from './dto/create-visit-template.dto';
import { UpdateVisitTemplateDto } from './dto/update-visit-template.dto';

@Injectable()
export class VisitTemplatesService {
    constructor(private readonly prisma: PrismaService) { }

    create(studyId: string, dto: CreateVisitTemplateDto) {
        if (dto.day < 0) throw new BadRequestException('day must be >= 0');

        const windowBefore = dto.windowBefore ?? 0;
        const windowAfter = dto.windowAfter ?? 0;

        if (windowBefore < 0) throw new BadRequestException('windowBefore must be >= 0');
        if (windowAfter < 0) throw new BadRequestException('windowAfter must be >= 0');

        return this.prisma.visitTemplate.create({
            data: {
                studyId,
                name: dto.name,
                code: dto.code,
                day: dto.day,
                windowBefore,
                windowAfter,
            },
        });
    }

    findAll(studyId: string) {
        return this.prisma.visitTemplate.findMany({
            where: { studyId },
            orderBy: [{ day: 'asc' }, { code: 'asc' }],
        });
    }


    async findOne(studyId: string, visitTemplateId: string) {
        const vt = await this.prisma.visitTemplate.findFirst({
            where: { id: visitTemplateId, studyId },
        });
        if (!vt) throw new NotFoundException('VisitTemplate not found');
        return vt;
    }

    async update(studyId: string, visitTemplateId: string, dto: UpdateVisitTemplateDto) {
        await this.findOne(studyId, visitTemplateId);

        const windowAfter = dto.windowAfter ?? 0;
        const windowBefore = dto.windowBefore ?? 0;


        if (dto.day !== undefined && dto.day < 0) throw new BadRequestException('day must be >= 0');
        if (dto.windowBefore !== undefined && dto.windowBefore < 0) throw new BadRequestException('windowBefore must be >= 0');
        if (dto.windowAfter !== undefined && dto.windowAfter < 0) throw new BadRequestException('windowAfter must be >= 0');

        return this.prisma.visitTemplate.update({
            where: { id: visitTemplateId },
            data: {
                name: dto.name,
                code: dto.code,
                day: dto.day,
                windowBefore: dto.windowBefore,
                windowAfter: dto.windowAfter,
            },
        });
    }

    async remove(studyId: string, visitTemplateId: string) {
        await this.findOne(studyId, visitTemplateId);
        return this.prisma.visitTemplate.delete({ where: { id: visitTemplateId } });
    }
}
