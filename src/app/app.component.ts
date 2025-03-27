import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from "./features/pages/main-page/main-page.component";
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lets-chat';

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer){ 
      this.matIconRegistry.addSvgIcon('plus', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/plus.svg'));
      this.matIconRegistry.addSvgIcon('search', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/search.svg'));
      this.matIconRegistry.addSvgIcon('bell', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/bell.svg'));

      this.matIconRegistry.addSvgIcon('ellipsis-vertical', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/ellipsis-vertical.svg'));
      this.matIconRegistry.addSvgIcon('phone', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/phone.svg'));
    }
}
