import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FormFieldsService } from './form-fields.service';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';

@Controller('studies/:studyId/form-templates/:formTemplateId/fields')
export class FormFieldsController {
  constructor(private readonly service: FormFieldsService) {}

  @Post()
  create(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Body() dto: CreateFormFieldDto,
  ) {
    return this.service.create(studyId, formTemplateId, dto);
  }

  @Get()
  findAll(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
  ) {
    return this.service.findAll(studyId, formTemplateId);
  }

  @Get(':fieldId')
  findOne(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Param('fieldId') fieldId: string,
  ) {
    return this.service.findOne(studyId, formTemplateId, fieldId);
  }

  @Patch(':fieldId')
  update(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Param('fieldId') fieldId: string,
    @Body() dto: UpdateFormFieldDto,
  ) {
    return this.service.update(studyId, formTemplateId, fieldId, dto);
  }

  @Delete(':fieldId')
  remove(
    @Param('studyId') studyId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Param('fieldId') fieldId: string,
  ) {
    return this.service.remove(studyId, formTemplateId, fieldId);
  }
}
