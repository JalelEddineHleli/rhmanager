import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from '../../services/menu.service';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { AuthService } from 'src/app/core/services/Service/auth.service';
import { UserDto } from 'src/app/modules/models/user-dto';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/Service/user.service';
import { Notif } from 'src/app/modules/models/notif';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    AngularSvgIconModule,
    NavbarMenuComponent,
    ProfileMenuComponent,
    NavbarMobileComponent,
    CommonModule
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  constructor(
    private ngZone: NgZone,
    private menuService: MenuService,
    private authService: AuthService,
    private userservice: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  profileData: UserDto | undefined;
  notif: Notif[] = [];
  isLoading = true;
  error: string | null = null;
  notificationCount: number = 0;
  unreadNotificationCount: number = 0;
  showNotifications: boolean = false;
  readNotifications: Set<string> = new Set();
  isSuperAdmin = false;
  notificationAccess: boolean = false;

  ngOnInit(): void {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isSuperAdmin = roles.includes('SUPER_ADMIN');
    this.loadReadNotifications();
    if(this.showNotifications==true){
      this.loadReadNotifications();

    }

    this.loadProfile();
    
   /* this.notificationSocket.getNotifications().subscribe((notif: Notif) => {
      console.log("📩 Nouvelle notification WebSocket :", notif); 
      this.handleNewNotification(notif);
    });*/

  }





  private destroy$ = new Subject<void>();


  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.saveReadNotifications();
  }




  

  private loadReadNotifications(): void {
    const readNotifications = localStorage.getItem('readNotifications');
    if (readNotifications) {
      this.readNotifications = new Set(JSON.parse(readNotifications));
    }
  }

  private saveReadNotifications(): void {
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(this.readNotifications)));
  }
  trackByNotification(index: number, item: Notif): string {
    return item.uuid; // ou un identifiant unique
  }
  lastUpdate = new Date();
  private handleNewNotification(notif: Notif): void {
    // Crée un nouveau tableau pour déclencher la détection de changement
    this.notif = [notif, ...this.notif];
    this.notificationCount = this.notif.length;
    
    if (!this.readNotifications.has(notif.uuid)) {
      this.unreadNotificationCount += 1;
    }
    
    // Force le rafraîchissement de la vue
    this.cdr.detectChanges();
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }

  loadProfile(): void {
    this.authService.getprofile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.isLoading = false;
        this.loadNotifications();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  loadNotifications(): void {
    this.userservice.getNotifications().subscribe({
      next: (notifications) => {
        this.notif = notifications;
        this.notificationCount = notifications.length;
        this.updateUnreadCount();
      },
      error: (err) => {
        console.error('Erreur chargement historique notifications', err);
      }
    });
  }

  private updateUnreadCount(): void {
    this.unreadNotificationCount = this.notif.filter(
      n => !this.readNotifications.has(n.uuid)
    ).length;
  }

  openNotifications(): void {
    this.showNotifications = !this.showNotifications;
    
    if (this.showNotifications && this.unreadNotificationCount > 0) {
      this.loadNotifications();
      this.markNotificationsAsRead();
    }
  }

  private markNotificationsAsRead(): void {
    // Marquer toutes les notifications actuelles comme lues
    this.notif.forEach(n => this.readNotifications.add(n.uuid));
    this.unreadNotificationCount = 0;
    this.saveReadNotifications();
    this.loadNotifications();
    
    // Optionnel: Sauvegarder côté serveur
    this.markNotificationsAsReadOnServer();
  }

  private markNotificationsAsReadOnServer(): void {
    // Implémentez cette méthode si vous voulez sauvegarder côté serveur
    // this.userservice.markNotificationsAsRead().subscribe();
  }
}