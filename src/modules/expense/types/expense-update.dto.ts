import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ExpenseCreationBaseDto } from './expense-creation-base.dto';

export class ExpenseUpdateDto extends PartialType(ExpenseCreationBaseDto) {
  @ApiProperty({
    description: 'The ID of the expense to update',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The date of the expense as a string (ISO format or Date.toString() format)',
    example: '2023-12-31T14:30:00.000Z',
    required: false,
  })
  date?: string;

  @ApiProperty({
    description: 'The amount of the expense',
    example: 99.99,
    required: false,
  })
  amount?: number;

  @ApiProperty({
    description: 'Optional description of the expense',
    example: 'Groceries for the week',
    required: false,
  })
  description?: string;
}