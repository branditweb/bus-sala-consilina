# Brief Prodotto

## Obiettivo prodotto
Realizzare una piattaforma ibrida (ricerca classica + assistente AI) per la consultazione degli orari e la pianificazione dei viaggi dal terminal bus di Sala Consilina.

## Utente target
Pendolari, studenti e turisti che necessitano di informazioni rapide e intuitive sulle autolinee in transito per il Vallo di Diano.

## Funzioni core
1. Interfaccia di Ricerca Ibrida: Sistema con filtri classici (destinazione, data, ora) integrato con una chat AI per richieste in linguaggio naturale.
2. Assistente AI Specializzato: Un "cervello pensante" addestrato sui dati reali del database (sistema chiuso) per rispondere come un esperto di trasporti locale.
3. Pannello Admin CRUD: Area riservata per la gestione completa (inserimento, modifica, eliminazione) dei dati dei bus tramite Prisma.
4. Database Persistente (NeonDB): Infrastruttura scalabile per garantire l'integrita' e la velocita' di accesso alle informazioni sui viaggi.
5. Design Responsive & Moderno: UI realizzata con Tailwind CSS, ottimizzata per l'uso da mobile, che segue i design indicati.

## Fuori scope
1. Transazioni Monetarie: l'app non gestisce pagamenti diretti, ma rimanda ai siti ufficiali o ai contatti delle compagnie.
2. Tracciamento GPS in tempo reale: non e' prevista la visualizzazione della posizione dei bus sulla mappa.
3. App Mobile Nativa: il prodotto resta una Web App ottimizzata, senza pubblicazione su store iOS/Android.
4. Area Riservata Utenti: non e' prevista la creazione di profili per i viaggiatori; l'accesso e' pubblico.
5. Validazione Biglietti: l'app non funge da sistema di controllo o emissione titoli di viaggio certificati.

## Tonalita' UX
Pulito, moderno, assistenziale, intuitivo e affidabile.

## Priorita'
1. Infrastruttura e CRUD: garantire che la gestione dei dati sia stabile e sicura (gia' completata).
2. Interfaccia come da design richiesto.
3. Integrazione AI (Brain): collegamento dell'assistente conversazionale alla base dati reale per evitare allucinazioni.
