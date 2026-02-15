import { ApiProperty } from '@nestjs/swagger';

export class ExpenseCreationBaseDto {
  @ApiProperty({
    description:
      'The date of the expense as a string (ISO format or Date.toString() format)',
    example: '2023-12-31T14:30:00.000Z', // ISO string format from JavaScript Date
  })
  date: string;

  @ApiProperty({
    description: 'The amount of the expense',
    example: 99.99,
  })
  amount: number;

  @ApiProperty({
    description: 'Optional description of the expense',
    example: 'Groceries for the week',
    required: false,
  })
  description?: string;
}
