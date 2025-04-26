import { Shop } from '../models/shop.model';
 
export class ShopService {
  async getShopById(id: string): Promise<Shop | null> {
    return await Shop.findByPk(id);
  }
} 