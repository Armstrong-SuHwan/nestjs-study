import { PartialType } from '@nestjs/mapped-types'; // 상속받은 클래스의 모든 속성을 @IsOptional() 데코레이터 적용 상태로 변환
import { CreateSampleDto } from './create-sample.dto';

export class UpdateSampleDto extends PartialType(CreateSampleDto) {}
