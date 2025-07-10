import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import packageJson from '../../../../../../package.json';
import { MenuService } from '../../services/menu.service';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [NgClass, NgIf, AngularSvgIconModule, SidebarMenuComponent],
})
export class SidebarComponent implements OnInit {
  public appJson: any = packageJson;
  public isSuperAdmin: boolean = false;
  constructor(public menuService: MenuService) {}

  ngOnInit(): void { const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isSuperAdmin = roles.includes('SUPER_ADMIN');}

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }
}
