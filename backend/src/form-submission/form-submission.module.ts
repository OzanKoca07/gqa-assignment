import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FormSubmissionsController } from './form-submission.controller';
import { FormSubmissionsService } from './form-submission.service';

@Module({
  imports: [PrismaModule],
  controllers: [FormSubmissionsController],
  providers: [FormSubmissionsService],
})
export class FormSubmissionsModule {}
