import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor() { }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // Example logic (use JWT, API calls, etc.)
  }

  logout(){
    localStorage.setItem('user', '');
  }
}
