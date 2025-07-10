import { EntrepriseDto } from "./entreprise-dto";

export interface ProspectDTO {
    content: ProspectDTO[];
    totalPages: number;
    totalElements: number;
    id: number;
    uuid: string;
    nom: string;
    prenom: string;
    adresse: string;
    telephone: string;
    email: string;
    poste: string;
    entreprise: EntrepriseDto;
    createdAt: string; 
    type : 'NOUVEAU' | 'PERDU'| 'EN_NEGOCIATION'|'GAGNE';
    interactionCount: number;
    // Représente la date de création
   // interactions: HistoriqueInteractionDTO[]; // Historique des interactions
  }