import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss'],
  imports: [CommonModule]
})
export class UserMessageComponent implements OnInit {
 @Input() messages = <MessageModel[]>[];
 @Input() userFullName = '';

  constructor() { }

  ngOnInit() {
  }

}
