
export interface OffrePersonelleDTO {
    content: OffrePersonelleDTO[];
    totalPages: number;
    totalElements: number;
    id: number;
    uuid: string;
    description: string;
    titleProduct: string;
    statut: 'PERDU' | 'EN_NEGOCIATION' | 'GAGNE';
    createdAt: string; 
  }