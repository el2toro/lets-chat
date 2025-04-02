// Import necessary modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatButtonModule, MatCardModule, MatInputModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    console.log('it works')
    this.isSubmitted = true;
    if (true) {
      localStorage.setItem('user', JSON.stringify(this.loginForm.value)); // Simulate login
      this.router.navigate(['']);
    }
  }
}
