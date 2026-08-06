import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async findAll(status?: OrderStatus): Promise<Order[]> {
    return this.ordersRepository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const items = dto.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.productName = item.productName;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      return orderItem;
    });

    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      customerName: dto.customerName,
      items,
      totalValue,
      status: OrderStatus.PENDING,
    });

    return this.ordersRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Pedido com id "${id}" não encontrado`);
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}
