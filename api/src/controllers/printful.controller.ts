import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PrintfulStore } from '../models/printful-store.model';
import { Shop } from '../models/shop.model';
import { PrintfulService } from '../services/printful.service';

export class PrintfulController {
  private printfulService: PrintfulService;
  private printfulStoreRepository = AppDataSource.getRepository(PrintfulStore);
  private shopRepository = AppDataSource.getRepository(Shop);

  constructor() {
    this.printfulService = new PrintfulService();
  }

  public connectStore = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      const { accessToken, storeId } = req.body;

      if (!shopId || !accessToken || !storeId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Check if shop exists
      const shop = await this.shopRepository.findOne({ where: { id: shopId } });
      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      // Find or create PrintfulStore
      let printfulStore = await this.printfulStoreRepository.findOne({
        where: { shopId }
      });

      if (!printfulStore) {
        printfulStore = this.printfulStoreRepository.create({
          shopId,
          userId: req.user!.id,
          storeId,
          accessToken
        });
      } else {
        printfulStore.accessToken = accessToken;
        printfulStore.storeId = storeId;
      }

      await this.printfulStoreRepository.save(printfulStore);

      return res.json({ success: true, printfulStore });
    } catch (error) {
      console.error('Error connecting Printful store:', error);
      return res.status(500).json({ error: 'Failed to connect Printful store' });
    }
  };

  public getStoreProducts = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;

      const printfulStore = await this.printfulStoreRepository.findOne({
        where: { shopId }
      });

      if (!printfulStore) {
        return res.status(404).json({ error: 'Printful store not found' });
      }

      const products = await this.printfulService.getStoreProducts(printfulStore.accessToken);
      return res.json(products);
    } catch (error) {
      console.error('Error fetching Printful products:', error);
      return res.status(500).json({ error: 'Failed to fetch Printful products' });
    }
  };

  public syncProducts = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;

      const printfulStore = await this.printfulStoreRepository.findOne({
        where: { shopId }
      });

      if (!printfulStore) {
        return res.status(404).json({ error: 'Printful store not found' });
      }

      await this.printfulService.syncProducts(printfulStore);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error syncing Printful products:', error);
      return res.status(500).json({ error: 'Failed to sync Printful products' });
    }
  };

  async disconnectStore(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { shopId } = req.params;
      const shop = await this.shopRepository.findOne({ where: { id: shopId } });

      if (!shop || shop.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to manage this shop' });
        return;
      }

      const printfulStore = await this.printfulStoreRepository.findOne({ where: { shopId } });
      if (!printfulStore) {
        res.status(404).json({ error: 'Printful store not found' });
        return;
      }

      await this.printfulStoreRepository.remove(printfulStore);
      res.json({ success: true, message: 'Printful store disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting Printful store:', error);
      res.status(500).json({ error: 'Failed to disconnect Printful store' });
    }
  }
} 