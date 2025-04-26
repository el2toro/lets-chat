import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../features/services/user.service';
import { UserModel } from '../../features/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [MatButtonModule, MatCardModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule ]
})
export class SignupComponent implements OnInit {
  @Output() signInEvent = new EventEmitter<void>();
  signupForm!: FormGroup;
  user = new UserModel();

  
  passwordMatch() : boolean{
    const password = this.signupForm.get('password')?.value;
    const repeatPassword = this.signupForm.get('repeatPassword')?.value;
    return password === repeatPassword;
  }

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      surename: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      repeatPassword: ['', [Validators.required, Validators.pattern(passwordPattern)]]
    });

    this.signupForm.valueChanges.subscribe({
      next: () => this.mapUser()
    })
  }

  signIn() {
   this.signInEvent.emit();
  }

  signup() {
    this.userService.createUser(this.user).subscribe({
      next: () => this.signInEvent.emit(),
      error: (error) => console.log(error)
    })
  }

  private mapUser(){
    this.user.name = this.signupForm.controls['name'].value;
    this.user.surename = this.signupForm.controls['surename'].value;
    this.user.username = this.signupForm.controls['username'].value;
    this.user.email = this.signupForm.controls['email'].value;
    this.user.password = this.signupForm.controls['password'].value;
  }
}
