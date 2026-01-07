import { IsInt, IsString, Min } from 'class-validator';

export class EchoDto {
  @IsString()
  message!: string;

  @IsInt()
  @Min(1)
  times!: number;
}
