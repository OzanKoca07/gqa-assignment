import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyDto } from './dto/create-study.dto';

@Injectable()
export class StudiesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateStudyDto) {
        try {
            return await this.prisma.study.create({
                data: {
                    name: dto.name,
                    protocolCode: dto.protocolCode,
                    status: dto.status as any,
                },
            });
        } catch (e: any) {
            // unique constraint -> protocolCode
            if (e?.code === 'P2002') {
                throw new ConflictException('protocolCode already exists');
            }
            throw e;
        }
    }

    async findAll() {
        return this.prisma.study.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, protocolCode: true, status: true, createdAt: true },
        });
    }

    async findOne(id: string) {
        const study = await this.prisma.study.findUnique({
            where: { id },
            include: {
                visitTemplates: { orderBy: { day: 'asc' } },
                formTemplates: true,
                subjects: true,
            },
        });
        if (!study) throw new NotFoundException('study not found');
        return study;
    }
}
