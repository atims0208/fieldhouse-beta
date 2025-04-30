import { DotLottie } from '@lottiefiles/dotlottie-web';

export interface GiftAnimation {
  name: string;
  type: 'dotlottie' | 'lottie' | 'gif';
  url: string;
  config?: {
    autoplay?: boolean;
    loop?: boolean;
    speed?: number;
  };
}

// Pre-configured gift animations
export const GIFT_ANIMATIONS: Record<string, GiftAnimation> = {
  heart: {
    name: 'Heart',
    type: 'dotlottie',
    url: '/animations/gifts/heart.lottie',
    config: {
      autoplay: true,
      loop: true,
    }
  },
  trophy: {
    name: 'Trophy',
    type: 'lottie',
    url: '/animations/gifts/trophy.json',
    config: {
      autoplay: true,
      loop: true,
    }
  },
  sparkle: {
    name: 'Sparkle',
    type: 'gif',
    url: '/animations/gifts/sparkle.gif',
  }
};

// Helper function to load a DotLottie animation
export const loadDotLottieAnimation = async (
  canvas: HTMLCanvasElement,
  animation: GiftAnimation
) => {
  if (animation.type !== 'dotlottie') return;

  const dotLottie = new DotLottie({
    canvas,
    ...animation.config,
    src: animation.url,
  });

  return dotLottie;
};

// Helper function to get animation by name
export const getGiftAnimation = (name: string): GiftAnimation | undefined => {
  return GIFT_ANIMATIONS[name.toLowerCase()];
};

// Helper function to register a new gift animation
export const registerGiftAnimation = (
  key: string, 
  animation: GiftAnimation
) => {
  GIFT_ANIMATIONS[key.toLowerCase()] = animation;
}; 