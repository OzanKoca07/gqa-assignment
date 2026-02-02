import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FieldValueDto {
  @IsString()
  @IsNotEmpty()
  formFieldId!: string;

  @IsOptional()
  @IsString()
  valueText?: string;

  @IsOptional()
  // NUMBER -> JSON number olarak geleceği için string değil
  valueNumber?: number;

  @IsOptional()
  @IsString()
  // DATE için ISO string
  valueDate?: string;
}

export class CreateFormSubmissionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FieldValueDto)
  values!: FieldValueDto[];
}
