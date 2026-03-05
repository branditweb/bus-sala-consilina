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
- CLI Vercel autenticata e deploy monitorabile da terminale.
- Correzione configurazione deploy applicata con `vercel.json` (`framework: nextjs`, `buildCommand: npm run build`).

## Problemi Rilevati
- Connessione database: **attiva**. Verifica effettuata con Prisma (`migrate status` e introspezione `db pull` su NeonDB).
- Sincronizzazione Prisma/NeonDB: **corretta**. Lo schema risulta aggiornato e la tabella `Bus` è presente.
- API `src/app/api/bus`: **nessun errore bloccante** per il passaggio dati (lint/build OK e CRUD operativo), ma la gestione errori è troppo generica: in alcuni `catch` gli errori server vengono restituiti come `400` invece di `500`, rendendo più difficile diagnosticare problemi reali di backend.
- Deploy Vercel: rilevato errore iniziale dovuto a `Output Directory` errata (`public`). Problema mitigato impostando preset Next.js e aggiungendo `vercel.json` di forzatura.
