import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './../../core/login/login.component';
import { SignupComponent } from './../../core/signup/signup.component';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [MatButtonModule, MatCardModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule ]
})
export class LoginPageComponent implements AfterViewInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.loadLoginComponent();
  }

  async loadLoginComponent() {
    this.container.clear();
    const module = await import('./../../core/login/login.component');
    const loginRef = this.container.createComponent<LoginComponent>(module.LoginComponent);
  
    // 👇 Listen to the event from LoginComponent
    loginRef.instance.signupEvent.subscribe(() => {
      this.loadSignupComponent();
    });
  }
  
  async loadSignupComponent() {
    this.container.clear();
    const module = await import('./../../core/signup/signup.component');
    const signupRef =  this.container.createComponent<SignupComponent>(module.SignupComponent);

     // 👇 Listen to the event from LoginComponent
     signupRef.instance.signInEvent.subscribe(() => {
      this.loadLoginComponent();
    });
  }
}
