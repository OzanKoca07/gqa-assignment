import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VisitTemplateFormsService } from './visit-template-forms.service';
import { AttachFormDto } from './dto/attach-form.dto';

@Controller('studies/:studyId/visit-templates/:visitTemplateId/forms')
export class VisitTemplateFormsController {
  constructor(private readonly service: VisitTemplateFormsService) {}

  @Post()
  attach(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
    @Body() dto: AttachFormDto,
  ) {
    return this.service.attach(studyId, visitTemplateId, dto);
  }

  @Get()
  list(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
  ) {
    return this.service.listAttachedForms(studyId, visitTemplateId);
  }

  @Delete(':formTemplateId')
  detach(
    @Param('studyId') studyId: string,
    @Param('visitTemplateId') visitTemplateId: string,
    @Param('formTemplateId') formTemplateId: string,
  ) {
    return this.service.detach(studyId, visitTemplateId, formTemplateId);
  }
}
