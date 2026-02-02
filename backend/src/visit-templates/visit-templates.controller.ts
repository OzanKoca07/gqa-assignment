import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { VisitTemplatesService } from './visit-templates.service';
import { CreateVisitTemplateDto } from './dto/create-visit-template.dto';
import { UpdateVisitTemplateDto } from './dto/update-visit-template.dto';

@Controller('studies/:studyId/visit-templates')
export class VisitTemplatesController {
  constructor(private readonly service: VisitTemplatesService) {}

  @Post()
  create(
    @Param('studyId') studyId: string,
    @Body() dto: CreateVisitTemplateDto,
  ) {
    return this.service.create(studyId, dto);
  }

  @Get()
  findAll(@Param('studyId') studyId: string) {
    return this.service.findAll(studyId);
  }


  @Get(':visitTemplateId')
  findOne(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
  ) {
    return this.service.findOne(studyId, visitTemplateId);
  }


  @Patch(':visitTemplateId')
  update(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
    @Body() dto: UpdateVisitTemplateDto,
  ) {
    return this.service.update(studyId, visitTemplateId, dto);
  }


  @Delete(':visitTemplateId')
  remove(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
  ) {
    return this.service.remove(studyId, visitTemplateId);
  }
}
