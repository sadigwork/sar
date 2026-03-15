// create-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ required: false })
  reference?: string;

  @ApiProperty()
  applicationId: string;
}
