import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { CreateFormTemplateDto } from './dto/create-form-templates.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Controller('studies/:studyId/form-templates')
export class FormTemplatesController {
  constructor(private readonly service: FormTemplatesService) {}

  @Post()
  create(@Param('studyId') studyId: string, @Body() dto: CreateFormTemplateDto) {
    return this.service.create(studyId, dto);
  }

  @Get()
  findAll(@Param('studyId') studyId: string) {
    return this.service.findAll(studyId);
  }

  @Get(':formTemplateId')
  findOne(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
  ) {
    return this.service.findOne(studyId, formTemplateId);
  }

  @Patch(':formTemplateId')
  update(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Body() dto: UpdateFormTemplateDto,
  ) {
    return this.service.update(studyId, formTemplateId, dto);
  }

  @Delete(':formTemplateId')
  remove(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
  ) {
    return this.service.remove(studyId, formTemplateId);
  }
}
