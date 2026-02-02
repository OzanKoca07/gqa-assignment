import { IsISO8601, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{3,64}$/, { message: 'subjectCode invalid format' })
  subjectCode?: string;

  @IsOptional()
  @IsISO8601()
  enrollmentDate?: string;
}
