import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [FormsModule, RouterLink, ButtonComponent],
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.demanderReinitialisation(this.email).subscribe({
      next: () => {
        this.successMessage = 'Un e-mail a été envoyé avec les instructions pour réinitialiser votre mot de passe.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}
