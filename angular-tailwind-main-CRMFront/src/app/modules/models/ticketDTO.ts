export interface TicketDTO{
    content: TicketDTO[];
    totalPages: number;
    totalElements: number;
    id: number;
    uuid: string;
    numero: string;
  description: string;
  priorite: string;
  createdAt: string; 
  resoluAt: string | null;
  statut: 'PAS_ENCORE' | 'EN_COURS' | 'RESOLU'; // Enum possible
  uuidclient: string;

    
}
