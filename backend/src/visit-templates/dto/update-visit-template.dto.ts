import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateVisitTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9][A-Z0-9-_]{0,30}$/i, { message: 'code invalid format' })
  code?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  day?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  windowBefore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  windowAfter?: number;
}
