import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [MatIconModule, CommonModule]
})
export class MainPageComponent implements OnInit {
  conversationItems = [1, 2, 3, 4, 5, 6, 7];

  constructor() { }

  ngOnInit() {
  }

}
