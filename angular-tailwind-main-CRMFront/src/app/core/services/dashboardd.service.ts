import { Injectable } from '@angular/core';
import { Observable, forkJoin, take, map } from 'rxjs';
import { ClientService } from './ContactService/client.service';
import { ProspectService } from './ContactService/prospect.service';
import { NotificationSocketService } from './notification-socket.service';
import { OffrepersonelleService } from './OffreService/offrepersonelle.service';
import { SondageService } from './OffreService/sondage.service';
import { DashboardData } from 'src/app/modules/models/DashboardData';
@Injectable({ providedIn: 'root' })
export class DashboarddService {
  constructor(
    private prospectService: ProspectService,
    private clientService: ClientService,
    private sondageService: SondageService,
    private offrePersonelleService: OffrepersonelleService,
    private notificationService: NotificationSocketService
  ) {}

  private generateMonthlyTrend(): { month: string; prospects: number; clients: number }[] {
    // Simulation de données mensuelles
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      prospects: Math.floor(Math.random() * 100) + 50,
      clients: Math.floor(Math.random() * 30) + 10
    }));
  }

  getDashboardData(): Observable<any> {
    return forkJoin({
      prospects: this.prospectService.countAllProspects(),
      clients: this.clientService.countAllClients(),
      openAffaires: this.offrePersonelleService.countOpen(),
      sondages: this.sondageService.countSondagesSentThisMonth(),
      statusDist: this.offrePersonelleService.statusDistribution(),
      topProspects: this.prospectService.getTopNProspectsByInteractions(5),
      notifications: this.notificationService.getNotifications()
    }).pipe(
      map(results => ({
        kpis: {
          totalProspects: results.prospects,
          totalClients: results.clients,
          conversionRate: results.prospects > 0 ? 
            (results.clients / results.prospects) * 100 : 0,
          openAffaires: results.openAffaires,
          sondagesActifs: results.sondages
        },
        charts: {
          contactsByType: [
            { type: 'Prospects', count: results.prospects },
            { type: 'Clients', count: results.clients }
          ],
          affairesByStatus: Object.entries(results.statusDist).map(([status, count]) => 
            ({ status, count })),
          monthlyTrend: this.generateMonthlyTrend()
        },
        recentActivities: results.notifications,
        topProspects: results.topProspects
      }))
    );
  }
}