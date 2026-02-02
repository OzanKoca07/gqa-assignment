import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';

@Controller('studies/:studyId/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Param('studyId') studyId: string, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(studyId, dto);
  }

  @Get()
  findAll(@Param('studyId') studyId: string) {
    return this.subjectsService.findAll(studyId);
  }

  @Get(':subjectId')
  findOne(@Param('studyId') studyId: string, @Param('subjectId') subjectId: string) {
    return this.subjectsService.findOne(studyId, subjectId);
  }

  @Patch(':subjectId')
  update(
    @Param('studyId') studyId: string,
    @Param('subjectId') subjectId: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(studyId, subjectId, dto);
  }
}
