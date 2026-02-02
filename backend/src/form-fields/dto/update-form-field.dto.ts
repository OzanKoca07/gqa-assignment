import { IsBoolean, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateFormFieldDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, { message: 'key invalid format' })
  key?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(TEXT|NUMBER|DATE)$/, { message: 'type must be TEXT|NUMBER|DATE' })
  type?: 'TEXT' | 'NUMBER' | 'DATE';

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
