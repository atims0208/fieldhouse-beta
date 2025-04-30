import { DataSource } from 'typeorm';
import { Gift } from '../models/Gift';

export const seedGifts = async (dataSource: DataSource) => {
  const giftRepository = dataSource.getRepository(Gift);

  const gifts = [
    {
      name: 'Heart',
      description: 'Show some love!',
      price: 50,
      coins: 50,
      imageUrl: '/gifts/heart.png',
      animationUrl: '/gifts/heart-animation.gif',
      tags: ['love', 'basic'],
      isActive: true
    },
    {
      name: 'Super Chat',
      description: 'Make your message stand out!',
      price: 100,
      coins: 100,
      imageUrl: '/gifts/superchat.png',
      animationUrl: '/gifts/superchat-animation.gif',
      tags: ['chat', 'highlight'],
      isActive: true
    },
    {
      name: 'Trophy',
      description: "You're the champion!",
      price: 1000,
      coins: 1000,
      imageUrl: '/gifts/trophy.png',
      animationUrl: '/gifts/trophy-animation.gif',
      tags: ['premium', 'achievement'],
      isActive: true
    },
    {
      name: 'Fireworks',
      description: 'Light up the stream!',
      price: 500,
      coins: 500,
      imageUrl: '/gifts/fireworks.png',
      animationUrl: '/gifts/fireworks-animation.gif',
      tags: ['celebration', 'premium'],
      isActive: true
    },
    {
      name: 'GG',
      description: 'Good game!',
      price: 75,
      coins: 75,
      imageUrl: '/gifts/gg.png',
      animationUrl: '/gifts/gg-animation.gif',
      tags: ['gaming', 'basic'],
      isActive: true
    },
    {
      name: 'Crown',
      description: 'All hail the king/queen!',
      price: 2000,
      coins: 2000,
      imageUrl: '/gifts/crown.png',
      animationUrl: '/gifts/crown-animation.gif',
      tags: ['premium', 'special'],
      isActive: true
    },
    {
      name: 'Rain',
      description: 'Make it rain!',
      price: 300,
      coins: 300,
      imageUrl: '/gifts/rain.png',
      animationUrl: '/gifts/rain-animation.gif',
      tags: ['effects', 'premium'],
      isActive: true
    },
    {
      name: 'Confetti',
      description: 'Celebrate in style!',
      price: 150,
      coins: 150,
      imageUrl: '/gifts/confetti.png',
      animationUrl: '/gifts/confetti-animation.gif',
      tags: ['celebration', 'basic'],
      isActive: true
    },
    {
      name: 'MVP',
      description: 'Most Valuable Player!',
      price: 1500,
      coins: 1500,
      imageUrl: '/gifts/mvp.png',
      animationUrl: '/gifts/mvp-animation.gif',
      tags: ['gaming', 'premium'],
      isActive: true
    },
    {
      name: 'Spaceship',
      description: 'To the moon! 🚀',
      price: 750,
      coins: 750,
      imageUrl: '/gifts/spaceship.png',
      animationUrl: '/gifts/spaceship-animation.gif',
      tags: ['special', 'premium'],
      isActive: true
    }
  ];

  for (const giftData of gifts) {
    const existingGift = await giftRepository.findOne({ where: { name: giftData.name } });
    if (!existingGift) {
      await giftRepository.save(giftRepository.create(giftData));
    }
  }
}; 