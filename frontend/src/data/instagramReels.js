import { getOptimizedImageUrl } from '../utils/imageHelper';

// Instagram Configuration and Authentic Shoppable Reels for The Ethnic Touch
export const INSTAGRAM_HANDLE = 'theethnictouch.co';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/theethnictouch.co';

export const featuredReels = [
    {
        id: 'reel-hit',
        isHitReel: true,
        instagramUrl: 'https://www.instagram.com/theethnictouch.co/reel/DejumS8Cwm2/',
        reelCode: 'DejumS8Cwm2', // Hit reel ID from user
        title: 'The Signature Weave & Silhouette ✨',
        caption: 'Pure handcrafted kurti styled with timeless elegance. Handpicked weaves with built-in 2-inch alteration margins.',
        author: '@theethnictouch.co',
        likes: 'Trending Hit',
        views: 'Featured Reel',
        thumbnail: getOptimizedImageUrl('/images/reels/reel-hit.jpg'),
        productId: 'p_Pi_88000',
        product: {
            id: 'p_Pi_88000',
            name: 'Pink Paisley Printed Straight Kurti',
            price: 549,
            imageUrl: getOptimizedImageUrl('./images/kurthi_peach.png'),
            category: 'Straight Cut',
            fabric: 'Pure Cotton'
        }
    },
    {
        id: 'reel-2',
        isHitReel: false,
        instagramUrl: 'https://www.instagram.com/reel/DeZZezHTEWX',
        reelCode: 'DeZZezHTEWX',
        title: 'Olive Green Floral Print Kurti 🌿',
        caption: 'Crisp straight-cut silhouette loomed for long workdays and serene evenings.',
        author: '@theethnictouch.co',
        likes: 'Patron Favorite',
        views: 'Latest Drop',
        thumbnail: getOptimizedImageUrl('/images/reels/reel-2.jpg'),
        productId: 'p_Ol_98900',
        product: {
            id: 'p_Ol_98900',
            name: 'Olive Green Floral Print Sleeveless Short Kurti',
            price: 449,
            imageUrl: getOptimizedImageUrl('./images/kurthi_mint.png'),
            category: 'Straight Cut',
            fabric: 'Pure Cotton'
        }
    },
    {
        id: 'reel-3',
        isHitReel: false,
        instagramUrl: 'https://www.instagram.com/theethnictouch.co/reel/De14lUDiWWN/',
        reelCode: 'De14lUDiWWN',
        title: 'Mustard Yellow Mandala Short Kurti ☀️',
        caption: 'Breezy sleeveless cut with intricate white circular medallion prints.',
        author: '@theethnictouch.co',
        likes: 'Best Seller',
        views: 'Latest Drop',
        thumbnail: getOptimizedImageUrl('/images/reels/reel-3.jpg'),
        productId: 'p_Mu_31700',
        product: {
            id: 'p_Mu_31700',
            name: 'Mustard Yellow Mandala Print Sleeveless Short Kurti',
            price: 449,
            imageUrl: getOptimizedImageUrl('./images/login_art.png'),
            category: 'Straight Cut',
            fabric: 'Pure Cotton'
        }
    },
    {
        id: 'reel-4',
        isHitReel: false,
        instagramUrl: 'https://www.instagram.com/theethnictouch.co/reel/Deo8CMTixAn/',
        reelCode: 'Deo8CMTixAn',
        title: 'Chocolate Brown Textured Straight Kurti 🌸',
        caption: 'Features our signature 2-inch let-out margins for bespoke comfort wherever you go.',
        author: '@theethnictouch.co',
        likes: 'Must Have',
        views: 'Latest Drop',
        thumbnail: getOptimizedImageUrl('/images/reels/reel-4.jpg'),
        productId: 'p_Ch_40100',
        product: {
            id: 'p_Ch_40100',
            name: 'Chocolate Brown Textured Straight Kurti',
            price: 549,
            imageUrl: getOptimizedImageUrl('./images/kurthi_lavender.png'),
            category: 'A-Line',
            fabric: 'Pure Cotton'
        }
    }
];
