import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AppRole } from '../../../modules/models/app-role';
import { UserDto } from 'src/app/modules/models/user-dto';
import { Usermodel } from 'src/app/modules/models/usermodel';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSuperAdmin(): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes('SUPER_ADMIN');
  }
  
  
  private apiUrl = 'http://localhost:8091/userapi/this'; // URL de votre API Gateway
  private token: string;
 user!: Usermodel;
 islogged =false;
  constructor(private readonly _http: HttpClient) {
    this.token = localStorage.getItem("tokenn") || '';

    if (this.token) {
      try {
        this.user = this.getuser(this.token);
        console.log("Utilisateur extrait du token :", this.user);
      } catch (e) {
        console.error("Erreur de parsing du token :", e);
      }
    } else {
      console.warn("Aucun token trouvé dans le localStorage.");
    }
  }
 
  getEnabledEntities(): string[] {
    const config = JSON.parse(localStorage.getItem('moduleConfig') || '[]');
    return config.flatMap((mod: any) => mod.selectedEntities);
  }


  login(email: string, password: string) {
    return this._http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text' }).pipe(
      tap((response: string) => {
        if (response) {
          // Stocker le token dans le localStorage
          localStorage.setItem('tokenn', response);
          console.log("Token stocké dans localStorage :", response);
          this.user = this.getuser(response)
          this.islogged=true;
        } else {
          console.error("Aucun token reçu dans la réponse.");
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la connexion :", error);
        return throwError(error);
      })
    );
  }
  private getuser(token:string): Usermodel{
    return JSON.parse(atob(token.split('.')[1])) as Usermodel;
  }
  getAllRoles(): Observable<AppRole[]> {
    return this._http.get<any>(this.apiUrl);
  }
  getUserRoles(userId: string): Observable<AppRole[]> {
    return this._http.get<AppRole[]>(`${this.apiUrl}/${userId}/roles`);
  }
  

  register(userData: any) {
    return this._http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' }) 
      .pipe(
        tap((token: string) => {
          console.log("Token reçu:", token);
          localStorage.setItem('jwtToken', token);
        })
      );
  }
 /* getAllUsers(page: number, size: number): Observable<UserDto[]> {
    return this._http.get<any>(`${this.apiUrl}/users?page=${page}&size=${size}`)
      .pipe(
        map(response => response.content) // Extrait uniquement `content` pour avoir une liste
      );
  }*/
     /* getAllUsers(page: number, size: number, searchQuery?: string, statusFilter?: string, orderFilter?: string): Observable<any> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
    
        if (searchQuery) {
          params = params.set('search', searchQuery);
        }
        if (statusFilter) {
          params = params.set('status', statusFilter);
        }
        if (orderFilter) {
          params = params.set('order', orderFilter);
        }
    
        return this._http.get<any>(`${this.apiUrl}/users?page=${page}&size=${size}`);
      }*/
        // Méthode pour rechercher des utilisateurs avec pagination
  searchUsers(search: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('size', size.toString());

    return this._http.get('http://localhost:8091/userapi/user/search', { params });
  }
  logout(): Observable<any> {
    return this._http.post('http://localhost:8091/userapi/this/logout', {});
  }

  // Auth Service
/*activateAccount(token: string): Observable<string> {
  return this._http.post(
    `${this.apiUrl}/activate?token=${token}`, 
    null,  // No body needed for POST 
    { responseType: 'text' }  // Correct way to specify response type
  );
}*/
activateAccount(token: string): Observable<string> {
  const tenantId = this.user.tenant ||'default-tenant'; // ← à adapter selon ton modèle Usermodel

  const headers = new HttpHeaders({
    'X-User-Id': tenantId
  });
  return this._http.post(
    `http://localhost:8091/userapi/user/activate?token=${token}`, 
    null,
    { headers, responseType: 'text' }
  );
}


deactivateAccount(uuid: string): Observable<string> {
  return this._http.post(
    `http://localhost:8091/userapi/user/desactivate/${uuid}`,
    null,
    { responseType: 'text' }
  );
}
  
 // desactivateAccount(userId: number): Observable<string> {
   // return this._http.post<string>(`${this.apiUrl}/desactivate/${userId}`, {});
 // }


 // logout() {
   // localStorage.removeItem('token');
  //}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  demanderReinitialisation(email: string): Observable<any> {
    return this._http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  reinitialiserMotDePasse(token: string, nouveauMotDePasse: string): Observable<any> {
    return this._http.post(`${this.apiUrl}/reset-password`, { token, nouveauMotDePasse }, { responseType: 'text' });
  }
  changerMotDePasse(ancienMotDePasse: string, nouveauMotDePasse: string): Observable<any> {
    const body = { ancienMotDePasse, nouveauMotDePasse };
    return this._http.put(`${this.apiUrl}/change-password`, body,{ responseType: 'text' });
  }

 getprofile():Observable<any>{
  return this._http.get('http://localhost:8091/userapi/this/user/profile')

 }
 getAllUsersSearch(
  search: string = '',
 
  email: string = '',
  startdate: Date | null = null,
  enddate: Date | null = null,
  page: number = 0,
  size: number = 10
): Observable<any> {
  let params = new HttpParams()
    .set('search', search)
    
    .set('email', email)
    .set('page', page.toString())
    .set('size', size.toString());

  if (startdate) {
    params = params.set('startdate', startdate.toISOString());
  }
  if (enddate) {
    params = params.set('enddate', enddate.toISOString());
  }

  return this._http.get(`http://localhost:8091/userapi/user/searchall`, { params });
}

getAllUsers(
  search: string = '',
 
  email: string = '',
  startdate: Date | null = null,
  enddate: Date | null = null,
  enabled: boolean,
  page: number = 0,
  size: number = 10
): Observable<any> {
  let params = new HttpParams()
    .set('search', search)
    
    .set('email', email)
    .set('page', page.toString())
    .set('size', size.toString());
    if (enabled !== null && enabled !== undefined) {
      params = params.set('enabled', enabled.toString());
    }
  if (startdate) {
    params = params.set('startdate', startdate.toISOString());
  }
  if (enddate) {
    params = params.set('enddate', enddate.toISOString());
  }

  return this._http.get(`http://localhost:8091/userapi/users/search`, { params });
}

updateuser(email: string, user: UserDto): Observable<any> {
  return this._http.put(`http://localhost:8091/userapi/user/updateuser`, user, {
      params: { email },
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // éviter le parsing JSON
  });
}


// Dans auth.service.ts
ajouteruserparadmin(user: any): Observable<any> {
  return this._http.post(`http://localhost:8091/userapi/user/ajouteruserparadmin`, user);
}



}


