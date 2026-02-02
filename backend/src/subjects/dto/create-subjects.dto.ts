import { IsISO8601, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  // İstersen formatı daha serbest bırak. Şimdilik örnek bir güvenli regex:
  @Matches(/^[A-Za-z0-9_-]{3,64}$/, { message: 'subjectCode invalid format' })
  subjectCode!: string;

  // ISO string bekleyelim: "2026-02-01" veya "2026-02-01T10:00:00.000Z"
  @IsISO8601()
  enrollmentDate!: string;
}
