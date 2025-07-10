import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, Validators, FormControl } from '@angular/forms'; // Importez Validators et FormControl
import { Router, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { AppRole } from 'src/app/modules/models/app-role';
import { UserDto } from 'src/app/modules/models/user-dto';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [FormsModule, AngularSvgIconModule, ButtonComponent, CommonModule, RouterModule],
})
export class SignUpComponent implements OnInit {
  user: UserDto = {
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
    selected: false,
    uuid: '',
    createdAt: '',
  
  };

  roless: AppRole[] = [];

  // Ajout des FormControl pour la validation des motifs
  emailControl = new FormControl('', [Validators.required
  ]);
  phoneControl = new FormControl('', [Validators.required]); // Exemple: 8 chiffres

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { } // Inject MatSnackBar
  ngOnInit(): void {
    this.authService.getAllRoles().subscribe({
      next: (roles) => {
        // Filtrer pour exclure ADMIN et SUPER_ADMIN
        this.roless = roles.filter(role =>
          role.role !== 'ADMIN' && role.role !== 'SUPER_ADMIN'
        );
        console.log('Rôles filtrés :', this.roless);
      },
      error: (err) => console.error('Échec du chargement des rôles :', err),
    });
  }
  

  onSubmit(registerForm: NgForm): void {
    if (registerForm.valid ) { // Vérifiez la validité des FormControl
      const formData = { ...this.user };

      if (this.user.roles && !Array.isArray(this.user.roles)) {
        this.user.roles = [this.user.roles];
      }

      if (Array.isArray(this.user.roles) && this.user.roles.length > 0) {
        formData.roles = this.user.roles.map((role: AppRole) => ({
          id: role.id,
          role: role.role,
          uuid: role.uuid,
        }));
      } else {
        console.error('Aucun rôle sélectionné ou roles n\'est pas un tableau:', this.user.roles);
      }

      console.log('Données envoyées au backend :', formData);

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Inscription réussie :', response);
          this.showSuccessToast("Inscription réussie !");
          this.router.navigate(['auth/sign-in']);
        },
        error: (err) => {
          console.error("Échec de l'inscription :", err);
          this.showErrorToast("Échec de l'inscription. Veuillez vérifier vos informations."); // Affichez un toast en cas d'erreur
        },
      });
    } else {
      this.showErrorToast('Veuillez remplir tous les champs correctement.'); // Affichez un toast si le formulaire est invalide
    }
  }

  onRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);

    const selectedRoles = selectedOptions.map((option) => {
      const role = this.roless.find((r) => r.role === option.value);
      if (!role) {
        throw new Error(`Rôle non trouvé : ${option.value}`);
      }
      return role;
    });

    this.user.roles = selectedRoles;
    console.log("Rôles sélectionnés :", this.user.roles);
  }

  // Méthode pour afficher un toast d'erreur
  private showErrorToast(message: string): void {
    const config: MatSnackBarConfig = {
      duration: 5000, // Durée d'affichage du toast
      panelClass: ['error-snackbar'], // Classe CSS pour le style (à définir dans styles.css)
      verticalPosition: 'top', // Position du toast
      horizontalPosition: 'right'
    };
    this.snackBar.open(message, 'Fermer', config);
  }
  private showSuccessToast(message: string): void {
    this.snackBar.open(`✅ ${message}`, 'Fermer', {
        duration: 3000,
        panelClass: ['mat-mdc-snack-bar-container', 'success-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
    });
}
}
