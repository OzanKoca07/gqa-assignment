import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudiesModule } from './studies/studies.module';
import { VisitTemplatesModule } from './visit-templates/visit-templates.module';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { FormFieldsModule } from './form-fields/form-fields.module';
import { VisitTemplateFormsModule } from './visit-template-forms/visit-template-forms.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ScheduledVisitsModule } from './scheduled-visits/scheduled-visits.module';
import { FormSubmissionsModule } from './form-submission/form-submission.module';

@Module({
  imports: [PrismaModule, StudiesModule, VisitTemplatesModule, FormFieldsModule, FormTemplatesModule, VisitTemplateFormsModule, SubjectsModule,ScheduledVisitsModule, FormSubmissionsModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
