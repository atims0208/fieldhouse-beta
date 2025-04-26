import { Server, Socket } from 'socket.io'
import { WebSocket } from 'ws'
import { verifyToken } from '../utils/auth'
import { GiftTransaction } from '../models/GiftTransaction'
import { User } from '../models/User'
import { Gift } from '../models/Gift'
import { Stream } from '../models/Stream'
import { AppDataSource } from '../config/database'

export const handleGiftEvents = (io: Server, socket: Socket) => {
  socket.on('send_gift', async (data: {
    gift: Gift
    quantity: number
    streamId: string
  }) => {
    try {
      const token = socket.handshake.auth.token
      const decoded = await verifyToken(token)
      const userId = decoded.id

      // Get repositories
      const userRepo = AppDataSource.getRepository(User)
      const giftRepo = AppDataSource.getRepository(Gift)
      const streamRepo = AppDataSource.getRepository(Stream)
      const giftTransactionRepo = AppDataSource.getRepository(GiftTransaction)

      // Get entities
      const [sender, gift, stream] = await Promise.all([
        userRepo.findOneOrFail({ where: { id: userId } }),
        giftRepo.findOneOrFail({ where: { id: data.gift.id } }),
        streamRepo.findOneOrFail({ 
          where: { id: data.streamId },
          relations: ['user']
        })
      ])

      const totalCost = gift.coins * data.quantity

      // Check if sender has enough coins
      if (sender.coins < totalCost) {
        socket.emit('gift_error', { message: 'Insufficient coins' })
        return
      }

      // Create transaction
      const transaction = giftTransactionRepo.create({
        senderId: sender.id,
        receiverId: stream.user.id,
        giftId: gift.id,
        streamId: stream.id,
        quantity: data.quantity,
        totalCoins: totalCost
      })

      // Update balances
      sender.coins -= totalCost
      stream.user.coins += totalCost
      gift.timesGifted += data.quantity

      // Save all changes in a transaction
      await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        await Promise.all([
          transactionalEntityManager.save(sender),
          transactionalEntityManager.save(stream.user),
          transactionalEntityManager.save(gift),
          transactionalEntityManager.save(transaction)
        ])
      })

      // Broadcast gift animation to all viewers in the stream
      io.to(`stream:${stream.id}`).emit('gift_received', {
        gift: data.gift,
        sender: { username: sender.username },
        quantity: data.quantity
      })

    } catch (error) {
      console.error('Gift sending failed:', error)
      socket.emit('gift_error', { 
        message: 'Failed to send gift'
      })
    }
  })
}

export const handleGiftMessage = async (ws: WebSocket, message: any) => {
  try {
    // Verify the token from the message
    const decoded = await verifyToken(message.token)
    
    // Get the user from the database
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ id: decoded.id })
    
    if (!user) {
      ws.send(JSON.stringify({ error: 'User not found' }))
      return
    }

    // Process the gift
    // TODO: Implement gift processing logic
    
    // Send confirmation
    ws.send(JSON.stringify({
      type: 'gift_confirmation',
      data: {
        giftId: message.giftId,
        status: 'success'
      }
    }))
  } catch (error) {
    console.error('Error handling gift:', error)
    ws.send(JSON.stringify({ error: 'Failed to process gift' }))
  }
} 