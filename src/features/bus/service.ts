import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const listBus = () =>
  prisma.bus.findMany({
    orderBy: {
      orario_partenza: "asc",
    },
  });

export const listBusFiltered = (filters: {
  destinazione?: string;
  data?: string;
  ora?: string;
}) => {
  const where: Prisma.BusWhereInput = {};

  if (filters.destinazione && filters.destinazione.trim().length > 0) {
    where.destinazione = {
      contains: filters.destinazione.trim(),
      mode: "insensitive",
    };
  }

  if (filters.data) {
    const dayStart = new Date(`${filters.data}T00:00:00`);
    const dayEnd = new Date(`${filters.data}T23:59:59.999`);

    if (!Number.isNaN(dayStart.getTime()) && !Number.isNaN(dayEnd.getTime())) {
      where.orario_partenza = {
        gte: dayStart,
        lte: dayEnd,
      };
    }
  }

  if (filters.data && filters.ora) {
    const requestedTime = new Date(`${filters.data}T${filters.ora}:00`);

    if (!Number.isNaN(requestedTime.getTime())) {
      const currentFilter =
        where.orario_partenza && typeof where.orario_partenza === "object"
          ? where.orario_partenza
          : {};

      where.orario_partenza = {
        ...currentFilter,
        gte: requestedTime,
      };
    }
  }

  return prisma.bus.findMany({
    where,
    orderBy: {
      orario_partenza: "asc",
    },
    take: 20,
  });
};

export const getBusById = (id: number) =>
  prisma.bus.findUnique({
    where: { id },
  });

export const createBus = (data: {
  compagnia: string;
  orario_partenza: Date;
  destinazione: string;
  sito_web_compagnia: string | null;
  contatti: string | null;
}) =>
  prisma.bus.create({
    data,
  });

export const updateBus = (
  id: number,
  data: {
    compagnia?: string;
    orario_partenza?: Date;
    destinazione?: string;
    sito_web_compagnia?: string | null;
    contatti?: string | null;
  }
) =>
  prisma.bus.update({
    where: { id },
    data,
  });

export const deleteBus = (id: number) =>
  prisma.bus.delete({
    where: { id },
  });
