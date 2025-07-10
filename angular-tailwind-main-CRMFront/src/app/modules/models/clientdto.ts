import { EntrepriseDto } from "./entreprise-dto";
import { TicketDTO } from "./ticketDTO";

export interface ClientDTO {
    content: ClientDTO[];
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
    type:'NOUVEAU' | 'VIP' | 'IMPORTANT';
    tickets: TicketDTO[]
  }