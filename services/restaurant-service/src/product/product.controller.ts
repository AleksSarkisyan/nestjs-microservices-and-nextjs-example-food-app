import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { Types, Enums, Filters } from '@asarkisyan/nestjs-foodapp-shared';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseFilters(new Filters.ExceptionFilter())
  @MessagePattern({ cmd: Enums.Product.Commands.CREATE_PRODUCT })
  @UsePipes(new JoiValidationPipe(Types.Product.createProductSchema))
  create(@Payload() createProductDto: Types.Product.CreateProductDto) {
    try {
      return this.productService.create(createProductDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: Enums.Product.Commands.UPDATE_PRODUCTS })
  // @UsePipes(new JoiValidationPipe(Types.Product.createProductSchema)) // to do joi validation
  updateProducts(@Payload() productsData: Types.OrderProduct.AvailableProducts[]) {
    return this.productService.updateProducts(productsData['products'], productsData['restaurantId']);
  }

  @MessagePattern({ cmd: Enums.Product.Commands.UPDATE_PRODUCT })
  //@UsePipes(new JoiValidationPipe(Types.Product.createProductSchema)) // to do joi validation
  update(@Payload() createProductDto: Partial<Types.Product.CreateProductDto>) {
    return this.productService.update(createProductDto);
  }

  @MessagePattern({ cmd: Enums.Product.Commands.UPDATE_PRODUCT_CHECKOUT })
  //@UsePipes(new JoiValidationPipe(Types.Product.createProductSchema)) // to do joi validation
  updateProductCheckout(@Payload() { productId, product }) {
    return this.productService.updateProductCheckout(productId, product);
  }
}
