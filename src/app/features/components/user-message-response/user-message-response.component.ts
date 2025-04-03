import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';

@Component({
  selector: 'app-user-message-response',
  templateUrl: './user-message-response.component.html',
  styleUrls: ['./user-message-response.component.scss'],
  imports: [CommonModule]
})
export class UserMessageResponseComponent implements OnInit {
  @Input() messages = <MessageModel[]>[];
  @Input() userFullName = '';
  
  constructor() { }

  ngOnInit() {
  }

}
