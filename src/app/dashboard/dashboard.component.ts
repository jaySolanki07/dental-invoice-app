import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from '../shared/material.imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, ...MATERIAL_IMPORTS],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    constructor(private router: Router) {}

  logout(): void {
    localStorage.setItem('loggedIn', 'false');
    this.router.navigate(['/login']);
  }
}
