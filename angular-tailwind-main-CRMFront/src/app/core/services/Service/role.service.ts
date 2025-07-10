import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UUID } from 'crypto';
import { AppRole } from 'src/app/modules/models/app-role';



@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8222/roleapi'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Ajouter un rôle
  addRole(role: AppRole): Observable<void> {
    return this.http.post<void>(this.apiUrl, role);
  }

  // Supprimer un rôle
  deleteRole(uuid: UUID): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  // Récupérer tous les rôles
  getAllRoles(): Observable<AppRole[]> {
    return this.http.get<AppRole[]>(this.apiUrl);
  }

  // Récupérer un rôle par ID
  getRoleById(id: string): Observable<AppRole> {
    return this.http.get<AppRole>(`${this.apiUrl}/${id}`);
  }
}
