import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/Service/auth.service'; // Assurez-vous que le service est correct

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports : [ CommonModule, FormsModule]
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération du token depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.reinitialiserMotDePasse(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
        this.isLoading = false;

        // Redirection après succès
        this.router.navigate(['/auth/sign-in']).then(() => {
          console.log('Redirection vers /sign-in réussie.');
        }).catch((err) => {
          console.error('Erreur lors de la redirection :', err);
        });
      },
      error: (err) => {
        this.errorMessage = err.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.isLoading = false;
        console.error('Erreur lors de la réinitialisation :', err);
      }
    });
  }
}
