import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto, StudyStatusDto } from './dto/create-study.dto';

@Controller('studies')
export class StudiesController {
    constructor(private readonly studies: StudiesService) { }

    @Post()
    create(@Body() dto: CreateStudyDto) {
        // status gelmezse default verelim
        if (!dto.status) (dto as any).status = StudyStatusDto.DRAFT;
        return this.studies.create(dto);
    }

    @Get()
    findAll() {
        return this.studies.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studies.findOne(id);
    }
}
