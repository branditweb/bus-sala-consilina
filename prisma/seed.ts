import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bus.deleteMany();

  await prisma.bus.createMany({
    data: [
      {
        compagnia: "Autolinee Curcio",
        orario_partenza: new Date("2026-03-03T06:30:00+01:00"),
        destinazione: "Salerno",
        sito_web_compagnia: "https://www.autolineecurcio.it",
        contatti: "+39 0975 123456"
      },
      {
        compagnia: "Sita Sud",
        orario_partenza: new Date("2026-03-03T10:00:00+01:00"),
        destinazione: "Roma",
        sito_web_compagnia: "https://www.sitasudtrasporti.it",
        contatti: "+39 089 7654321"
      },
      {
        compagnia: "Autolinee Curcio",
        orario_partenza: new Date("2026-03-03T12:15:00+01:00"),
        destinazione: "Napoli",
        sito_web_compagnia: "https://www.autolineecurcio.it",
        contatti: "+39 0975 123456"
      },
      {
        compagnia: "Sita Sud",
        orario_partenza: new Date("2026-03-03T15:45:00+01:00"),
        destinazione: "Potenza",
        sito_web_compagnia: "https://www.sitasudtrasporti.it",
        contatti: "+39 089 7654321"
      },
      {
        compagnia: "Autolinee Curcio",
        orario_partenza: new Date("2026-03-03T18:20:00+01:00"),
        destinazione: "Battipaglia",
        sito_web_compagnia: "https://www.autolineecurcio.it",
        contatti: "+39 0975 123456"
      }
    ]
  });

  console.log("Seeding completato: inseriti 5 viaggi.");
}

main()
  .catch((error) => {
    console.error("Errore durante il seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
