import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 private baseUrl = 'https://localhost:7015/';
 
 constructor(private httpClient: HttpClient){
 }

//  getMessages(userId: Number, withUserId: Number) : Observable<MessageModel[]>{
//     const params = new HttpParams()
//    .set('userId', Number(userId))
//    .set('withUserId', Number(withUserId));
//     return this.httpClient.get<MessageModel[]>(this.baseUrl + `user/`, { params });
//  }

 getUsers(senderId: number) : Observable<UserModel[]>{
   const params = new HttpParams()
   .set('senderId', Number(senderId))
    return this.httpClient.get<UserModel[]>(this.baseUrl + `users`, { params });
 }
}
