import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AnimatePresence as FramerAnimatePresence } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { cn } from '@/lib/utils'
import { loadDotLottieAnimation, type GiftAnimation } from '@/lib/gift-animations'
import { usePathname } from 'next/navigation'

interface GiftAnimationEffectsProps {
  gift: {
    id: string
    name: string
    animationUrl: string
    animationType?: GiftAnimation['type']
  }
  sender: {
    username: string
  }
  quantity: number
  onComplete?: () => void
  className?: string
}

const animationVariants = {
  // Entry animations
  floatIn: {
    initial: { opacity: 0, scale: 0.5, y: 100 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.5, y: -100 }
  },
  popIn: {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: [0, 1.2, 1],
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0,
      transition: { duration: 0.3 }
    }
  },
  slideIn: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  },

  // Effect animations
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: Infinity
      }
    }
  },
  rotate: {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  bounce: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 1,
        repeat: Infinity
      }
    }
  }
}

const getGiftAnimation = (giftName: string) => {
  const name = giftName.toLowerCase()
  
  switch (name) {
    case 'heart':
      return {
        container: animationVariants.floatIn,
        effect: animationVariants.pulse
      }
    case 'trophy':
      return {
        container: animationVariants.popIn,
        effect: animationVariants.rotate
      }
    case 'crown':
      return {
        container: animationVariants.slideIn,
        effect: animationVariants.bounce
      }
    // Add more gift-specific animations
    default:
      return {
        container: animationVariants.popIn,
        effect: animationVariants.pulse
      }
  }
}

export function GiftAnimationEffects({
  gift,
  sender,
  quantity,
  onComplete,
  className
}: GiftAnimationEffectsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animation = getGiftAnimation(gift.name)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  useEffect(() => {
    if (gift.animationType === 'dotlottie' && canvasRef.current) {
      loadDotLottieAnimation(canvasRef.current, {
        name: gift.name,
        type: 'dotlottie',
        url: gift.animationUrl,
        config: {
          autoplay: true,
          loop: true
        }
      })
    }
  }, [gift.animationType, gift.animationUrl, gift.name])

  // Don't show animations on auth pages
  if (pathname?.includes('/login') || pathname?.includes('/register')) {
    return null
  }

  return (
    <FramerAnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 pointer-events-none flex items-center justify-center z-30",
            className
          )}
          variants={animation.container}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="text-center">
            <motion.div
              className="relative w-32 h-32 mx-auto"
              variants={animation.effect}
              animate="animate"
            >
              {gift.animationType === 'dotlottie' ? (
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full"
                />
              ) : gift.animationType === 'lottie' ? (
                <Player
                  autoplay
                  loop
                  src={gift.animationUrl}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Image
                  src={gift.animationUrl}
                  alt={gift.name}
                  fill
                  className="object-contain"
                />
              )}
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
    </FramerAnimatePresence>
  )
} 