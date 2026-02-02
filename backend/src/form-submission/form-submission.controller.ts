import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FormSubmissionsService } from './form-submission.service';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';

@Controller('studies/:studyId/subjects/:subjectId/scheduled-visits/:scheduledVisitId')
export class FormSubmissionsController {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Post('forms/:formTemplateId/submissions')
  create(
    @Param('studyId') studyId: string,
    @Param('subjectId') subjectId: string,
    @Param('scheduledVisitId') scheduledVisitId: string,
    @Param('formTemplateId') formTemplateId: string,
    @Body() dto: CreateFormSubmissionDto,
  ) {
    return this.formSubmissionsService.create(studyId, subjectId, scheduledVisitId, formTemplateId, dto);
  }

  @Get('submissions')
  list(
    @Param('studyId') studyId: string,
    @Param('subjectId') subjectId: string,
    @Param('scheduledVisitId') scheduledVisitId: string,
  ) {
    return this.formSubmissionsService.listForScheduledVisit(studyId, subjectId, scheduledVisitId);
  }

  @Get('submissions/:submissionId')
  getOne(
    @Param('studyId') studyId: string,
    @Param('subjectId') subjectId: string,
    @Param('scheduledVisitId') scheduledVisitId: string,
    @Param('submissionId') submissionId: string,
  ) {
    return this.formSubmissionsService.getOne(studyId, subjectId, scheduledVisitId, submissionId);
  }
}
