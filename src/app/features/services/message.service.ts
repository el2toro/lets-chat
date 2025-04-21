import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageModel } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
 private baseUrl = 'https://localhost:7015/';

 constructor(private httpClient: HttpClient){
}

  sendMessage(mesage: MessageModel) : Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.baseUrl}message`, mesage);
  }

  getUserLastMessage(senderId: number, receiverId: number) : Observable<MessageModel>{
    const params = new HttpParams()
   .set('senderId', Number(senderId))
   .set('receiverId', Number(receiverId));

    return this.httpClient.get<MessageModel>(`${this.baseUrl}message`, { params });
  }

  markMessagesAsRead(senderId: number, receiverId: number) : Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}messages`, { senderId, receiverId });
  }

   getMessages(senderId: Number, receiverId: Number) : Observable<MessageModel[]>{
    const params = new HttpParams()
   .set('senderId', Number(senderId))
   .set('receiverId', Number(receiverId));
    return this.httpClient.get<MessageModel[]>(this.baseUrl + `messages/`, { params });
 }
}