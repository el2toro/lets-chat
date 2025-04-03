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
  loggedInUser = new UserModel;
  selectedUser = new UserModel;
  userClicked = false;
  isLoggedInUserMessage = false;
  receivedMessage = '';

  getLoggedInUserFullName() : string{
   return this.loggedInUser.name + ' ' + this.loggedInUser.surname;
  }

  getSelectedUserFullName() : string{
    return this.selectedUser.name + ' ' + this.selectedUser.surname;
  }

  isSendByLoggedInUser(id: Number) : boolean{
    return id === this.loggedInUser.id;
  }

  constructor(private userService: UserService, 
    private messageService: MessageService, 
    private authService: AuthService,
    private signalrService: SignalrService) { }

  ngAfterViewInit(): void {
    this.getUsers();
    this.setLogedInUser();
    // Start SignalR connection when component initializes
    this.signalrService.startConnection();

    // Subscribe to received messages
    this.signalrService.messages$.subscribe((message) => {
      this.messages.push(message);
      
      if(message.senderId !== this.loggedInUser.id){
        this.playSound();
      }
    });
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users.filter(u => u.id !== this.loggedInUser.id)
    })
  }

  onUserClick(user: UserModel){
    this.selectedUser = user;

    this.getMessages();
    this.userClicked = true;

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  getMessages(){
    this.messages = [];
    this.userService.getMessages(this.loggedInUser.id, this.selectedUser.id).subscribe({
      next: (response: MessageModel[]) => {
        this.messages.push(...response);
        this.loadComponent();
      }
    });

    this.userService.getMessages(this.selectedUser.id, this.loggedInUser.id).subscribe({
      next: (response: MessageModel[]) => { 
        this.messages.push(...response);
        this.loadComponent();
      }
    })
  }

  sendMessage(){
    const message = this.buildMessage();

    this.signalrService.sendMessage(message);
   // this.message = '';  // Clear the input field

    this.messageService.sendMessage(message).subscribe({
      next: () => this.messageContent = ''
    })
  }

  buildMessage() : MessageModel{
   let message = new MessageModel();
   message.content = this.messageContent;
   message.senderId = this.loggedInUser.id;
   message.receiverId = this.selectedUser.id;

   return message;
  }

  setLogedInUser(){
    this.loggedInUser = this.authService.getLoggedInUser();
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
    componentRef.instance.loggedInUser = this.loggedInUser;
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
