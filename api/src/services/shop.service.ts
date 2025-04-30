import { AppDataSource } from '../config/database';
import { Shop } from '../models/shop.model';

export class ShopService {
  private shopRepository = AppDataSource.getRepository(Shop);

  async getShopById(id: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({ where: { id } });
  }

  async createShop(data: Partial<Shop>): Promise<Shop> {
    const shop = this.shopRepository.create(data);
    return await this.shopRepository.save(shop);
  }

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop | null> {
    await this.shopRepository.update(id, data);
    return await this.shopRepository.findOne({ where: { id } });
  }

  async deleteShop(id: string): Promise<void> {
    await this.shopRepository.delete(id);
  }
} 