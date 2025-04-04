import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatButtonModule, MatCardModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule ]
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.buildForm();
  }

  buildForm(){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login( this.loginForm.controls['username'].value, this.loginForm.get('password')?.value).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.authService.saveLoggedInUserFullName(response.fullName);
          this.authService.saveLoggedInUserId(response.userId);

          this.router.navigate(['']);
        }
      });
    }
  }
}
