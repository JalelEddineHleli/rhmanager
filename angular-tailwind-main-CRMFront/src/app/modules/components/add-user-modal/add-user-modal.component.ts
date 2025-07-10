import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppRole } from '../../models/app-role';
import { UserDto } from '../../models/user-dto';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
})
export class AddUserModalComponent implements OnInit {
  user: UserDto = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',

    enabled: true,
    selected: false,
    uuid: '',
    id: '',
    password: '',
    confirmPassword: '',
    roles: [],
    acceptTerms: false,
    createdAt: ''
  };

  isLoading = false;
  roless: AppRole[] = [];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.authService.getAllRoles().subscribe({
      next: (roles) => {
        // Filtrer pour exclure les rôles ADMIN et SUPER_ADMIN
        this.roless = roles.filter(role =>
          role.role.toUpperCase() !== 'ADMIN' && role.role.toUpperCase() !== 'SUPER_ADMIN'
        );
        console.log('Rôles filtrés :', this.roless);
      },
      error: (err) => console.error('Échec du chargement des rôles :', err),
    });
  }
  

  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
     
      this.authService.ajouteruserparadmin(this.user).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur créé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          this.snackBar.open('Erreur lors de la création de l\'utilisateur', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
