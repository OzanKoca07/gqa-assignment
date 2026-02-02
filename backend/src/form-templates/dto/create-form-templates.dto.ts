import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateFormTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // "code" için basit bir format: harf/sayı/_/-
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_-]+$/i, { message: 'code invalid format' })
  code!: string;
}
