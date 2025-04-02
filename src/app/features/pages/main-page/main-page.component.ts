import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MessageModel } from '../../models/message.model';
import { UserModel } from '../../models/user.model';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [MatIconModule, CommonModule, FormsModule]
})
export class MainPageComponent implements OnInit {
  messagesUser1 = <MessageModel[]>[];
  messagesUser2 = <MessageModel[]>[];
  users = <UserModel[]>[];
  selectedConversation = <MessageModel[]>[];
  message = new MessageModel();
  messageContent = '';

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users
    })
  }

  onUserClick(user: UserModel){
    this.getMessages(user);
  }

  getMessages(user: UserModel){
    this.userService.getMessages(1, user.id).subscribe({
      next: (response: MessageModel[]) => this.messagesUser1 = response
    })

    this.userService.getMessages(1, user.id).subscribe({
      next: (response: MessageModel[]) => this.messagesUser2 = response
    })
  }

  sendMessage(){
   const message = this.buildMessage()
    console.log(message)

    this.messageService.sendMessage(message).subscribe({
      next: () => console.log("message sent")
    })
  }

  buildMessage() : MessageModel{
   let message = new MessageModel();
   message.content = this.messageContent;
   message.senderId = 1;
   message.receiverId = 2;

   return message;
  }
}
