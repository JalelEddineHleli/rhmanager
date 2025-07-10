import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UikitComponent } from './uikit.component';
import { TableComponent } from './pages/table/table.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';



import { ProfileComponent } from '../components/profile/profile.component';
import { EmployeeListComponent } from '../components/employee-list/employee-list.component';
import { AddEmployeeComponent } from '../components/add-employee/add-employee.component';
import { EditEmployeeComponent } from '../components/edit-employee/edit-employee.component';
import { DepartmentListComponent } from '../components/department-list/department-list.component';




//import { UsersComponent } from '../auth/pages/users.component';

const routes: Routes = [
  {
    path: '',
    component: UikitComponent,
    children: [
      { path: '', redirectTo: 'components', pathMatch: 'full' },
      { path: 'table', component: TableComponent,
      // canActivate: [RoleGuard],
       
       },
    
       { path: 'profile', component: ProfileComponent },
        { path: 'employees', component: EmployeeListComponent },
        { path: 'addemployees', component: AddEmployeeComponent },
        { path: 'editemployees', component: EditEmployeeComponent },
        { path: 'departments', component: DepartmentListComponent },
     
   
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UikitRoutingModule {}
