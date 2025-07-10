import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token: string | null = null;

    // Vérifiez si vous êtes côté client
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('tokenn'); // Utilisez localStorage uniquement côté client
    }
  
    
    //console.log("Token récupéré dans l'intercepteur:", token);

    if (token) {
    //  console.log("Ajout du token dans l'en-tête:", token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
     // console.log("Requête clonée avec headers:", request.headers);
    } else {
      console.warn("Aucun token trouvé dans localStorage.");
    }

    return next.handle(request);
  }
  
}