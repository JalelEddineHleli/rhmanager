
import { Question } from './question';

export interface Sondage {
  content: Sondage[];
  totalPages: number;
  totalElements: number;
  id?: number;                // facultatif lors de la création
  titre: string;
  questions: Question[];
  createdat : string;
  dateExpiration?: string | null;}
