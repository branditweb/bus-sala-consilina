import { prisma } from "@/lib/prisma";

export const listBus = () =>
  prisma.bus.findMany({
    orderBy: {
      orario_partenza: "asc",
    },
  });

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
