import { z } from 'zod';

// ========================================
// 1. BREWING GUIDE
// ========================================
export const brewingGuideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  difficulty: z.enum(['Einfach', 'Mittel', 'Fortgeschritten']),
  brewTime: z.string().optional(),
  heroImage: z.string().min(1, 'Hero image is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
  defaultServings: z.number().default(2),
  ingredients: z.array(
    z.object({
      amount: z.string(),
      ingredient: z.string(),
    })
  ).default([]),
  steps: z.array(
    z.object({
      time: z.string(),
      instruction: z.string(),
    })
  ).default([]),
  tips: z.string().max(500, 'Max 500 characters').optional(),
  ogImage: z.string().optional(),
});

export type BrewingGuide = z.infer<typeof brewingGuideSchema>;

// ========================================
// 2. MENU ITEM (COFFEE)
// ========================================
export const menuItemCoffeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(1, 'Description is required').max(150, 'Max 150 characters'),
  tag: z.enum(['Kurz', 'Milch', 'Filter', 'Kalt', 'Schwarz']).optional(),
  image: z.string().min(1, 'Image is required'),
});

export type MenuItemCoffee = z.infer<typeof menuItemCoffeeSchema>;

// ========================================
// 3. MENU ITEM (PASTRY)
// ========================================
export const menuItemPastrySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(1, 'Description is required').max(150, 'Max 150 characters'),
  tag: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  allergens: z.array(z.string()).default([]),
});

export type MenuItemPastry = z.infer<typeof menuItemPastrySchema>;

// ========================================
// 4. EVENT / WORKSHOP
// ========================================
export const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(300, 'Max 300 characters'),
  maxParticipants: z.number().min(1, 'Max participants is required'),
  price: z.number().min(0, 'Price must be positive'),
  level: z.enum(['Anfänger', 'Fortgeschritten', 'Alle Niveaus']),
  image: z.string().min(1, 'Image is required'),
});

export type Event = z.infer<typeof eventSchema>;

// ========================================
// 5. RETAIL COFFEE
// ========================================
export const retailCoffeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  origin: z.string().min(1, 'Origin is required'),
  price: z.string().min(1, 'Price is required'),
  pricePerKg: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
  flavourProfile: z.array(z.string()).min(1, 'At least one flavour tag is required'),
  roastLevel: z.enum(['Light', 'Medium', 'Dark']),
  flavourType: z.enum(['Fruity & lively', 'Sweet & chocolaty', 'Floral & light']).optional(),
  acidity: z.enum(['Low', 'Medium', 'High']).optional(),
  processingMethod: z.enum(['Washed', 'Natural', 'Honey']).optional(),
  category: z.enum(['Micro Lot', 'Limited', 'Exotic']).optional(),
  producerStory: z.string().max(1000, 'Max 1000 characters').optional(),
  soldOut: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

export type RetailCoffee = z.infer<typeof retailCoffeeSchema>;

// ========================================
// 6. BUSINESS INFORMATION
// ========================================
export const businessInfoSchema = z.object({
  businessName: z.string().default('Hellers Kaffees'),
  street: z.string().min(1, 'Street is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required'),
  openingHours: z.array(
    z.object({
      day: z.enum(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']),
      hours: z.string(),
    })
  ).default([]),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  aboutText: z.string().max(500, 'Max 500 characters').optional(),
});

export type BusinessInfo = z.infer<typeof businessInfoSchema>;

// ========================================
// 7. MEDIA & BRANDING
// ========================================
export const mediaBrandingSchema = z.object({
  type: z.enum(['Hero Image', 'Logo', 'Favicon', 'OG Image']),
  purpose: z.string().optional(),
  file: z.string().min(1, 'File is required'),
  altText: z.string().optional(),
});

export type MediaBranding = z.infer<typeof mediaBrandingSchema>;

// ========================================
// CONTENT TYPE METADATA
// ========================================
export interface ContentTypeConfig {
  id: string;
  label: string;
  icon: string;
  schema: z.ZodSchema;
  description: string;
}

export const contentTypes: Record<string, ContentTypeConfig> = {
  brewingGuide: {
    id: 'brewingGuide',
    label: 'Brewing Guide',
    icon: '☕',
    schema: brewingGuideSchema,
    description: 'Coffee brewing methods and instructions',
  },
  menuItemCoffee: {
    id: 'menuItemCoffee',
    label: 'Menu Item (Coffee)',
    icon: '☕',
    schema: menuItemCoffeeSchema,
    description: 'Coffee menu items with prices',
  },
  menuItemPastry: {
    id: 'menuItemPastry',
    label: 'Menu Item (Pastry)',
    icon: '🥐',
    schema: menuItemPastrySchema,
    description: 'Pastries and baked goods',
  },
  event: {
    id: 'event',
    label: 'Event / Workshop',
    icon: '📅',
    schema: eventSchema,
    description: 'Events, workshops, and classes',
  },
  retailCoffee: {
    id: 'retailCoffee',
    label: 'Retail Coffee',
    icon: '🌱',
    schema: retailCoffeeSchema,
    description: 'Retail coffee beans and products',
  },
  businessInfo: {
    id: 'businessInfo',
    label: 'Business Information',
    icon: '🏪',
    schema: businessInfoSchema,
    description: 'Contact details and opening hours',
  },
  mediaBranding: {
    id: 'mediaBranding',
    label: 'Media & Branding',
    icon: '🎨',
    schema: mediaBrandingSchema,
    description: 'Brand assets and images',
  },
};

// ========================================
// ENTRY WRAPPER
// ========================================
export interface ContentEntry<T = any> {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  data: T;
}
