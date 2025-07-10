import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { forkJoin, Subscription, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Interfaces
import { ProspectDTO } from 'src/app/modules/models/prospectdto';
import { MatDialog } from '@angular/material/dialog';

interface DashboardStat {
  title: string;
  count: number;
  new?: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  route: string;
  percentage?: number;
  description?: string;
}

interface OfferStatusDistribution {
  EN_NEGOCIATION?: number;
  GAGNE?: number;
  PERDU?: number;
  [key: string]: number | undefined;
}

// UPDATED: Interface to store conversion rate
interface ClientsByInteractionData {
  month: string;
  conversionRate: number; // Now stores the percentage
}

interface MonthlyActivityData {
  month: string;
  newProspects: number;
  newClients: number;
  newPersonalOffers: number;
  sentSurveys: number;
}

// Helper Interface for SondageStats
interface SondageStats {
  nombreTotalSondages: number;
  nombreTotalReponses: number;
  nombreMoyenReponsesParSondage: number;
}

// UPDATED: DashboardCombinedData to use the new ClientsByInteractionData
interface DashboardCombinedData {
  prospects: number;
  clients: number; // Total clients
  newProspectsThisMonth: number;
  newClientsThisMonth: number;
  totalPersonalOffers: number;
  totalGeneralOffers: number;
  totalInteractions: number; // Renamed for clarity to reflect cumulative total
  offerStatusDistribution: OfferStatusDistribution;
  sondageStats: SondageStats;
  topProspects: ProspectDTO[];
  clientsByInteractions: ClientsByInteractionData[]; // Updated interface
  monthlyActivity: MonthlyActivityData[];
}

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    ChartModule,
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class NftComponent implements OnInit, OnDestroy {
  stats: DashboardStat[] = [];
  loading = true;

  clientsByInteractionsData: any;
  clientsByInteractionsOptions: any;

  offerStatusPieData: any;
  offerStatusPieOptions: any;

  monthlyActivityData: any;
  monthlyActivityOptions: any;

  topProspects: ProspectDTO[] = [];
  keyInsight: { message: string; type: 'success' | 'warning' | 'info'; icon: string } | null = null;

  private subscriptions = new Subscription();

  // Variables to hold current month's actual data
  private currentNewProspects = 0;
  private currentNewClients = 0; // New clients for the current month
  private currentNewPersonalOffers = 0;
  private currentSentSurveys = 0;
  private currentTotalClients = 0; // Total clients (cumulative)
  private currentTotalInteractions = 0; // Total interactions (cumulative)

  constructor(
  
  ) { }

  ngOnInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

    const commonAxisOptions = {
      ticks: {
        color: textColorSecondary,
        font: { weight: 500 },
        callback: function (value: number) {
          return value % 1 === 0 ? value : null;
        }
      },
      grid: {
        color: 'rgba(0,0,0,0.05)',
        drawBorder: false
      }
    };

    // UPDATED: clientsByInteractionsOptions for percentage display
    this.clientsByInteractionsOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        },
        tooltip: { // Added tooltip callback for percentage
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1) + '%'; // Format as percentage
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          ...commonAxisOptions,
          grid: {
            color: surfaceBorder,
            drawOnChartArea: false
          }
        },
        y: {
          ...commonAxisOptions,
          min: 0,
          max: 100, // Percentage scale
          ticks: {
            ...commonAxisOptions.ticks,
            callback: function (value: number) { // Add % sign to y-axis labels
              return value % 1 === 0 ? value + '%' : null;
            }
          }
        }
      }
    };

    this.offerStatusPieOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += context.formattedValue;
                if (context.dataset.data.length > 0) {
                  const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                  const percentage = (context.parsed / total * 100).toFixed(1) + '%';
                  label += ` (${percentage})`;
                }
              }
              return label;
            }
          }
        }
      }
    };

    this.monthlyActivityOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ...commonAxisOptions
        },
        y: {
          ...commonAxisOptions,
          beginAtZero: true
        }
      }
    };
  }


  getMonthlyActivityDataMock(): Observable<MonthlyActivityData[]> {
    const currentMonthIndex = new Date().getMonth(); // 0=Jan, 5=Juin
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data: MonthlyActivityData[] = [];
  
    // Données historiques (Janvier → Avril)
    const historicalData = [
      { month: 'Jan', newProspects: 15, newClients: 5, newPersonalOffers: 8, sentSurveys: 20 },
      { month: 'Fév', newProspects: 18, newClients: 7, newPersonalOffers: 10, sentSurveys: 25 },
      { month: 'Mar', newProspects: 22, newClients: 9, newPersonalOffers: 12, sentSurveys: 30 },
      { month: 'Avr', newProspects: 19, newClients: 6, newPersonalOffers: 9, sentSurveys: 28 },
    ];
  
    // Génère tous les mois jusqu'au mois actuel
    const allMonths: MonthlyActivityData[] = [];
    for (let i = 0; i <= currentMonthIndex; i++) {
      if (i < historicalData.length) {
        allMonths.push(historicalData[i]);
      } else if (i === currentMonthIndex) {
        allMonths.push({
          month: monthNames[i],
          newProspects: this.currentNewProspects,
          newClients: this.currentNewClients,
          newPersonalOffers: this.currentNewPersonalOffers,
          sentSurveys: this.currentSentSurveys
        });
      } else {
        const lastData = allMonths[allMonths.length - 1] || historicalData[historicalData.length - 1];
        allMonths.push({
          month: monthNames[i],
          newProspects: lastData.newProspects + Math.floor(Math.random() * 5) - 2,
          newClients: lastData.newClients + Math.floor(Math.random() * 3) - 1,
          newPersonalOffers: lastData.newPersonalOffers + Math.floor(Math.random() * 4) - 1,
          sentSurveys: lastData.sentSurveys + Math.floor(Math.random() * 7) - 3
        });
      }
    }
  
    // On prend les 5 ou 6 derniers mois
    const numberOfMonthsToShow = 6; // ou 5 si vous voulez seulement 5 derniers mois
    const startIndex = Math.max(0, allMonths.length - numberOfMonthsToShow);
    const lastMonths = allMonths.slice(startIndex);
  
    return of(lastMonths);
  }

 /* getMonthlyActivityDataMock(): Observable<MonthlyActivityData[]> {
    const currentMonthIndex = new Date().getMonth(); // 0 for Jan, 4 for May
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data: MonthlyActivityData[] = [];

    // Historical data up to April
    const historicalData = [
      { month: 'Jan', newProspects: 15, newClients: 5, newPersonalOffers: 8, sentSurveys: 20 },
      { month: 'Fév', newProspects: 18, newClients: 7, newPersonalOffers: 10, sentSurveys: 25 },
      { month: 'Mar', newProspects: 22, newClients: 9, newPersonalOffers: 12, sentSurveys: 30 },
      { month: 'Avr', newProspects: 19, newClients: 6, newPersonalOffers: 9, sentSurveys: 28 },
    ];

    for (let i = 0; i <= currentMonthIndex; i++) {
      if (i < historicalData.length) {
        data.push(historicalData[i]);
      } else if (i === currentMonthIndex) {
        // For the CURRENT month, use the actual fetched data
        data.push({
          month: monthNames[i],
          newProspects: this.currentNewProspects,
          newClients: this.currentNewClients,
          newPersonalOffers: this.currentNewPersonalOffers,
          sentSurveys: this.currentSentSurveys
        });
      }
   /*   else {
        // For future months (if any), generate projected data based on current month's values
        const lastMonthData = data[data.length - 1];
        data.push({
          month: monthNames[i],
          newProspects: lastMonthData.newProspects + Math.floor(Math.random() * 5) - 2,
          newClients: lastMonthData.newClients + Math.floor(Math.random() * 3) - 1,
          newPersonalOffers: lastMonthData.newPersonalOffers + Math.floor(Math.random() * 4) - 1,
          sentSurveys: lastMonthData.sentSurveys + Math.floor(Math.random() * 7) - 3
        });
      }
    }
    return of(data);
  }
*/
  // UPDATED: getClientsByInteractionsDataMock for CUMULATIVE total clients vs cumulative total interactions
  getClientsByInteractionsDataMock(): Observable<ClientsByInteractionData[]> {
    const currentMonthIndex = new Date().getMonth();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data: ClientsByInteractionData[] = [];

    // Historical cumulative data (simulated for demonstration)
    // In a real application, you would fetch cumulative client and interaction counts
    // for each historical month.
    const historicalCumulativeData = [
      { month: 'Jan', totalClients: 50, totalInteractions: 500 },
      { month: 'Fév', totalClients: 60, totalInteractions: 700 },
      { month: 'Mar', totalClients: 75, totalInteractions: 950 },
      { month: 'Avr', totalClients: 80, totalInteractions: 1100 },
    ];

    for (let i = 0; i <= currentMonthIndex; i++) {
      let cumulativeClients: number;
      let cumulativeInteractions: number;

      if (i < historicalCumulativeData.length) {
        // Use historical mock data
        cumulativeClients = historicalCumulativeData[i].totalClients;
        cumulativeInteractions = historicalCumulativeData[i].totalInteractions;
      } else if (i === currentMonthIndex) {
        // For the CURRENT month, use the actual fetched cumulative data
        cumulativeClients = this.currentTotalClients;
        cumulativeInteractions = this.currentTotalInteractions;
        if (cumulativeInteractions === 0) cumulativeInteractions = 1; // Avoid division by zero
      } else {
        // For future months, project cumulative data
        const lastMonthData = data[data.length - 1];
        let projectedClients = lastMonthData.conversionRate / 100 * (lastMonthData.conversionRate * 100) + Math.floor(Math.random() * 5) + 1; // Simple growth projection
        let projectedInteractions = projectedClients / (lastMonthData.conversionRate / 100) + Math.floor(Math.random() * 50) + 10; // Simple growth projection
        if (isNaN(projectedInteractions) || !isFinite(projectedInteractions) || projectedInteractions === 0) {
          projectedInteractions = (lastMonthData.conversionRate > 0 ? projectedClients / (lastMonthData.conversionRate / 100) : projectedClients * 20) + Math.floor(Math.random() * 50) + 10;
        }

        cumulativeClients = Math.round(projectedClients);
        cumulativeInteractions = Math.round(projectedInteractions);
        if (cumulativeInteractions === 0) cumulativeInteractions = 1; // Avoid division by zero
      }

      const conversionRate = cumulativeInteractions > 0
        ? (cumulativeClients / cumulativeInteractions) * 100
        : 0;

      data.push({
        month: monthNames[i],
        conversionRate: parseFloat(conversionRate.toFixed(1))
      });
    }
    return of(data);
  }

  prepareStats(data: DashboardCombinedData): void {
    const conversionRate = data.prospects > 0
      ? (data.clients / data.prospects) * 100
      : 0;

    const wonOffersCount = data.offerStatusDistribution.GAGNE || 0;
    const lostOffersCount = data.offerStatusDistribution.PERDU || 0;
    const negotiationOffersCount = data.offerStatusDistribution.EN_NEGOCIATION || 0;
    const totalPersonalOffersCount = wonOffersCount + lostOffersCount + negotiationOffersCount;
    const winRatePersonalOffers = totalPersonalOffersCount > 0 ? (wonOffersCount / totalPersonalOffersCount) * 100 : 0;

    const totalGeneralOffers = data.totalGeneralOffers || 0;

    this.stats = [
      {
        title: 'Prospects Actifs',
        count: data.prospects,
        new: data.newProspectsThisMonth,
        trend: this.getTrend(data.newProspectsThisMonth),
        icon: 'person_add',
        color: 'bg-blue-100 text-blue-600',
        route: '/components/prospect',
        description: 'Total des prospects actuellement suivis.'
      },
      {
        title: 'Clients Convertis',
        count: data.clients,
        new: data.newClientsThisMonth,
        trend: this.getTrend(data.newClientsThisMonth),
        icon: 'person',
        color: 'bg-purple-100 text-purple-600',
        route: '/components/client',
        percentage: conversionRate,
        description: `Nombre de clients ayant finalisé une conversion. Taux: ${conversionRate.toFixed(1)}%.`
      },
      {
        title: 'Affaires en Négociation',
        count: negotiationOffersCount,
        new: undefined,
        trend: 'stable',
        icon: 'pending_actions',
        color: 'bg-indigo-100 text-indigo-600',
        route: '/components/offrepersonelle',
        description: 'Affaires personnelles actuellement en phase de négociation.'
      },
      {
        title: 'Affaires Générales',
        count: totalGeneralOffers,
        new: undefined,
        trend: 'stable',
        icon: 'storefront',
        color: 'bg-yellow-100 text-yellow-600',
        route: '/components/offregenerale',
        description: 'Nombre total d\'Affaires générales proposées.'
      },
      {
        title: 'Sondages Envoyés',
        count: data.sondageStats.nombreTotalSondages,
        new: undefined,
        trend: 'stable',
        icon: 'forum',
        color: 'bg-red-100 text-red-600',
        route: '/components/sondage',
        description: `Total des sondages créés et distribués.`
      },
      {
        title: 'Affaires Perso. Gagnées',
        count: wonOffersCount,
        new: undefined,
        trend: this.getTrend(wonOffersCount),
        icon: 'emoji_events',
        color: 'bg-green-100 text-green-600',
        route: '/components/offrepersonelle',
        percentage: winRatePersonalOffers,
        description: `Nombre d'Affaires personnelles remportées. Taux: ${winRatePersonalOffers.toFixed(1)}%.`
      }
    ];
  }

  prepareCharts(data: DashboardCombinedData): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--primary-color') || '#4f46e5';
    const successColor = documentStyle.getPropertyValue('--green-500') || '#10b981';
    const dangerColor = documentStyle.getPropertyValue('--red-500') || '#ef4444';
    const warningColor = documentStyle.getPropertyValue('--yellow-500') || '#eab308';
    const infoColor = documentStyle.getPropertyValue('--blue-500') || '#3B82F6';
    const purpleColor = documentStyle.getPropertyValue('--purple-500') || '#a855f7';
    const orangeColor = documentStyle.getPropertyValue('--orange-500') || '#f97316';

    // 1. Clients by Interactions Chart (Line Chart) - UPDATED
    const clientEvolutionLabels = data.clientsByInteractions.map((item: ClientsByInteractionData) => item.month);
    // Use 'conversionRate' for the chart data
    const clientEvolutionValues = data.clientsByInteractions.map((item: ClientsByInteractionData) => item.conversionRate);

    this.clientsByInteractionsData = {
      labels: clientEvolutionLabels,
      datasets: [
        {
          label: 'Taux Cumulé Clients / Interactions (%)', // New label for the chart
          data: clientEvolutionValues,
          fill: false,
          borderColor: primaryColor,
          tension: 0.4
        }
      ]
    };

    // clientsByInteractionsOptions were already updated in initCharts() to handle percentages

    // 2. Offer Status Pie Chart
    const wonOffers = data.offerStatusDistribution.GAGNE || 0;
    const lostOffers = data.offerStatusDistribution.PERDU || 0;
    const negotiationOffers = data.offerStatusDistribution.EN_NEGOCIATION || 0;

    this.offerStatusPieData = {
      labels: ['Gagnées', 'Perdues', 'En Négociation'],
      datasets: [
        {
          data: [wonOffers, lostOffers, negotiationOffers],
          backgroundColor: [successColor, dangerColor, warningColor],
          hoverBackgroundColor: [successColor, dangerColor, warningColor]
        }
      ]
    };

    // 3. Monthly Activity Chart (Bar Chart)
    const monthlyActivityLabels = data.monthlyActivity.map((item: MonthlyActivityData) => item.month);
    const newProspectsData = data.monthlyActivity.map((item: MonthlyActivityData) => item.newProspects);
    const newClientsData = data.monthlyActivity.map((item: MonthlyActivityData) => item.newClients);
    const newPersonalOffersData = data.monthlyActivity.map((item: MonthlyActivityData) => item.newPersonalOffers);
    const sentSurveysData = data.monthlyActivity.map((item: MonthlyActivityData) => item.sentSurveys);

    this.monthlyActivityData = {
      labels: monthlyActivityLabels,
      datasets: [
        {
          label: 'Nouveaux Prospects',
          backgroundColor: infoColor,
          borderColor: infoColor,
          data: newProspectsData
        },
        {
          label: 'Nouveaux Clients',
          backgroundColor: purpleColor,
          borderColor: purpleColor,
          data: newClientsData
        },
        {
          label: 'Nouvelles Affaires',
          backgroundColor: orangeColor,
          borderColor: orangeColor,
          data: newPersonalOffersData
        },
        {
          label: 'Sondages Envoyés',
          backgroundColor: successColor,
          borderColor: successColor,
          data: sentSurveysData
        }
      ]
    };
  }

  prepareKeyInsight(data: DashboardCombinedData): void {
    const newProspectsTrend = this.getTrend(data.newProspectsThisMonth);

    if (newProspectsTrend === 'down' && data.newProspectsThisMonth < 5 && data.prospects > 0) {
      this.keyInsight = {
        message: 'Alerte ! La croissance des prospects ralentit. Envisagez de booster vos actions d\'acquisition.',
        type: 'warning',
        icon: 'gpp_bad'
      };
    }
    else if (data.topProspects.length >= 3) {
      this.keyInsight = {
        message: `Vous avez ${data.topProspects.length} prospects très engagés. C'est le moment de les convertir !`,
        type: 'info',
        icon: 'lightbulb'
      };
    } else {
      this.keyInsight = null;
    }
  }

  private getTrend(value: number | undefined): 'up' | 'down' | 'stable' {
    if (value === undefined || value === null) return 'stable';
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'stable';
  }

  getTrendIcon(trend: string): string {
    return {
      'up': 'trending_up',
      'down': 'trending_down',
      'stable': 'trending_flat'
    }[trend] || 'trending_flat';
  }

  getTrendColor(trend: string): string {
    return {
      'up': 'text-green-500',
      'down': 'text-red-500',
      'stable': 'text-gray-500'
    }[trend] || 'text-gray-500';
  }

  


}