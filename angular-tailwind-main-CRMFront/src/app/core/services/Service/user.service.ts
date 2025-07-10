import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid'; // Pour générer des UUID si nécessaire
//import { UUID } from 'crypto';
import { AppRole } from 'src/app/modules/models/app-role';
import { UserDto } from 'src/app/modules/models/user-dto';
import { Notif } from 'src/app/modules/models/notif';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8222/userapi/user' ; // Définir l'URL de l'API, par exemple "http://localhost:8080/userapi"

  constructor(private http: HttpClient) { }

  // Créer un nouvel utilisateur
  createUser(user: UserDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, user);
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/getall`);
  }

  // Récupérer les rôles d'un utilisateur
 /* getUserRoles(userId: UUID): Observable<AppRole[]> {
    return this.http.get<AppRole[]>(`${this.apiUrl}/users/${userId}/roles`);
  }

  // Supprimer un utilisateur
  deleteUser(uuid: UUID): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }*/

  // Récupérer un utilisateur par ID
  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }
  getAllUsersSearch(
    firstname: string = '',
    lastname: string = '',
    email: string = '',
    startdate: Date | null = null,
    enddate: Date | null = null,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('firstname', firstname)
      .set('lastname', lastname)
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (startdate) {
      params = params.set('startdate', startdate.toISOString());
    }
    if (enddate) {
      params = params.set('enddate', enddate.toISOString());
    }
  
    return this.http.get(`${this.apiUrl}/user/searchall`, { params });
  }
    // Autocomplétion des utilisateurs par nom ou prénom
    autocompleteUsers(query: string): Observable<UserDto[]> {
      return this.http.get<UserDto[]>(`${this.apiUrl}/autocomplete?query=${query}`);
    }
    autocompleteUsersemail(query: string): Observable<UserDto[]> {
      return this.http.get<UserDto[]>(`${this.apiUrl}/autocompletemail?query=${query}`);
    }
    getNotifications(): Observable<Notif[]> {
      return this.http.get<Notif[]>(`http://localhost:8222/api/notifications/getall`);
    }
    
  
}
