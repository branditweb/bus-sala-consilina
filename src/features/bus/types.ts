export type BusPayload = {
  compagnia: string;
  orario_partenza: string;
  destinazione: string;
  sito_web_compagnia?: string | null;
  contatti?: string | null;
};
