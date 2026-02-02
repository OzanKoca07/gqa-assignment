import { Module } from '@nestjs/common';
import { VisitTemplatesService } from './visit-templates.service';
import { VisitTemplatesController } from './visit-templates.controller';

@Module({
  controllers: [VisitTemplatesController],
  providers: [VisitTemplatesService],
})
export class VisitTemplatesModule {}
