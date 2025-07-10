import { ProspectDTO } from "./prospectdto";

export interface HistoriqueInteractionDTO {
    content: HistoriqueInteractionDTO[];
    totalPages: number;
    totalElements: number;
    id: number;
    uuid: string;
    typeInteraction :string 
    date: string;
    description: string;
    prospect : ProspectDTO
    useruuid :string;
    offreuuid :string;
  
  }