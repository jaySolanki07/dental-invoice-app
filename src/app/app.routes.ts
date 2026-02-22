import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceFormComponent } from './invoice/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './invoice/invoice-preview/invoice-preview.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'invoice', component: InvoiceFormComponent },
      { path: 'preview', component: InvoicePreviewComponent },
      { path: '', redirectTo: 'invoice', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];