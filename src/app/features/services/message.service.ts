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
    return this.httpClient.post<boolean>(this.baseUrl + `message`, mesage);
 }
}