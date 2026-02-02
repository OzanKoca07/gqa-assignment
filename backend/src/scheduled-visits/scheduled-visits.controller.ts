import { Controller, Get, Param, Post } from '@nestjs/common';
import { ScheduledVisitsService } from './scheduled-visits.service';

@Controller('studies/:studyId/subjects/:subjectId/scheduled-visits')
export class ScheduledVisitsController {
  constructor(private readonly scheduledVisitsService: ScheduledVisitsService) {}

  @Post('generate')
  generate(@Param('studyId') studyId: string, @Param('subjectId') subjectId: string) {
    return this.scheduledVisitsService.generateForSubject(studyId, subjectId);
  }

  @Get()
  list(@Param('studyId') studyId: string, @Param('subjectId') subjectId: string) {
    return this.scheduledVisitsService.listForSubject(studyId, subjectId);
  }

  @Get(':scheduledVisitId')
  getOne(
    @Param('studyId') studyId: string,
    @Param('subjectId') subjectId: string,
    @Param('scheduledVisitId') scheduledVisitId: string,
  ) {
    return this.scheduledVisitsService.getOne(studyId, subjectId, scheduledVisitId);
  }
}
