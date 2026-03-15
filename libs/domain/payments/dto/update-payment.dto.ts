// update-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ required: false })
  reference?: string;
}
