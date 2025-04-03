import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { MessageModel } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: HubConnection;
  private readonly _messageSubject = new BehaviorSubject<MessageModel>(new MessageModel());

  // Observable to get the messages
  public readonly messages$ = this._messageSubject.asObservable();

constructor() { }

// Initialize the SignalR connection
public startConnection(): void {
  this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7015/chathub')  // URL of your SignalR Hub
    .configureLogging(LogLevel.Information)
    .build();

  this.hubConnection
    .start()
    .then(() => {
      console.log('SignalR connection established');
    })
    .catch((err) => {
      console.error('Error while starting SignalR connection: ', err);
    });

  // Listen for messages from the SignalR hub
  this.hubConnection.on('ReceiveMessage', (message: MessageModel) => {
    this._messageSubject.next(message);
  });
}

// Method to send messages to the SignalR hub
public sendMessage(message: MessageModel): void {
  this.hubConnection
    .invoke('SendMessage', message)
    .catch((err) => console.error('Error sending message:', err));
}
}
