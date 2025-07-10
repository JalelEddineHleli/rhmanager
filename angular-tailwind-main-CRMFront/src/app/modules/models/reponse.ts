import { Question } from "./question";
import { Sondage } from "./sondage";


export interface reponse {
    id: number;
    email: string;
    choix: string;
    question : Question;
    dateReponse?: string;
    sondage: Sondage;
  }
  
export interface GroupedReponse {
    email: string;
    date: string;
    reponses: reponse[];
  }
  
  export interface QuestionStats {
    question: string;
    options: { [key: string]: number };
    total: number;
  }