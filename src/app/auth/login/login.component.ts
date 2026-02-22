import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    MATERIAL_IMPORTS, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  isSubmitting: boolean = false;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { localStorage.setItem('loggedIn', 'false'); }

  ngOnInit(): void {

    if (localStorage.getItem('loggedIn') === 'true') {
      this.router.navigate(['/invoice']);
      return;
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.loginError = '';
    this.isSubmitting = true;

    const { username, password } = this.loginForm.value;

    // Fake auth
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/invoice']);
    } else {
      this.loginError = 'Invalid username or password';
    }

    this.isSubmitting = false;
  }
}

