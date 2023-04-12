import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Order } from './entities/order.entity';

const messages = Enums.Messages.Messages;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    private productService: ProductService,
    private restaurantService: RestaurantService,
    private orderProductService: OrderProductService
  ) { }

  async create(createOrderDto: Types.Order.CreateOrderDto) {

    const {
      restaurantId,
      userId,
      totalQuantity,
      availableProducts
    } = await this.getProductOrderDetails(createOrderDto);

    const orderData = {
      userId,
      restaurantId,
      totalQuantity,
      totalPrice: 0,
      status: 'CREATED'
    }

    const order = await this.orderModel.create({ ...orderData });

    if (!order.id) {
      return this.errorMessage(messages.CREATE_ORDER_ERROR);
    }

    let orderProductsData: Types.OrderProduct.OrderProductsData[] = [];
    let stripeCheckoutSessionData: Types.Stripe.StripeCheckoutSession[] = [];
    for (let [key, product] of Object.entries(availableProducts)) {
      createOrderDto.products.find((orderDto) => {
        if (orderDto.productId == product.id) {
          orderProductsData.push({
            name: product.name,
            description: product.description,
            weight: product.weight,
            productId: product.id,
            price: product.price,
            productsPrice: product.price * orderDto.quantity,
            quantity: orderDto.quantity,
            orderId: order.id
          });

          stripeCheckoutSessionData.push({
            price: String(product.stripePrice),
            quantity: orderDto.quantity,
          });
        }
      })
    }

    let result = await this.orderProductService.create({ products: orderProductsData });

    if (result.length) {
      let totalPrice = await this.orderProductService.getOrderTotal(order.id);
      totalPrice = totalPrice[0][0]['totalPrice'];

      await this.orderModel.update(
        { totalPrice },
        {
          where: {
            id: order.id
          }
        }
      );

      let additional = {
        totalQuantity,
        totalPrice,
        status: 'CREATED'
      }

      return {
        productData: orderProductsData,
        additional,
        stripeCheckoutSessionData
      };
    }

    return this.errorMessage(messages.CREATE_ORDER_DETAILS_ERROR);
  }

  calculateTotal(array: readonly (Product | OrderProduct)[], key: string) {
    return array.reduce((accumulator, object) => {
      return accumulator + object[key];
    }, 0);
  }

  async getProductOrderDetails(createOrderDto: Types.Order.CreateOrderDto) {
    const { restaurantId, userId } = createOrderDto;
    const restaurantUserId = await this.restaurantService.findOne(restaurantId);
    const productIds = createOrderDto.products.map((obj) => obj.productId);
    const totalQuantity = this.calculateTotal(createOrderDto.products as OrderProduct[], 'quantity');
    const availableProducts = await this.productService.findRestaurantProducts({
      restaurantUserId: restaurantUserId.userId,
      productIds
    });

    return {
      restaurantId,
      restaurantUserId,
      userId,
      productIds,
      totalQuantity,
      availableProducts
    }
  }

  errorMessage(message: string) {
    Logger.log(message);
    return {
      error: true,
      message
    }
  }

}
