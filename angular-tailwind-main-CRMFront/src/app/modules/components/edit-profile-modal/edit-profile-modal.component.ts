import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserDto } from '../../models/user-dto';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
    
  ]
})
export class EditProfileModalComponent implements OnInit {
  user: UserDto = {
    selected: false,
    uuid: '',
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    roles: [],
    acceptTerms: false,
    enabled: false,
    createdAt: ''
  };

  constructor(
    public dialogRef: MatDialogRef<EditProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserDto | null }
  ) {}

  ngOnInit(): void {
    this.user = this.data.user ? { ...this.data.user } : this.getEmptyUser();
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(form: any): void {
    if (form.valid) {
        // Vérifier que l'email est présent avant de fermer le modal
        if (!this.user.email) {
            console.error('Email is required');
            return;
        }
        this.dialogRef.close(this.user);
    }
}
}