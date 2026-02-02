import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export enum StudyStatusDto {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
}

export class CreateStudyDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    // örnek: PROT-001 gibi (esnek bir regex)
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9][A-Z0-9-_]{2,30}$/i, { message: 'protocolCode invalid format' })
    protocolCode!: string;

    @IsEnum(StudyStatusDto)
    status!: StudyStatusDto;
}
