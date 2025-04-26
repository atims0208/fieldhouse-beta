import { Request, Response } from 'express';
import { PrintfulService } from '../services/printful.service';
import { ShopService } from '../services/shop.service';
import { PrintfulStore } from '../models/printful-store.model';

export class PrintfulController {
  private printfulService: PrintfulService;
  private shopService: ShopService;

  constructor() {
    this.printfulService = new PrintfulService();
    this.shopService = new ShopService();
  }

  async connectStore(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { shopId, apiKey } = req.body;
      const shop = await this.shopService.getShopById(shopId);

      if (!shop || shop.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to manage this shop' });
        return;
      }

      const isValidKey = await this.printfulService.validateApiKey(apiKey);
      if (!isValidKey) {
        res.status(400).json({ error: 'Invalid Printful API key' });
        return;
      }

      const [printfulStore] = await PrintfulStore.findOrCreate({
        where: { shopId },
        defaults: { apiKey }
      });

      if (printfulStore.apiKey !== apiKey) {
        await printfulStore.update({ apiKey });
      }

      res.json({ success: true, message: 'Printful store connected successfully' });
    } catch (error) {
      console.error('Error connecting Printful store:', error);
      res.status(500).json({ error: 'Failed to connect Printful store' });
    }
  }

  async syncProducts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { shopId } = req.params;
      const shop = await this.shopService.getShopById(shopId);

      if (!shop || shop.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to manage this shop' });
        return;
      }

      const printfulStore = await PrintfulStore.findOne({ where: { shopId } });
      if (!printfulStore) {
        res.status(404).json({ error: 'Printful store not found' });
        return;
      }

      await this.printfulService.syncProducts(printfulStore);
      res.json({ success: true, message: 'Products synced successfully' });
    } catch (error) {
      console.error('Error syncing products:', error);
      res.status(500).json({ error: 'Failed to sync products' });
    }
  }

  async disconnectStore(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { shopId } = req.params;
      const shop = await this.shopService.getShopById(shopId);

      if (!shop || shop.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to manage this shop' });
        return;
      }

      const printfulStore = await PrintfulStore.findOne({ where: { shopId } });
      if (!printfulStore) {
        res.status(404).json({ error: 'Printful store not found' });
        return;
      }

      await printfulStore.destroy();
      res.json({ success: true, message: 'Printful store disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting Printful store:', error);
      res.status(500).json({ error: 'Failed to disconnect Printful store' });
    }
  }
} 