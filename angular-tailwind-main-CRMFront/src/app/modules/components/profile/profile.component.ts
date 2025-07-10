import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/core/services/Service/auth.service';
import { UserDto } from '../../models/user-dto';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ]
})
export class ProfileComponent implements OnInit {
  profileData: UserDto | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;
    
    this.authService.getprofile().subscribe({
      next: (data: UserDto) => {
        this.profileData = data || this.getEmptyUser();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Échec du chargement du profil.';
        this.isLoading = false;
        this.profileData = this.getEmptyUser();
      }
    });
  }

  private getEmptyUser(): UserDto {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      selected: false,
      uuid: '',
      id: '',
      password: '',
      confirmPassword: '',
      roles: [],
      acceptTerms: false,
      enabled: false,
      createdAt: ''
    };
  }

  retry(): void {
    this.loadProfile();
  }

  openEditProfileModal(): void {
    if (!this.profileData) {
      console.error('No profile data available');
      return;
    }

    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '450px',
      data: { user: { ...this.profileData } }
    });

    dialogRef.afterClosed().subscribe((result: UserDto | undefined) => {
      if (result) {
        this.updateProfile(result);
        
      }
    });
  }

  private updateProfile(updatedData: UserDto): void {
    this.isLoading = true;
    
    // Vérification renforcée de l'email
    if (!this.profileData?.email) {
        this.error = 'Email non disponible pour la mise à jour';
        this.isLoading = false;
        return;
    }

    // S'assurer que l'email est inclus dans les données envoyées
    const dataToSend = {
        ...updatedData,
        email: this.profileData.email ,
        createdAt: this.profileData.createdAt + 'T00:00:00'
        
        // Garantir que l'email est présent
    };

    this.authService.updateuser(this.profileData.email, dataToSend).subscribe({
      next: (updatedUser: UserDto) => {
        // Recharge le profil complet depuis backend
        this.loadProfile();
        this.isLoading = false;
        this.dialog.closeAll();  // ferme la modale si c’est un MatDialog
      },
      error: (err) => {
        this.error = err?.message || 'Échec de la mise à jour du profil.';
        this.isLoading = false;
      }
    });
    
}
}