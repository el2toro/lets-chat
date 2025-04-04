import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../features/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private httpClient: HttpClient, private jwtHelperService: JwtHelperService) { }
private baseUrl = 'https://localhost:7015';

  getLoggedInUser(): UserModel{
    return JSON.parse(localStorage.getItem('user') as string) as UserModel;
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, { username, password });
  }

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  saveLoggedInUserId(userId: number) {
    localStorage.setItem('userId', userId.toString());
  }

  saveLoggedInUserFullName(userFullName: string) {
    localStorage.setItem('userFullName', userFullName);
  }

  getLoggedInUserId() : number {
    return Number(localStorage.getItem('userId'));
  }

  getLoggedInUserFullName() : string {
    return localStorage.getItem('userFullName') ?? '';
  }

  getToken(): string {
    return localStorage.getItem('jwt') ?? '';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelperService.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('jwt');
  }
}
