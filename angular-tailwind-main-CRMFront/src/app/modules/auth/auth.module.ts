import { NgModule } from '@angular/core';

import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';
//import { TableRowComponent } from './pages/components/table-row/table-row.component';

@NgModule({
     imports: [
        HttpClientModule , AuthRoutingModule, AngularSvgIconModule.forRoot(), 
    ],
     providers: [
        provideHttpClient(withInterceptorsFromDi())
    
] })
export class AuthModule {}
