import { prisma } from "@/lib/prisma";

export const listTrending = (onlyActive = false) =>
  prisma.trendingDestination.findMany({
    where: onlyActive ? { active: true } : undefined,
    orderBy: {
      city: "asc",
    },
  });

export const getTrendingById = (id: number) =>
  prisma.trendingDestination.findUnique({
    where: { id },
  });

export const createTrending = (data: {
  city: string;
  description: string;
  price_from: string | null;
  rating: string | null;
  duration: string | null;
  image_url: string | null;
  active: boolean;
}) =>
  prisma.trendingDestination.create({
    data,
  });

export const updateTrending = (
  id: number,
  data: {
    city?: string;
    description?: string;
    price_from?: string | null;
    rating?: string | null;
    duration?: string | null;
    image_url?: string | null;
    active?: boolean;
  }
) =>
  prisma.trendingDestination.update({
    where: { id },
    data,
  });

export const deleteTrending = (id: number) =>
  prisma.trendingDestination.delete({
    where: { id },
  });
