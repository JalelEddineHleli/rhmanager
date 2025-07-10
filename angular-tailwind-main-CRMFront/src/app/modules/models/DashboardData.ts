import { Notif } from "./notif";
import { ProspectDTO } from "./prospectdto";

// Nouveau modèle pour le dashboard dans Angular
export interface DashboardData {
    kpis: {
      totalProspects: number;
      totalClients: number;
      conversionRate: number;
      openAffaires: number;
      sondagesActifs: number;
    };
    charts: {
      contactsByType: { type: string; count: number }[];
      affairesByStatus: { status: string; count: number }[];
      monthlyTrend: { month: string; prospects: number; clients: number }[];
    };
    recentActivities: Notif[];
    topProspects: ProspectDTO[];
  }