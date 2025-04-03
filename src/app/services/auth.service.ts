import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../features/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private httpClient: HttpClient) { }
private baseUrl = 'https://localhost:7015';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // Example logic (use JWT, API calls, etc.)
  }

  logout(){
    localStorage.removeItem('user');
  }

  login(userName: string, password: string): Observable<any>{
   return this.httpClient.post<any>(this.baseUrl + '/login', {userName: userName, password: password})
  }

  getLoggedInUser(): UserModel{
    return JSON.parse(localStorage.getItem('user') as string) as UserModel;
  }
}
