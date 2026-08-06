import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @MinLength(1)
  productName: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
