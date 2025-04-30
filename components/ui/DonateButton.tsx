import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './use-toast';
import { api } from '@/lib/api';

interface DonateButtonProps {
    recipientUsername: string;
}

export function DonateButton({ recipientUsername }: DonateButtonProps) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const handleDonate = async () => {
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'Please log in to donate',
                variant: 'destructive',
            });
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: 'Invalid amount',
                description: 'Please enter a valid donation amount',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/donations', {
                amount: parseFloat(amount),
                message,
                recipientUsername,
            });

            toast({
                title: 'Donation successful!',
                description: `Thank you for supporting ${recipientUsername}!`,
            });

            setIsOpen(false);
            setAmount('');
            setMessage('');
        } catch (error) {
            toast({
                title: 'Donation failed',
                description: 'There was an error processing your donation',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    ❤️ Donate
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Support {recipientUsername}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                            Amount ($)
                        </label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                            Message (optional)
                        </label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a message..."
                            rows={3}
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleDonate}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Send Donation'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 