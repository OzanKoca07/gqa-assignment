import { IsInt, IsNotEmpty, IsString, Matches, Min, IsOptional } from 'class-validator';

export class CreateVisitTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9][A-Z0-9-_]{0,30}$/i, { message: 'code invalid format' })
  code!: string;

  @IsInt()
  @Min(0)
  day!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  windowBefore?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  windowAfter?: number = 0;
}
