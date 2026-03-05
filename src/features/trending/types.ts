export type TrendingPayload = {
  city: string;
  description: string;
  price_from?: string | null;
  rating?: string | null;
  duration?: string | null;
  image_url?: string | null;
  active?: boolean;
};
