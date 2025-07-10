import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { UserDto } from 'src/app/modules/models/user-dto';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from 'src/app/core/services/Service/user.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog and MatDialogModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule

// Consider creating a separate component for the confirmation dialog
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>Êtes-vous sûr de vouloir {{ data.action }} cet utilisateur ?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: { action: string; confirmText: string }) {}
}

import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { AddUserModalComponent } from 'src/app/modules/components/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule,
    FormsModule,
    CommonModule,
    MatTooltipModule,
    MatIcon,
    AngularSvgIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule, 
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule 
   
  
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  users: UserDto[] = [];
  loading: boolean = false; // Use this to control the main loading state
  searchQuery: string = '';
  statusFilter: string = '';
  orderFilter: string = '1';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  nomFilter: any;
  prenomFilter: any;
  emailFilter: any;
  dateDebutFilter: any;
  dateFinFilter: any;
  autocompleteResultsName: UserDto[] = [];
  showAutocompleteName: boolean = false;
  autocompleteResultsEmail: UserDto[] = [];
  showAutocompleteEmail: boolean = false;
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  userActionLoading: { [key: string]: boolean } = {}; // To show loading per user action

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog ,
    private snackBar: MatSnackBar
  ) {}
  enabledFilter: boolean | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onAdvancedSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  resetFilters(): void {
    this.nomFilter = '';
    this.prenomFilter = '';
    this.emailFilter = '';
    this.dateDebutFilter = '';
    this.dateFinFilter = '';
    this.searchQuery = '';
    this.autocompleteResultsName = [];
    this.showAutocompleteName = false;
    this.autocompleteResultsEmail = [];
    this.showAutocompleteEmail = false;
    this.currentPage = 0;
    this.dateRange.reset();
    this.loadUsers();
    this.enabledFilter=null;
  }

  onToggleChange(event: MatSlideToggleChange, user: UserDto): void {
    const newStatus = event.checked;

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        action: newStatus ? 'activer' : 'désactiver',
        confirmText: 'Confirmer',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userActionLoading[user.uuid] = true; // Show spinner for this user
        if (newStatus) {
          this.authService.activateAccount(user.email).subscribe({
            next: () => {
              user.enabled = true;
              this.userActionLoading[user.uuid] = false; // Hide spinner
            },
            error: () => {
              event.source.checked = false; // Revert the toggle
              this.userActionLoading[user.uuid] = false; // Hide spinner
              // Optionally show an error message
            }
          });
        } else {
          this.authService.deactivateAccount(user.uuid).subscribe({
            next: () => {
              user.enabled = false;
              this.userActionLoading[user.uuid] = false; // Hide spinner
            },
            error: () => {
              event.source.checked = true; // Revert the toggle
              this.userActionLoading[user.uuid] = false; // Hide spinner
              // Optionally show an error message
            }
          });
        }
      } else {
        // User cancelled, revert the toggle
        event.source.checked = !newStatus;
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    const startDate = this.dateRange.value.start ? new Date(this.dateRange.value.start) : null;
    const endDate = this.dateRange.value.end ? new Date(this.dateRange.value.end) : null;
  
    // Si enabledFilter est null → appeler deux fois et combiner les résultats
    if (this.enabledFilter === null) {
      forkJoin([
        this.authService.getAllUsers(this.searchQuery, this.emailFilter, startDate, endDate, true, this.currentPage, this.pageSize),
        this.authService.getAllUsers(this.searchQuery, this.emailFilter, startDate, endDate, false, this.currentPage, this.pageSize)
      ]).subscribe({
        next: ([responseTrue, responseFalse]) => {
          const combinedUsers = [...responseTrue.content, ...responseFalse.content];
          this.users = combinedUsers;
          this.totalElements = combinedUsers.length;
          this.totalPages = 1; // ou adapter selon le besoin
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des utilisateurs (true/false)', err);
          this.loading = false;
        }
      });
    } else {
      this.authService.getAllUsers(this.searchQuery, this.emailFilter, startDate, endDate, this.enabledFilter, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.users = response.content;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des utilisateurs', err);
            this.loading = false;
          },
        });
    }
  }
  

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.currentPage = 0;
    this.loadUsers();
  }

  onSearchInputChange(value: string): void {
    this.searchQuery = value;
    if (this.searchQuery.length >= 2) {
      this.userService.autocompleteUsers(this.searchQuery).subscribe({
        next: (results) => {
          this.autocompleteResultsName = results;
          this.showAutocompleteName = true;
        },
        error: (err) => {
          console.error('Erreur lors de l\'autocomplétion du nom', err);
          this.autocompleteResultsName = [];
          this.showAutocompleteName = false;
        }
      });
    } else {
      this.autocompleteResultsName = [];
      this.showAutocompleteName = false;
    }
  }

  selectAutocompleteNameResult(user: UserDto): void {
    this.searchQuery = `${user.firstName} ${user.lastName}`;
    this.autocompleteResultsName = [];
    this.showAutocompleteName = false;
    // this.onAdvancedSearch(); // Lancer la recherche avec le nom complet sélectionné
  }

  onEmailInputChange(value: string): void {
    this.emailFilter = value;
    if (this.emailFilter.length >= 1) {
      this.userService.autocompleteUsersemail(this.emailFilter).subscribe({
        next: (results) => {
          this.autocompleteResultsEmail = results;
          this.showAutocompleteEmail = true;
        },
        error: (err) => {
          console.error('Erreur lors de l\'autocomplétion de l\'email', err);
          this.autocompleteResultsEmail = [];
          this.showAutocompleteEmail = false;
        }
      });
    } else {
      this.autocompleteResultsEmail = [];
      this.showAutocompleteEmail = false;
    }
  }

  selectAutocompleteEmailResult(user: UserDto): void {
    this.emailFilter = user.email;
    this.autocompleteResultsEmail = [];
    this.showAutocompleteEmail = false;
    this.onAdvancedSearch(); // Lancer la recherche avec l'email sélectionné
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleUserStatus(user: UserDto): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        action: user.enabled ? 'désactiver' : 'activer',
        confirmText: 'Confirmer',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userActionLoading[user.uuid] = true; // Show spinner for this user
        if (user.enabled) {
          this.authService.deactivateAccount(user.uuid).subscribe({
            next: () => {
              user.enabled = false;
              this.userActionLoading[user.uuid] = false;
              this.snackBar.open(`L'utilisateur ${user.firstName} ${user.lastName} a été désactivé.`, 'Fermer', {
                duration: 3000,
                panelClass: ['mat-mdc-snack-bar-container', 'success-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
            },
            error: (err) => {
              console.error('Erreur lors de la désactivation du compte', err);
              this.userActionLoading[user.uuid] = false;
              this.snackBar.open(`Erreur lors de la désactivation de l'utilisateur.`, 'Fermer', {
                duration: 3000,
                panelClass: ['mat-mdc-snack-bar-container', 'error-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
              // Optionally show an error message
            }
          });
        } else {
          this.authService.activateAccount(user.email).subscribe({
            next: () => {
              user.enabled = true;
              this.userActionLoading[user.uuid] = false;
              this.snackBar.open(`L'utilisateur ${user.firstName} ${user.lastName} a été activé.`, 'Fermer', {
                duration: 3000,
                panelClass: ['mat-mdc-snack-bar-container', 'success-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
            },
            error: (err) => {
              console.error('Erreur lors de l\'activation du compte', err);
              this.userActionLoading[user.uuid] = false;
              this.snackBar.open(`Erreur lors de l'activation de l'utilisateur.`, 'Fermer', {
                duration: 3000,
                panelClass: ['mat-mdc-snack-bar-container', 'error-snackbar'],
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
              // Optionally show an error message
            }
          });
        }
      }
    });
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '600px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir la liste des utilisateurs si un nouvel utilisateur a été ajouté
        this.loadUsers();
      }
    });
  }



}