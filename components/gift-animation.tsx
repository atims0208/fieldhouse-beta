import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GiftAnimationProps {
  gift: {
    id: string
    name: string
    animationUrl: string
  }
  sender: {
    username: string
  }
  quantity: number
  onComplete?: () => void
  className?: string
}

export function GiftAnimation({
  gift,
  sender,
  quantity,
  onComplete,
  className
}: GiftAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 5000) // Animation duration

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 pointer-events-none flex items-center justify-center z-50",
            className
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="relative w-32 h-32 mx-auto"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: 2,
                ease: "easeInOut"
              }}
            >
              <Image
                src={gift.animationUrl}
                alt={gift.name}
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.div
              className="mt-4 text-white text-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lg font-bold">
                {sender.username} sent {quantity}x {gift.name}!
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 