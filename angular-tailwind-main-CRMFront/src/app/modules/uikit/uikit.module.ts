import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UikitRoutingModule } from './uikit-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/core/interceptor/auth.interceptor';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UikitRoutingModule,
    RouterModule,
  ]
})
export class UikitModule { }
