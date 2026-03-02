export type ChatBusResult = {
  id: number;
  compagnia: string;
  destinazione: string;
  orario_partenza: string;
  sito_web_compagnia: string | null;
  contatti: string | null;
};

export type ChatApiResponse = {
  reply: string;
  buses: ChatBusResult[];
};
