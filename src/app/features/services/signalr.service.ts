import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { MessageModel } from '../models/message.model';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: HubConnection;
  private readonly _messageSubject = new BehaviorSubject<MessageModel>(new MessageModel());
  private readonly _usersSubject = new BehaviorSubject<UserModel[]>(<UserModel[]>[]);
  public readonly users$ = this._usersSubject.asObservable();
  private readonly _onlineUsersSubject = new BehaviorSubject<Number[]>([]);
  public readonly onlineUsers$ = this._onlineUsersSubject.asObservable();

  // Observable to get the messages
  public readonly messages$ = this._messageSubject.asObservable();

constructor(private authService: AuthService) { }

// Initialize the SignalR connection
public startConnection(): void {
  this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7015/chathub', {
      accessTokenFactory: () => this.authService.getToken() // Provide JWT token for SignalR connection
    })  // URL of your SignalR Hub
    //.configureLogging(LogLevel.Information)
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

   // Listen for UserOnline event
   this.hubConnection.on('UserOnline', (userId: number) => {
    console.log(`${userId} is online`);
    this.updateOnlineUsers();
  });

   // Listen for UserOffline event
   this.hubConnection.on('UserOffline', (userId: number) => {
    console.log(`${userId} is offline`);
    this.updateOnlineUsers();
  });
}

// Method to send messages to the SignalR hub
public sendMessage(message: MessageModel): void {
  this.hubConnection
    .invoke('SendMessage', message)
    .catch((err) => console.error('Error sending message:', err));
}

// Method to send messages to the SignalR hub
public getUsers(message: MessageModel): void {
  this.hubConnection.invoke('GetUsers').then((users: Number[]) => {
    this._onlineUsersSubject.next(users);
  });
}

 // Update online users list
 private updateOnlineUsers(): void {
  this.hubConnection.invoke('GetOnlineUsers').then((users: Number[]) => {
    this._onlineUsersSubject.next(users);
  });
}
}
