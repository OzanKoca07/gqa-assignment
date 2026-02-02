import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

// schema.prisma: enum FieldType { TEXT NUMBER DATE }
export class CreateFormFieldDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  // key: form içinde unique
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, { message: 'key invalid format' })
  key!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(TEXT|NUMBER|DATE)$/, { message: 'type must be TEXT|NUMBER|DATE' })
  type!: 'TEXT' | 'NUMBER' | 'DATE';

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
