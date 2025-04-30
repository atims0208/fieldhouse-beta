import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Donation } from '../models/Donation';
import { User } from '../models/User';

export class DonationController {
    private donationRepository = AppDataSource.getRepository(Donation);
    private userRepository = AppDataSource.getRepository(User);

    // Create a new donation
    async createDonation(req: Request, res: Response): Promise<void> {
        try {
            const { amount, message, recipientUsername } = req.body;
            const donorId = req.user!.id;

            // Find recipient by username
            const recipient = await this.userRepository.findOne({
                where: { username: recipientUsername }
            });

            if (!recipient) {
                res.status(404).json({ error: 'Recipient not found' });
                return;
            }

            // Create donation record
            const donation = this.donationRepository.create({
                amount,
                message,
                donorId,
                recipientId: recipient.id
            });

            await this.donationRepository.save(donation);

            res.status(201).json({
                message: 'Donation successful',
                donation: {
                    id: donation.id,
                    amount: donation.amount,
                    message: donation.message,
                    createdAt: donation.createdAt
                }
            });
        } catch (error) {
            console.error('Error creating donation:', error);
            res.status(500).json({ error: 'Failed to process donation' });
        }
    }

    // Get donations received by a user
    async getDonationsReceived(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.params;

            const user = await this.userRepository.findOne({
                where: { username }
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const donations = await this.donationRepository.find({
                where: { recipientId: user.id },
                relations: ['donor'],
                order: { createdAt: 'DESC' }
            });

            res.json(donations.map(donation => ({
                id: donation.id,
                amount: donation.amount,
                message: donation.message,
                donor: {
                    username: donation.donor.username
                },
                createdAt: donation.createdAt
            })));
        } catch (error) {
            console.error('Error fetching donations:', error);
            res.status(500).json({ error: 'Failed to fetch donations' });
        }
    }
} 