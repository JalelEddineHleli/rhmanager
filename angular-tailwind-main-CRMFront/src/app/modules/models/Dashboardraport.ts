
// src/app/interfaces/dashboard-data.interface.ts

export interface Dashboardrapport {
    prospects?: number;
    newProspectsThisMonth?: number;
    clients?: number;
    newClientsThisMonth?: number;
    offerStatusDistribution?: { [key: string]: number }; // Map en TypeScript
    sondageStats?: SondageStats;
    recentActivities?: string[];
    totalEntreprises?: number;
    // Ajoutez ici toutes les autres propriétés que vous avez dans votre DTO Java
  }
  
  export interface SondageStats {
    nombreTotalSondages?: number;
    nombreTotalReponses?: number;
    moyenneSatisfaction?: number;
  }