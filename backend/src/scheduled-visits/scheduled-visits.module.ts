import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduledVisitsController } from './scheduled-visits.controller';
import { ScheduledVisitsService } from './scheduled-visits.service';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduledVisitsController],
  providers: [ScheduledVisitsService],
})
export class ScheduledVisitsModule {}
