import { DataSource, Repository } from 'typeorm';
import { User } from '../models/User';
import { TicketPackage } from '../models/TicketPackage';
import { TicketTransaction, TransactionStatus, TransactionType } from '../models/TicketTransaction';

export class TicketService {
  private userRepository: Repository<User>;
  private packageRepository: Repository<TicketPackage>;
  private transactionRepository: Repository<TicketTransaction>;

  constructor(private dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.packageRepository = dataSource.getRepository(TicketPackage);
    this.transactionRepository = dataSource.getRepository(TicketTransaction);
  }

  async initializeDefaultPackages(): Promise<void> {
    const defaultPackages = [
      { name: 'Starter Pack', ticketAmount: 425, priceUSD: 4.99 },
      { name: 'Popular Pack', ticketAmount: 1700, priceUSD: 19.99 },
      { name: 'Value Pack', ticketAmount: 4350, priceUSD: 49.99 },
      { name: 'Pro Pack', ticketAmount: 8750, priceUSD: 99.99 },
      { name: 'Elite Pack', ticketAmount: 21800, priceUSD: 249.99 },
      { name: 'Ultimate Pack', ticketAmount: 43000, priceUSD: 500.00 }
    ];

    for (const pkg of defaultPackages) {
      const existing = await this.packageRepository.findOne({
        where: { ticketAmount: pkg.ticketAmount }
      });

      if (!existing) {
        await this.packageRepository.save({
          ...pkg,
          isActive: true,
          description: `Get ${pkg.ticketAmount} tickets for $${pkg.priceUSD}`
        });
      }
    }
  }

  async getAvailablePackages(): Promise<TicketPackage[]> {
    return this.packageRepository.find({
      where: { isActive: true },
      order: { ticketAmount: 'ASC' }
    });
  }

  async createPurchaseTransaction(
    userId: string,
    packageId: string
  ): Promise<TicketTransaction> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId }
    });

    const ticketPackage = await this.packageRepository.findOneOrFail({
      where: { id: packageId }
    });

    const transaction = this.transactionRepository.create({
      userId: user.id,
      packageId: ticketPackage.id,
      ticketAmount: ticketPackage.ticketAmount,
      amountUSD: ticketPackage.priceUSD,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.PENDING
    });

    return this.transactionRepository.save(transaction);
  }

  async completePurchaseTransaction(
    transactionId: string,
    paymentProcessorId: string,
    paymentDetails: any
  ): Promise<TicketTransaction> {
    const transaction = await this.transactionRepository.findOneOrFail({
      where: { id: transactionId }
    });

    const user = await this.userRepository.findOneOrFail({
      where: { id: transaction.userId }
    });

    // Start a transaction to ensure data consistency
    await this.dataSource.transaction(async (manager) => {
      // Update transaction status
      transaction.status = TransactionStatus.COMPLETED;
      transaction.paymentProcessorId = paymentProcessorId;
      transaction.paymentDetails = paymentDetails;
      await manager.save(transaction);

      // Update user's ticket balance
      user.tickets = (user.tickets || 0) + transaction.ticketAmount;
      await manager.save(user);
    });

    return transaction;
  }

  async getUserTransactions(userId: string): Promise<TicketTransaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: ['package'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId }
    });
    return user.tickets || 0;
  }
} 