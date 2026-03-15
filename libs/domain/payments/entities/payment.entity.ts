// libs/domain/payments/src/lib/entities/payment.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class Payment {
  @ApiProperty({ description: 'Payment unique ID' })
  id: string;

  @ApiProperty({ description: 'User ID who made the payment' })
  userId: string;

  @ApiProperty({ description: 'Associated application ID' })
  applicationId: string;

  @ApiProperty({ description: 'Amount of payment' })
  amount: number;

  @ApiProperty({ description: 'Currency code (e.g., USD)' })
  currency: string;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Optional reference number from bank/online gateway',
    required: false,
  })
  reference?: string;

  @ApiProperty({ description: 'Payment creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Payment last update timestamp' })
  updatedAt: Date;
}
