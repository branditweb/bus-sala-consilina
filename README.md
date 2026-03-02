# Terminal Bus Sala Consilina

## Obiettivo del progetto
Realizzare **Terminal Bus Sala Consilina**, una piattaforma per la gestione e consultazione dei servizi bus legati al terminal di Sala Consilina.

## Stack tecnologico scelto
- **Next.js**
- **NeonDB**
- **Vercel**

## Stato attuale dei lavori
**Gestione CRUD completa terminata (Create, Read, Update, Delete).**

### Note tecniche
È stata preparata una base **Next.js + Tailwind CSS** con struttura modulare (`src/app`, `src/components`, `src/features`, `src/lib`) per evitare file monolitici e facilitare la crescita del progetto.

### Stato integrazione
- Ambiente locale sincronizzato con l'implementazione completa del CRUD.
- Repository GitHub sincronizzato su `main` (commit locale e remoto allineati).
- Deploy Vercel demandato al collegamento del repository su dashboard/progetto.

## Problemi Rilevati
- Connessione database: **attiva**. Verifica effettuata con Prisma (`migrate status` e introspezione `db pull` su NeonDB).
- Sincronizzazione Prisma/NeonDB: **corretta**. Lo schema risulta aggiornato e la tabella `Bus` è presente.
- API `src/app/api/bus`: **nessun errore bloccante** per il passaggio dati (lint/build OK e CRUD operativo), ma la gestione errori è troppo generica: in alcuni `catch` gli errori server vengono restituiti come `400` invece di `500`, rendendo più difficile diagnosticare problemi reali di backend.
- Limite operativo attuale: da questo ambiente non è installata la CLI Vercel (`vercel` non disponibile), quindi la verifica diretta dello stato build va fatta dalla dashboard Vercel.
