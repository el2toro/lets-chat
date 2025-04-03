import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss'],
  imports: [CommonModule]
})

export class UserMessageComponent implements OnInit {
 @Input() messages = <MessageModel[]>[];
 @Input() userFullName = '';
 @Input() loggedInUser!: UserModel;

  constructor() { }

  ngOnInit() {
  }

  hasResponse(id: number) : boolean{
    const index = this.messages.findIndex(m => m.id === id);

    if(index === 0){
      return this.messages[index].hasResponse
    }

    return this.messages[index - 1].hasResponse
   }
}
