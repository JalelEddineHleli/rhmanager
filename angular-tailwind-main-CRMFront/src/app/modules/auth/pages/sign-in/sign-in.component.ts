import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig } from 'src/app/modules/models/AppConfig';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers:[ ],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgIf, ButtonComponent, NgClass, HttpClientModule ],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  moduleConfig: AppConfig={

  }

  constructor(private readonly _formBuilder: FormBuilder, private readonly _router: Router , private readonly _authService  :AuthService
     ,private menuService : MenuService,  private snackBar: MatSnackBar
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
   /* this.moduleConfigService.getConfig(userId).subscribe((config:AppConfig) => {
      this.moduleConfig = config;
      localStorage.setItem('moduleConfig', JSON.stringify(config));
    });*/
    
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

 /* onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this._authService.login(this.form.value.email, this.form.value.password).subscribe(
      (response) => {
        
       
        this._router.navigate(['/components/table']); 
        
  });
}*/
decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Erreur de décodage du token', e);
    return null;
  }
}
onSubmit() {
  this.submitted = true;

  if (this.form.invalid) {
    if (this.f['email'].errors) {
      this.showErrorToast('Veuillez entrer une adresse email valide');
    }
    if (this.f['password'].errors) {
      this.showErrorToast('Le mot de passe est requis');
    }
    return;
  }

  const { email, password } = this.form.value;

  this._authService.login(email, password).subscribe({
    next: (token) => {
      localStorage.setItem('tokenn', token);

      const decoded = this.decodeToken(token);
      const roles: string[] = decoded?.roles || [];
      const tenantId = decoded?.tenant;
      
      if (tenantId) {
        localStorage.setItem('tenantId', tenantId);
      }
      
      localStorage.setItem('roles', JSON.stringify(roles));
      
     
        this.showSuccessToast('Connexion réussie');
        this._router.navigate(['/dashboard/nfts']);
        return;
      

      this._authService.getprofile().subscribe({
        next: (profile) => {
          const userUuid = profile.uuid;
          localStorage.setItem('userId', userUuid);

        
        },
        error: (err) => {
          console.error("Erreur lors de la récupération du profil:", err);
          this.showErrorToast('Erreur lors de la récupération du profil');
        },
      });
    },
    error: (err) => {
      console.error("Erreur de connexion:", err);
      this.showErrorToast('Email ou mot de passe incorrect');
    },
  });
}
/*onSubmit() {
  this.submitted = true;

  if (this.form.invalid) return;

  const { email, password } = this.form.value;

  this._authService.login(email, password).subscribe({
    next: (token) => {
      localStorage.setItem('tokenn', token);

      const decoded = this.decodeToken(token);
      const roles: string[] = decoded?.roles || [];
      const tenantId = decoded?.tenant;
      if (tenantId) {
        localStorage.setItem('tenantId', tenantId);
        console.log("Tenant ID sauvegardé:", tenantId);
      }
      localStorage.setItem('roles', JSON.stringify(roles));
      // Si SUPER_ADMIN → ne pas charger le profil/config, redirection directe
      if (roles.includes('SUPER_ADMIN')) {
        this._router.navigate(['/components/tracabilite']);
        return;
      }

      // Sinon, charger le profil + config
      this._authService.getprofile().subscribe({
        next: (profile) => {
          const userUuid = profile.uuid;
          localStorage.setItem('userId', userUuid);
          localStorage.setItem('roles', JSON.stringify(roles));
          //localStorage.setItem('tenantId', tenant);

          this.moduleConfigService.getConfig(userUuid).subscribe((config: AppConfig) => {
            this.moduleConfig = config;
            localStorage.setItem('moduleConfig', JSON.stringify(config));
            this.menuService.refreshMenu();

            this._router.navigate(['/dashboard/nfts']);
          });
        },
        error: (err) => {
          console.error("Erreur lors de la récupération du profil:", err);
        },
      });
    },
    error: (err) => {
      console.error("Erreur de connexion:", err);
    },
  });
}*/

private showSuccessToast(message: string): void {
  this.snackBar.open(`✅ ${message}`, 'Fermer', {
    duration: 3000,
    panelClass: ['success-snackbar'],
    horizontalPosition: 'right',
    verticalPosition: 'top'
  });
}

private showErrorToast(message: string): void {
  this.snackBar.open(`❌ ${message}`, 'Fermer', {
    duration: 5000,
    panelClass: ['error-snackbar'],
    horizontalPosition: 'right',
    verticalPosition: 'top'
  });
}
/*onSubmit() {
  this.submitted = true;
  const { email, password } = this.form.value;

  // stop here if form is invalid
  if (this.form.invalid) {
    return;
  }
  this._authService.login(this.form.value.email, this.form.value.password).subscribe({
    next: (response) => {
      const token = response;

      // Stocker le token
      localStorage.setItem('tokenn', token);

      // Appel pour récupérer les infos de l'utilisateur connecté
      this._authService.getprofile().subscribe({
        next: (profile) => {
          const userUuid = profile.uuid;

          // Stocker l'UUID
          localStorage.setItem('userId', userUuid);

          // Charger la configuration des modules
          this.moduleConfigService.getConfig(userUuid).subscribe((config: AppConfig) => {
            this.moduleConfig = config;
            localStorage.setItem('moduleConfig', JSON.stringify(config));
            console.log("moduleConfigmoduleConfig",  this.moduleConfig)
            this.menuService.refreshMenu();


            // Rediriger vers la table ou autre route
            this._router.navigate(['/dashboard/nfts']);
          });
        },
        error: (err) => {
          console.error("Erreur lors de la récupération du profil:", err);
        },
      });
    },
    error: (err) => {
      console.error("Erreur de connexion:", err);
    },
  });
}
*/
}
