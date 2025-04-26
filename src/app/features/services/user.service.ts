import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})

export class UserService {
 private baseUrl = 'https://localhost:7015/';
 
 constructor(private httpClient: HttpClient){
 }

 getUsers(senderId: number) : Observable<UserModel[]>{
   const params = new HttpParams()
   .set('senderId', Number(senderId))
    return this.httpClient.get<UserModel[]>(this.baseUrl + `users`, { params });
 }

 createUser(user: UserModel): Observable<any>{
   return this.httpClient.post<any>(this.baseUrl + `user`, user);
 }
}
