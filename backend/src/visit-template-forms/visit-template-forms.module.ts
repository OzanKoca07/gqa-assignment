import { Module } from '@nestjs/common';
import { VisitTemplateFormsController } from './visit-template-forms.controller';
import { VisitTemplateFormsService } from './visit-template-forms.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VisitTemplateFormsController],
  providers: [VisitTemplateFormsService],
})
export class VisitTemplateFormsModule {}
