import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginData: LoginRequest = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService.login(this.loginData);
      if (!response.success) {
        this.errorMessage = response.message;
      }
      // Firebase auth service handles navigation automatically on success
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Error de conexión';
    } finally {
      this.isLoading = false;
    }
  }
}
