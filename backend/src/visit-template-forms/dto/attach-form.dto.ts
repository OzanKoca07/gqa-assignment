import { IsString, IsNotEmpty } from 'class-validator';

export class AttachFormDto {
    @IsString()
    @IsNotEmpty()
    formTemplateId: string;
}
