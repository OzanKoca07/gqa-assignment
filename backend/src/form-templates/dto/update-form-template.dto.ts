import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateFormTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9_-]+$/i, { message: 'code invalid format' })
  code?: string;
}
