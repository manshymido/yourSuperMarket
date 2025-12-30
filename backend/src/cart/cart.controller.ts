import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: CurrentUserPayload) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  addToCart(
    @CurrentUser() user: CurrentUserPayload,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.id, addToCartDto);
  }

  @Put('items/:id')
  updateCartItem(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.id, itemId, updateCartItemDto);
  }

  @Delete('items/:id')
  removeFromCart(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') itemId: string,
  ) {
    return this.cartService.removeFromCart(user.id, itemId);
  }

  @Delete()
  clearCart(@CurrentUser() user: CurrentUserPayload) {
    return this.cartService.clearCart(user.id);
  }
}
