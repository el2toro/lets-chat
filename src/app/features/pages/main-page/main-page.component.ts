import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MessageModel } from '../../models/message.model';
import { UserModel } from '../../models/user.model';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../../services/auth.service';
import { UserMessageComponent } from "../../components/user-message/user-message.component";
import { DynamicHostDirective } from '../../../directives/dynamic-host.directive';
import { SignalrService } from '../../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [MatIconModule, CommonModule, FormsModule, DynamicHostDirective]
})
export class MainPageComponent implements AfterViewInit  {
  @ViewChild(DynamicHostDirective) dynamicHost!: DynamicHostDirective;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages = <MessageModel[]>[];
  users = <UserModel[]>[];
  message = new MessageModel();
  messageContent = '';
  loggedInUserId = 0;
  loggedInUserFullName = ''
  selectedUser = new UserModel;
  userClicked = false;

  onlineUsers: Number[] = [];
  private onlineUsersSubscription!: Subscription;

  getSelectedUserFullName() : string{
    return this.selectedUser.fullName;
  }

  isUserOnline(userId: number) : boolean{
    return this.onlineUsers.some(u => Number(u) === Number(userId));
  }

  constructor(private userService: UserService, 
    private messageService: MessageService, 
    private authService: AuthService,
    private signalrService: SignalrService) { }

  ngAfterViewInit(): void {
    this.setLogedInUser();
    this.getUsers();
    
    // Start SignalR connection when component initializes
    this.signalrService.startConnection();

    // Subscribe to received messages
    this.signalrService.messages$.subscribe((message) => {
      this.messages.push(message);
      
      if(message.senderId !== this.loggedInUserId){
        this.playSound();
      }
    });

    this.onlineUsersSubscription = this.signalrService.onlineUsers$.subscribe(
      (users) => {
        this.onlineUsers = users;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.onlineUsersSubscription) {
      this.onlineUsersSubscription.unsubscribe();
    }
  }

  getUsers(){
    this.userService.getUsers(this.loggedInUserId).subscribe({
      next: (users) => this.users = users.filter(u => u.id !== this.loggedInUserId)
    })
  }

  onUserClick(user: UserModel){
    this.selectedUser = user;

    this.getMessages();
    this.userClicked = true;

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);

    this.messageService.markMessagesAsRead(this.loggedInUserId, this.selectedUser.id).subscribe({
      next: () => console.log('messages marked as read')
    })
  }

  getMessages(){
    this.messages = [];
    this.userService.getMessages(this.loggedInUserId, this.selectedUser.id).subscribe({
      next: (response: MessageModel[]) => {
        this.messages.push(...response);
        this.loadComponent();
      }
    });

    this.userService.getMessages(this.selectedUser.id, this.loggedInUserId).subscribe({
      next: (response: MessageModel[]) => { 
        this.messages.push(...response);
        this.loadComponent();
      }
    })
  }

  sendMessage(){
    const message = this.buildMessage();

    this.signalrService.sendMessage(message);

    this.messageService.sendMessage(message).subscribe({
      next: () => this.messageContent = ''
    })
  }

  buildMessage() : MessageModel{
   let message = new MessageModel();
   message.content = this.messageContent;
   message.senderId = this.loggedInUserId;
   message.receiverId = this.selectedUser.id;

   return message;
  }

  setLogedInUser(){
    this.loggedInUserId = this.authService.getLoggedInUserId();
    this.loggedInUserFullName = this.authService.getLoggedInUserFullName();

    console.log('logged in user id: ', this.loggedInUserId)
    console.log('full name: ', this.loggedInUserFullName)
  }

  private loadComponent() {
    if (!this.dynamicHost) {
      console.error("Dynamic host is still not ready!");
      return;
    }
    
    const viewContainerRef = this.dynamicHost.viewContainerRef;
    viewContainerRef.clear(); // Clear previous components
    let componentRef!: ComponentRef<UserMessageComponent>;

    componentRef = viewContainerRef.createComponent(UserMessageComponent);
    componentRef.instance.messages = this.sortMessages();
    componentRef.instance.userFullName = this.getSelectedUserFullName();
    componentRef.instance.loggedInUserId = this.loggedInUserId;
  }

  private scrollToBottom() {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  private sortMessages(): MessageModel[]{
    return this.messages.sort((a, b) => (new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime()));
  }

  private playSound(): void {
    const audio = new Audio('assets/sounds/notification.wav');  
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
}
