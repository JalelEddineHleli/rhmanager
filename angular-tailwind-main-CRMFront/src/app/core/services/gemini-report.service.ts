// src/app/services/gemini-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboardrapport } from 'src/app/modules/models/Dashboardraport';

@Injectable({
  providedIn: 'root'
})
export class GeminiReportService {

  // Assurez-vous que cette URL pointe vers votre Contact-Service Spring Boot
  private apiUrl = 'http://localhost:8486/api/ai';

  constructor(private http: HttpClient) { }

  /**
   * Envoie les données du tableau de bord au backend pour générer un résumé AI.
   * @param dashboardData L'objet contenant toutes les statistiques du tableau de bord.
   * @returns Un Observable du résumé généré par Gemini (string).
   */
  generateDashboardSummary(dashboardData: Dashboardrapport): Observable<string> {
    // La méthode POST enverra dashboardData dans le corps de la requête en tant que JSON.
    return this.http.post(`${this.apiUrl}/generate-summary`, dashboardData, { responseType: 'text' });
  }
}